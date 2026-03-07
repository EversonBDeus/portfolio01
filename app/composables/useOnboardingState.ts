import { computed } from 'vue'
import type { StepperItem } from '@nuxt/ui'

export type OnboardingStepId =
  | 'account'
  | 'profile'
  | 'professional'
  | 'projects'
  | 'launch'

export type OnboardingStep = {
  id: OnboardingStepId
  title: string
  description: string
  icon: string
  eyebrow: string
  headline: string
  body: string
  required: boolean
  canSkip: boolean
}

export type OnboardingAccountData = {
  email: string
  username: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  acceptUpdates: boolean
}

export type OnboardingAccountErrors = {
  email: string
  username: string
  password: string
  confirmPassword: string
  acceptTerms: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'account',
    title: 'Conta',
    description: 'Base de acesso e preferências iniciais',
    icon: 'i-lucide-user-round',
    eyebrow: 'Primeiro acesso',
    headline: 'Vamos preparar sua conta',
    body: 'Aqui entram os dados de acesso e as preferências iniciais da conta antes de seguir para os dados públicos do portfólio.',
    required: true,
    canSkip: false
  },
  {
    id: 'profile',
    title: 'Perfil público',
    description: 'Dados que alimentam o portfólio',
    icon: 'i-lucide-id-card',
    eyebrow: 'Dados públicos',
    headline: 'Perfil e apresentação profissional',
    body: 'Aqui entrarão os campos que depois alimentam o template público do portfólio e o editor visual.',
    required: true,
    canSkip: false
  },
  {
    id: 'professional',
    title: 'Profissional',
    description: 'Resumo, áreas e experiência',
    icon: 'i-lucide-briefcase-business',
    eyebrow: 'Conteúdo profissional',
    headline: 'Vamos estruturar sua parte profissional',
    body: 'Esta etapa vai concentrar informações como headline, bio profissional, habilidades e experiência base.',
    required: true,
    canSkip: true
  },
  {
    id: 'projects',
    title: 'Projetos',
    description: 'Base para portfólio e editor',
    icon: 'i-lucide-folder-kanban',
    eyebrow: 'Projetos',
    headline: 'Organize sua primeira vitrine de projetos',
    body: 'Aqui entrarão os blocos iniciais de projetos para evitar que o usuário caia em um painel vazio.',
    required: false,
    canSkip: true
  },
  {
    id: 'launch',
    title: 'Finalização',
    description: 'Revisão e entrada no painel',
    icon: 'i-lucide-rocket',
    eyebrow: 'Concluir onboarding',
    headline: 'Revisão final antes do dashboard',
    body: 'A etapa final resume o progresso e prepara a transição para o dashboard, mantendo a possibilidade de completar depois.',
    required: false,
    canSkip: true
  }
]

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._-]{3,20}$/.test(value)
}

export function useOnboardingState() {
  const activeStep = useState<OnboardingStepId>('onboarding-active-step', () => 'account')
  const completedSteps = useState<OnboardingStepId[]>('onboarding-completed-steps', () => [])
  const finished = useState<boolean>('onboarding-finished', () => false)

  const account = useState<OnboardingAccountData>('onboarding-account', () => ({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptUpdates: true
  }))

  const steps = computed(() => onboardingSteps)

  const currentIndex = computed(() => {
    const index = steps.value.findIndex(step => step.id === activeStep.value)
    return index >= 0 ? index : 0
  })

  const currentStep = computed(() => {
    return steps.value[currentIndex.value] ?? steps.value[0]!
  })

  const progressValue = computed(() => {
    return Math.round(((currentIndex.value + 1) / steps.value.length) * 100)
  })

  const canGoPrev = computed(() => currentIndex.value > 0)
  const canGoNext = computed(() => currentIndex.value < steps.value.length - 1)
  const isLastStep = computed(() => currentIndex.value === steps.value.length - 1)

  const stepperItems = computed<StepperItem[]>(() => {
    return steps.value.map(step => ({
      title: step.title,
      description: step.description,
      icon: step.icon,
      value: step.id
    }))
  })

  const accountErrors = computed<OnboardingAccountErrors>(() => {
    const value = account.value

    return {
      email:
        !value.email.trim()
          ? 'Informe seu e-mail de acesso.'
          : !isValidEmail(value.email.trim())
            ? 'Digite um e-mail válido.'
            : '',
      username:
        !value.username.trim()
          ? 'Informe um nome de usuário.'
          : !isValidUsername(value.username.trim())
            ? 'Use de 3 a 20 caracteres sem espaços.'
            : '',
      password:
        !value.password
          ? 'Crie uma senha.'
          : value.password.length < 8
            ? 'A senha deve ter pelo menos 8 caracteres.'
            : '',
      confirmPassword:
        !value.confirmPassword
          ? 'Confirme sua senha.'
          : value.password !== value.confirmPassword
            ? 'As senhas não coincidem.'
            : '',
      acceptTerms: value.acceptTerms ? '' : 'Você precisa aceitar os termos para continuar.'
    }
  })

  const accountIsValid = computed(() => {
    const errors = accountErrors.value
    return !errors.email && !errors.username && !errors.password && !errors.confirmPassword && !errors.acceptTerms
  })

  const currentStepIsValid = computed(() => {
    if (currentStep.value.id === 'account') return accountIsValid.value
    return true
  })

  function markStepCompleted(stepId: OnboardingStepId) {
    if (completedSteps.value.includes(stepId)) return
    completedSteps.value = [...completedSteps.value, stepId]
  }

  function goToStep(stepId: OnboardingStepId) {
    activeStep.value = stepId
  }

  function nextStep() {
    if (!currentStepIsValid.value) return false

    markStepCompleted(currentStep.value.id)

    if (!canGoNext.value) return true

    const next = steps.value[currentIndex.value + 1]
    if (!next) return true

    activeStep.value = next.id
    return true
  }

  function prevStep() {
    if (!canGoPrev.value) return

    const prev = steps.value[currentIndex.value - 1]
    if (!prev) return

    activeStep.value = prev.id
  }

  function skipStep() {
    if (!currentStep.value.canSkip) return false

    if (isLastStep.value) {
      finished.value = true
      return true
    }

    nextStep()
    return true
  }

  function finishOnboarding() {
    if (!currentStepIsValid.value) return false

    markStepCompleted(currentStep.value.id)
    finished.value = true
    return true
  }

  function resetOnboarding() {
    activeStep.value = 'account'
    completedSteps.value = []
    finished.value = false
    account.value = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptUpdates: true
    }
  }

  function isStepCompleted(stepId: OnboardingStepId) {
    return completedSteps.value.includes(stepId)
  }

  return {
    activeStep,
    account,
    accountErrors,
    accountIsValid,
    completedSteps,
    currentIndex,
    currentStep,
    currentStepIsValid,
    finished,
    isLastStep,
    progressValue,
    steps,
    stepperItems,
    canGoPrev,
    canGoNext,
    goToStep,
    nextStep,
    prevStep,
    skipStep,
    finishOnboarding,
    resetOnboarding,
    isStepCompleted
  }
}