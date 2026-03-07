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

export type OnboardingPublicProfileData = {
  publicName: string
  headline: string
  location: string
  publicEmail: string
  bio: string
  linkedin: string
  github: string
}

export type OnboardingPublicProfileErrors = {
  publicName: string
  headline: string
  publicEmail: string
  bio: string
}

export type OnboardingProfessionalData = {
  roleTitle: string
  professionalSummary: string
  workArea: string
  experienceLevel: string
  mainSkills: string[]
}

export type OnboardingProfessionalErrors = {
  roleTitle: string
  professionalSummary: string
  workArea: string
  experienceLevel: string
  mainSkills: string
}

const onboardingSteps: OnboardingStep[] = [
{
  id: 'professional',
  title: 'Profissional',
  description: 'Resumo, área, experiência e competências',
  icon: 'i-lucide-briefcase-business',
  eyebrow: 'Conteúdo profissional',
  headline: 'Vamos estruturar sua base profissional',
  body: 'Aqui entram cargo, resumo profissional, área de atuação, nível de experiência e competências principais que depois alimentam o template e o editor.',
  required: true,
  canSkip: true
},
  {
    id: 'profile',
    title: 'Perfil público',
    description: 'Dados que alimentam o portfólio',
    icon: 'i-lucide-id-card',
    eyebrow: 'Dados públicos',
    headline: 'Agora vamos montar sua apresentação pública',
    body: 'Nesta etapa entram os dados que depois alimentam o portfólio, os templates e o editor visual.',
    required: true,
    canSkip: false
  },
  {
    id: 'professional',
    title: 'Profissional',
    description: 'Resumo, área, senioridade e skills',
    icon: 'i-lucide-briefcase-business',
    eyebrow: 'Conteúdo profissional',
    headline: 'Vamos estruturar sua base profissional',
    body: 'Aqui entram cargo, resumo profissional, área de atuação, nível de experiência e habilidades principais que depois alimentam o template e o editor.',
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

  const publicProfile = useState<OnboardingPublicProfileData>('onboarding-public-profile', () => ({
    publicName: '',
    headline: '',
    location: '',
    publicEmail: '',
    bio: '',
    linkedin: '',
    github: ''
  }))

  const professional = useState<OnboardingProfessionalData>('onboarding-professional', () => ({
    roleTitle: '',
    professionalSummary: '',
    workArea: '',
    experienceLevel: '',
    mainSkills: []
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

  const publicProfileErrors = computed<OnboardingPublicProfileErrors>(() => {
    const value = publicProfile.value

    return {
      publicName:
        !value.publicName.trim()
          ? 'Informe o nome público.'
          : value.publicName.trim().length < 2
            ? 'Use pelo menos 2 caracteres.'
            : '',
      headline:
        !value.headline.trim()
          ? 'Informe sua headline.'
          : value.headline.trim().length < 4
            ? 'A headline está muito curta.'
            : '',
      publicEmail:
        value.publicEmail.trim() && !isValidEmail(value.publicEmail.trim())
          ? 'Digite um e-mail público válido.'
          : '',
      bio:
        !value.bio.trim()
          ? 'Escreva uma bio curta.'
          : value.bio.trim().length < 20
            ? 'A bio deve ter pelo menos 20 caracteres.'
            : ''
    }
  })

  const publicProfileIsValid = computed(() => {
    const errors = publicProfileErrors.value
    return !errors.publicName && !errors.headline && !errors.publicEmail && !errors.bio
  })
const professionalErrors = computed<OnboardingProfessionalErrors>(() => {
  const value = professional.value

  return {
    roleTitle:
      !value.roleTitle.trim()
        ? 'Informe seu título ou cargo.'
        : value.roleTitle.trim().length < 2
          ? 'Use pelo menos 2 caracteres.'
          : '',
    professionalSummary:
      !value.professionalSummary.trim()
        ? 'Escreva um resumo profissional.'
        : value.professionalSummary.trim().length < 40
          ? 'O resumo deve ter pelo menos 40 caracteres.'
          : '',
    workArea: !value.workArea ? 'Selecione sua área de atuação.' : '',
    experienceLevel: !value.experienceLevel ? 'Selecione seu nível de experiência.' : '',
    mainSkills: value.mainSkills.length < 2 ? 'Adicione pelo menos 2 competências principais.' : ''
  }
})

  const professionalIsValid = computed(() => {
    const errors = professionalErrors.value
    return !errors.roleTitle && !errors.professionalSummary && !errors.workArea && !errors.experienceLevel && !errors.mainSkills
  })

  const currentStepIsValid = computed(() => {
    if (currentStep.value.id === 'account') return accountIsValid.value
    if (currentStep.value.id === 'profile') return publicProfileIsValid.value
    if (currentStep.value.id === 'professional') return professionalIsValid.value
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

    const next = steps.value[currentIndex.value + 1]
    if (!next) {
      finished.value = true
      return true
    }

    activeStep.value = next.id
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

    publicProfile.value = {
      publicName: '',
      headline: '',
      location: '',
      publicEmail: '',
      bio: '',
      linkedin: '',
      github: ''
    }

    professional.value = {
      roleTitle: '',
      professionalSummary: '',
      workArea: '',
      experienceLevel: '',
      mainSkills: []
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
    publicProfile,
    publicProfileErrors,
    publicProfileIsValid,
    professional,
    professionalErrors,
    professionalIsValid,
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