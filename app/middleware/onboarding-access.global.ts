import { useOnboardingAccess } from '~/composables/useOnboardingAccess'

export default defineNuxtRouteMiddleware((to) => {
  //  =========== Rotas Controladas ================
  //  ----------- Onboarding e Dashboard --------------

  const isOnboardingRoute = to.path === '/onboarding'
  const isDashboardRoute = to.path === '/dashboard' || to.path.startsWith('/dashboard/')
  const isPreviewMode = isOnboardingRoute && to.query.preview === '1'

  if (!isOnboardingRoute && !isDashboardRoute) return
  if (isPreviewMode) return

  //  =========== Estado do Onboarding ================
  //  ----------- Regras de Acesso --------------

  const { onboardingStatus } = useOnboardingAccess()

  if (isDashboardRoute && onboardingStatus.value === 'not_started') {
    return navigateTo('/onboarding')
  }

  if (isOnboardingRoute && onboardingStatus.value === 'completed') {
    return navigateTo('/dashboard')
  }
})