import { computed } from 'vue'
import type { AuthLoginInput } from '~/schemas/auth-login'
import type { AuthRegisterInput } from '~/schemas/auth-register'
import { useOnboardingAccess } from '~/composables/useOnboardingAccess'

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

function wait(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeIdentifier(identifier: string) {
  const trimmed = identifier.trim()
  const sanitized = trimmed.toLowerCase()

  if (sanitized.includes('@')) {
    const usernameBase = sanitized.split('@')[0] ?? 'usuario'
    const username = usernameBase.replace(/[^a-z0-9._-]/gi, '').slice(0, 20) || 'usuario'

    return {
      email: sanitized,
      username
    }
  }

  const username = sanitized.replace(/[^a-z0-9._-]/gi, '').slice(0, 20) || 'usuario'

  return {
    email: `${username}@portfolio.local`,
    username
  }
}

function createExpiresAt(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString()
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

  const {
    clearOnboardingAccess,
    keepOnboardingInProgress,
    onboardingCompleted
  } = useOnboardingAccess()

  //  =========== Computeds da Auth ================
  //  ----------- Estado Atual --------------

  const isAuthenticated = computed(() => Boolean(session.value))
  const hasPendingVerification = computed(() => Boolean(pendingVerification.value))
  const postAuthRoute = computed(() => (onboardingCompleted.value ? '/dashboard' : '/onboarding'))

  //  =========== Ações de Sessão ================
  //  ----------- Login, Cadastro e Verify --------------

  async function login(payload: AuthLoginInput) {
    await wait()

    const normalized = normalizeIdentifier(payload.identifier)

    session.value = {
      email: normalized.email,
      username: normalized.username,
      verified: true,
      authenticatedAt: new Date().toISOString()
    }

    if (!onboardingCompleted.value) {
      keepOnboardingInProgress()
    }

    return postAuthRoute.value
  }

  async function register(payload: AuthRegisterInput) {
    await wait()

    pendingVerification.value = {
      email: payload.email.trim().toLowerCase(),
      username: payload.username.trim(),
      createdAt: new Date().toISOString(),
      expiresAt: createExpiresAt()
    }

    session.value = null
    clearOnboardingAccess()

    return `/auth/verify?email=${encodeURIComponent(payload.email.trim().toLowerCase())}`
  }

  async function verifyEmail(code: string) {
    if (!pendingVerification.value) {
      throw new Error('Nenhum cadastro pendente foi encontrado.')
    }

    await wait()

    if (code !== AUTH_MOCK_VERIFY_CODE) {
      throw new Error('O código informado não confere.')
    }

    session.value = {
      email: pendingVerification.value.email,
      username: pendingVerification.value.username,
      verified: true,
      authenticatedAt: new Date().toISOString()
    }

    pendingVerification.value = null
    keepOnboardingInProgress()

    return '/onboarding'
  }

  async function resendVerificationCode() {
    if (!pendingVerification.value) {
      throw new Error('Nenhum cadastro pendente foi encontrado.')
    }

    await wait(500)

    pendingVerification.value = {
      ...pendingVerification.value,
      createdAt: new Date().toISOString(),
      expiresAt: createExpiresAt()
    }

    return pendingVerification.value.email
  }

  function clearAuthState() {
    session.value = null
    pendingVerification.value = null
    clearOnboardingAccess()
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