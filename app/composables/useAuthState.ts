import { computed, watch } from 'vue'
import type { AuthLoginInput } from '~/schemas/auth-login'
import type { AuthRegisterInput } from '~/schemas/auth-register'
import {
  useOnboardingAccess,
  type OnboardingAccessStatus
} from '~/composables/useOnboardingAccess'
import { useSupabaseAuth } from '~/composables/useSupabaseAuth'

export type AuthSession = {
  email: string
  username: string
  verified: boolean
  authenticatedAt: string
}

type AuthOnboardingStatusResponse = {
  account?: {
    onboardingStatus?: OnboardingAccessStatus
  }
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizeOnboardingStatus(value: unknown): OnboardingAccessStatus {
  return value === 'completed' || value === 'in_progress' ? value : 'not_started'
}

export function useAuthState() {
  //  =========== Cookies da Auth ================
  //  ----------- Sessão --------------

  const session = useCookie<AuthSession | null>('portfolio-auth-session', {
    sameSite: 'lax',
    default: () => null
  })

  const syncStarted = useState<boolean>('portfolio-auth-sync-started', () => false)

  const supabaseAuth = useSupabaseAuth()

  const {
    clearOnboardingAccess,
    keepOnboardingInProgress,
    onboardingStatus,
    syncOnboardingAccess
  } = useOnboardingAccess()

  //  =========== Computeds da Auth ================
  //  ----------- Estado Atual --------------

  const isAuthenticated = computed(() => Boolean(session.value))
  const postAuthRoute = computed(() =>
    onboardingStatus.value === 'not_started' ? '/onboarding' : '/dashboard'
  )

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

    return nextSession
  }

  async function syncOnboardingStatusFromServer() {
    if (!session.value) {
      return onboardingStatus.value
    }

    try {
      const payload = await $fetch<AuthOnboardingStatusResponse>('/api/onboarding')
      const nextStatus = normalizeOnboardingStatus(payload?.account?.onboardingStatus)

      syncOnboardingAccess(nextStatus)

      return nextStatus
    } catch {
      return onboardingStatus.value
    }
  }

  if (import.meta.client && !syncStarted.value) {
    syncStarted.value = true

    watch(
      () => supabaseAuth.snapshot.value,
      () => {
        const current = supabaseAuth.snapshot.value

        if (!current.isAuthenticated) {
          session.value = null
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
      throw new Error(
        'Não foi possível iniciar a sessão. Tente novamente em instantes.'
      )
    }

    const remoteOnboardingStatus = await syncOnboardingStatusFromServer()

    if (remoteOnboardingStatus === 'not_started') {
      keepOnboardingInProgress()
      return '/onboarding'
    }

    return '/dashboard'
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
      throw new Error(
        'Sua conta foi criada, mas a sessão não foi iniciada automaticamente. Tente entrar novamente.'
      )
    }

    keepOnboardingInProgress()

    return '/onboarding'
  }

  function clearAuthState() {
    session.value = null
    clearOnboardingAccess()

    if (import.meta.client) {
      void supabaseAuth.signOut()
    }
  }

  return {
    clearAuthState,
    isAuthenticated,
    login,
    postAuthRoute,
    register,
    session
  }
}