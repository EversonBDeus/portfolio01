import { computed } from 'vue'

export type OnboardingAccessStatus = 'not_started' | 'in_progress' | 'completed'

export type OnboardingAccessState = {
  status: OnboardingAccessStatus
  startedAt: string | null
  completedAt: string | null
}

export function useOnboardingAccess() {
  //  =========== Cookie do Onboarding ================
  //  ----------- Estado Persistido --------------

  const onboardingAccess = useCookie<OnboardingAccessState>('onboarding-access', {
    default: () => ({
      status: 'not_started',
      startedAt: null,
      completedAt: null
    })
  })

  //  =========== Computeds do Onboarding ================
  //  ----------- Estado Atual --------------

  const onboardingStatus = computed(() => onboardingAccess.value.status)
  const onboardingStarted = computed(() => onboardingAccess.value.status !== 'not_started')
  const onboardingCompleted = computed(() => onboardingAccess.value.status === 'completed')

  //  =========== Ações do Onboarding ================
  //  ----------- Controle do Fluxo --------------

  function startOnboarding() {
    if (onboardingAccess.value.status !== 'not_started') return

    onboardingAccess.value = {
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      completedAt: null
    }
  }

  function keepOnboardingInProgress() {
    onboardingAccess.value = {
      status: 'in_progress',
      startedAt: onboardingAccess.value.startedAt ?? new Date().toISOString(),
      completedAt: null
    }
  }

  function markOnboardingCompleted() {
    onboardingAccess.value = {
      status: 'completed',
      startedAt: onboardingAccess.value.startedAt ?? new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  }

  function clearOnboardingAccess() {
    onboardingAccess.value = {
      status: 'not_started',
      startedAt: null,
      completedAt: null
    }
  }

  return {
    clearOnboardingAccess,
    keepOnboardingInProgress,
    markOnboardingCompleted,
    onboardingAccess,
    onboardingCompleted,
    onboardingStarted,
    onboardingStatus,
    startOnboarding
  }
}