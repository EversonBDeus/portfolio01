import { computed, watch } from 'vue'
import type { AuthLoginInput } from '~/schemas/auth-login'
import type { AuthRegisterInput } from '~/schemas/auth-register'
import { useOnboardingAccess } from '~/composables/useOnboardingAccess'
import { useSupabaseAuth } from '~/composables/useSupabaseAuth'

export const AUTH_MOCK_VERIFY_CODE = '123456'

export type AuthSession = {
  email: string
  username: string
  verified: boolean
  authenticatedAt: string
}

export type PendingVerification = {
  email: string
  username: string
  createdAt: string
  expiresAt: string
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function useAuthState() {
  //  =========== Cookies da Auth ================
  //  ----------- Sessão e Verificação --------------

  const session = useCookie<AuthSession | null>('portfolio-auth-session', {
    sameSite: 'lax',
    default: () => null
  })

  const pendingVerification = useCookie<PendingVerification | null>('portfolio-pending-verification', {
    sameSite: 'lax',
    default: () => null
  })

  const syncStarted = useState<boolean>('portfolio-auth-sync-started', () => false)

  const supabaseAuth = useSupabaseAuth()

  const {
    clearOnboardingAccess,
    keepOnboardingInProgress,
    onboardingCompleted
  } = useOnboardingAccess()

  //  =========== Computeds da Auth ================
  //  ----------- Estado Atual --------------

  const isAuthenticated = computed(() => Boolean(session.value))
  const hasPendingVerification = computed(() => false)
const postAuthRoute = computed(() => (onboardingCompleted.value ? '/dashboard/perfil' : '/onboarding'))

  //  =========== Helpers da Sessão ================
  //  ----------- Sync com Supabase --------------

  function buildSessionFromSupabase(authenticatedAt?: string): AuthSession | null {
    const current = supabaseAuth.snapshot.value

    if (!current.isAuthenticated || !current.userId) {
      return null
    }

    return {
      email: current.email,
      username: current.username,
      verified: true,
      authenticatedAt: authenticatedAt ?? session.value?.authenticatedAt ?? new Date().toISOString()
    }
  }

  function syncSessionFromSupabase(authenticatedAt?: string) {
    const nextSession = buildSessionFromSupabase(authenticatedAt)

    session.value = nextSession
    pendingVerification.value = null

    return nextSession
  }

  if (import.meta.client && !syncStarted.value) {
    syncStarted.value = true

    watch(
      () => supabaseAuth.snapshot.value,
      () => {
        const current = supabaseAuth.snapshot.value

        if (!current.isAuthenticated) {
          session.value = null
          pendingVerification.value = null
          return
        }

        syncSessionFromSupabase()
      },
      {
        deep: true,
        immediate: true
      }
    )
  }

  //  =========== Ações de Sessão ================
  //  ----------- Login e Cadastro --------------

  async function login(payload: AuthLoginInput) {
    const identifier = payload.identifier.trim()

    if (!identifier.includes('@')) {
      throw new Error('No fluxo atual, entre com o e-mail da sua conta.')
    }

    const result = await supabaseAuth.signInWithPassword({
      email: normalizeEmail(identifier),
      password: payload.password
    })

    if (result.error) {
      throw new Error(result.error)
    }

    await supabaseAuth.refreshSession()

    const nextSession = syncSessionFromSupabase()

    if (!nextSession) {
      throw new Error('Não foi possível iniciar a sessão. Confira se Confirm email está desligado no Supabase.')
    }

    if (!onboardingCompleted.value) {
      keepOnboardingInProgress()
    }

    return postAuthRoute.value
  }

  async function register(payload: AuthRegisterInput) {
    const email = normalizeEmail(payload.email)

    const result = await supabaseAuth.signUpWithPassword({
      email,
      password: payload.password,
      username: payload.username.trim()
    })

    if (result.error) {
      throw new Error(result.error)
    }

    await supabaseAuth.refreshSession()

    const nextSession = syncSessionFromSupabase(new Date().toISOString())

    if (!nextSession) {
      throw new Error('Cadastro criado, mas sem sessão ativa. Deixe Confirm email desligado no Supabase para seguir direto com senha.')
    }

    keepOnboardingInProgress()

    return '/onboarding'
  }

  async function verifyEmail(_code?: string) {
    if (session.value) {
      return postAuthRoute.value
    }

    throw new Error('A verificação por código foi removida deste fluxo. Entre com e-mail e senha.')
  }

  async function resendVerificationCode() {
    if (session.value) {
      return session.value.email
    }

    throw new Error('O reenvio de código não faz parte do fluxo atual.')
  }
  function clearAuthState() {
    session.value = null
    pendingVerification.value = null
    clearOnboardingAccess()

    if (import.meta.client) {
      void supabaseAuth.signOut()
    }
  }

  return {
    clearAuthState,
    hasPendingVerification,
    isAuthenticated,
    login,
    pendingVerification,
    postAuthRoute,
    register,
    resendVerificationCode,
    session,
    verifyEmail
  }
}