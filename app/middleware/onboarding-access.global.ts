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

  const { isAuthenticated } = useAuthState()
  const { onboardingStatus, onboardingCompleted } = useOnboardingAccess()

  function redirect(path: string) {
    return navigateTo(path, { replace: true })
  }

  if (isPreviewMode) {
    return
  }

  //  =========== Compatibilidade com rota antiga ================
  //  ----------- Verify removido do fluxo --------------

  if (isVerifyRoute) {
    if (!isAuthenticated.value) {
      return redirect('/auth/login')
    }

    if (onboardingCompleted.value || onboardingStatus.value === 'in_progress') {
      return redirect('/dashboard')
    }

    return redirect('/onboarding')
  }

  //  =========== Regras do Dashboard ================
  //  ----------- Área Privada --------------

  if (isDashboardRoute) {
    if (!isAuthenticated.value) {
      return redirect('/auth/login')
    }

    if (onboardingStatus.value === 'not_started') {
      return redirect('/onboarding')
    }

    return
  }

  //  =========== Regras do Onboarding ================
  //  ----------- Fluxo Inicial --------------

  if (isOnboardingRoute) {
    if (!isAuthenticated.value) {
      return redirect('/auth/login')
    }

    if (onboardingCompleted.value) {
      return redirect('/dashboard')
    }

    return
  }

  //  =========== Regras da Auth ================
  //  ----------- Login e Cadastro --------------

  if (!isAuthRoute) {
    return
  }

  if (!isAuthenticated.value) {
    return
  }

  if (onboardingCompleted.value) {
    return redirect('/dashboard')
  }

  if (onboardingStatus.value === 'in_progress') {
    return redirect('/dashboard')
  }

  return redirect('/onboarding')
})