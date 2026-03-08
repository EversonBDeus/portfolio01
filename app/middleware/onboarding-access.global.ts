import { useAuthState } from '~/composables/useAuthState'
import { useOnboardingAccess } from '~/composables/useOnboardingAccess'

export default defineNuxtRouteMiddleware((to) => {
  //  =========== Rotas Controladas ================
  //  ----------- Auth, Onboarding e Dashboard --------------

  const isAuthRoute = to.path.startsWith('/auth')
  const isVerifyRoute = to.path === '/auth/verify'
  const isOnboardingRoute = to.path === '/onboarding'
  const isDashboardRoute = to.path === '/dashboard' || to.path.startsWith('/dashboard/')
  const isPreviewMode = isOnboardingRoute && to.query.preview === '1'

  const { isAuthenticated, hasPendingVerification } = useAuthState()
  const { onboardingStatus, onboardingCompleted } = useOnboardingAccess()

  if (isPreviewMode) {
    return
  }

  //  =========== Regras do Dashboard ================
  //  ----------- Área Privada --------------

  if (isDashboardRoute) {
    if (!isAuthenticated.value) {
      return navigateTo('/auth/login')
    }

    if (onboardingStatus.value === 'not_started') {
      return navigateTo('/onboarding')
    }

    return
  }

  //  =========== Regras do Onboarding ================
  //  ----------- Fluxo Inicial --------------

  if (isOnboardingRoute) {
    if (!isAuthenticated.value) {
      return navigateTo('/auth/login')
    }

    if (onboardingCompleted.value) {
      return navigateTo('/dashboard/perfil')
    }

    return
  }

  //  =========== Regras da Auth ================
  //  ----------- Login, Cadastro e Verify --------------

  if (!isAuthRoute) {
    return
  }

  if (isVerifyRoute && hasPendingVerification.value) {
    return
  }

  if (!isAuthenticated.value) {
    return
  }

  if (onboardingCompleted.value) {
    return navigateTo('/dashboard/perfil')
  }

  return navigateTo('/onboarding')
})