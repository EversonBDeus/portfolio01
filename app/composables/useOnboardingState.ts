import { computed } from 'vue'
import type { StepperItem } from '@nuxt/ui'
import { useAuthState } from '~/composables/useAuthState'
import { useOnboardingAccess } from '~/composables/useOnboardingAccess'

//  =========== Tipos das Etapas ================
//  ----------- Identificadores do Fluxo --------------

export type OnboardingStepId =
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

//  =========== Dados do Perfil Público ================
//  ----------- Tipos da Etapa Perfil Público --------------
export type OnboardingPublicProfileData = {
  publicName: string
  headline: string
  location: string
  publicEmail: string
  bio: string
  linkedin: string
  github: string
  website: string
  whatsapp: string
}

export type OnboardingPublicProfileErrors = {
  publicName: string
  headline: string
  publicEmail: string
  bio: string
}

//  =========== Dados Profissionais ================
//  ----------- Tipos da Etapa Profissional --------------

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

//  =========== Dados dos Projetos ================
//  ----------- Tipos da Etapa Projetos --------------

export type OnboardingProjectItem = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

export type OnboardingProjectsDraft = {
  title: string
  category: string
  summary: string
  link: string
}

export type OnboardingProjectsData = {
  draft: OnboardingProjectsDraft
  items: OnboardingProjectItem[]
}

export type OnboardingProjectsErrors = {
  title: string
  summary: string
}

//  =========== Configuração das Etapas ================
//  ----------- Ordem do Onboarding --------------

const onboardingSteps: OnboardingStep[] = [
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
    description: 'Resumo, área, experiência e competências',
    icon: 'i-lucide-briefcase-business',
    eyebrow: 'Conteúdo profissional',
    headline: 'Vamos estruturar sua base profissional',
    body: 'Aqui entram cargo, resumo profissional, área de atuação, nível de experiência e competências principais que depois alimentam o template e o editor.',
    required: true,
    canSkip: true
  },
  {
    id: 'projects',
    title: 'Projetos',
    description: 'Primeira vitrine do portfólio',
    icon: 'i-lucide-folder-kanban',
    eyebrow: 'Projetos e trabalhos',
    headline: 'Monte sua primeira vitrine de projetos',
    body: 'Aqui você já pode cadastrar alguns projetos, trabalhos ou estudos de caso para evitar um portfólio vazio e dar base ao editor visual.',
    required: false,
    canSkip: true
  },
  {
    id: 'launch',
    title: 'Finalização',
    description: 'Revisão e entrada no painel',
    icon: 'i-lucide-rocket',
    eyebrow: 'Concluir onboarding',
    headline: 'Revise sua base inicial',
    body: 'Esta etapa resume o que já foi preenchido e prepara sua entrada no painel, sem impedir ajustes posteriores.',
    required: false,
    canSkip: false
  }
]

//  =========== Helpers Gerais ================
//  ----------- Validação e Transformação --------------

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function createEmptyProjectsDraft(): OnboardingProjectsDraft {
  return {
    title: '',
    category: '',
    summary: '',
    link: ''
  }
}

function normalizeOptionalUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  return `https://${trimmed}`
}

function normalizeSessionScope(value: string | undefined | null) {
  return String(value ?? '').trim().toLowerCase() || 'guest'
}

function createProjectItem(
  draft: OnboardingProjectsDraft,
  index: number
): OnboardingProjectItem {
  return {
    id: `onboarding-project-${Date.now()}-${index}`,
    title: draft.title.trim(),
    category: draft.category.trim() || 'Projeto',
    summary: draft.summary.trim(),
    link: normalizeOptionalUrl(draft.link),
    featured: false
  }
}

export function useOnboardingState() {
  //  =========== Estados Base ================
  //  ----------- Auth e Acesso --------------


  const { session } = useAuthState()
  const sessionScope = computed(() => normalizeSessionScope(session.value?.email))
  const stateScope = useState<string>('onboarding-state-scope', () => sessionScope.value)
  const {
    keepOnboardingInProgress,
    markOnboardingCompleted,
    onboardingCompleted
  } = useOnboardingAccess()

  //  =========== Estado do Fluxo ================
  //  ----------- Etapa Atual e Conclusão --------------

  const activeStep = useState<OnboardingStepId>('onboarding-active-step', () => 'profile')
  const completedSteps = useState<OnboardingStepId[]>('onboarding-completed-steps', () => [])
  const finished = useState<boolean>('onboarding-finished', () => onboardingCompleted.value)

  //  =========== Estado do Perfil Público ================
  //  ----------- Dados da Etapa Perfil Público --------------

  const publicProfile = useState<OnboardingPublicProfileData>('onboarding-public-profile', () => ({
    publicName: session.value?.username ?? '',
    headline: '',
    location: '',
    publicEmail: session.value?.email ?? '',
    bio: '',
    linkedin: '',
    github: '',
    website: '',
    whatsapp: ''
  }))

  //  =========== Estado Profissional ================
  //  ----------- Dados da Etapa Profissional --------------

  const professional = useState<OnboardingProfessionalData>('onboarding-professional', () => ({
    roleTitle: '',
    professionalSummary: '',
    workArea: '',
    experienceLevel: '',
    mainSkills: []
  }))

  //  =========== Estado dos Projetos ================
  //  ----------- Dados da Etapa Projetos --------------

  const projects = useState<OnboardingProjectsData>('onboarding-projects', () => ({
    draft: createEmptyProjectsDraft(),
    items: []
  }))

    function resetStateForCurrentSession() {
    activeStep.value = 'profile'
    completedSteps.value = []
    finished.value = onboardingCompleted.value

    publicProfile.value = {
      publicName: session.value?.username ?? '',
      headline: '',
      location: '',
      publicEmail: session.value?.email ?? '',
      bio: '',
      linkedin: '',
      github: '',
      website: '',
      whatsapp: ''
    }

    professional.value = {
      roleTitle: '',
      professionalSummary: '',
      workArea: '',
      experienceLevel: '',
      mainSkills: []
    }

    projects.value = {
      draft: createEmptyProjectsDraft(),
      items: []
    }
  }

  if (stateScope.value !== sessionScope.value) {
    stateScope.value = sessionScope.value
    resetStateForCurrentSession()
  }

  //  =========== Migração do Fluxo Antigo ================
  //  ----------- Limpeza da Etapa Conta --------------

  if ((activeStep.value as string) === 'account') {
    activeStep.value = 'profile'
  }

  completedSteps.value = (completedSteps.value as string[]).filter((stepId): stepId is OnboardingStepId => {
    return onboardingSteps.some(step => step.id === stepId)
  })

  if (!publicProfile.value.publicEmail && session.value?.email) {
    publicProfile.value.publicEmail = session.value.email
  }

  if (!publicProfile.value.publicName && session.value?.username) {
    publicProfile.value.publicName = session.value.username
  }

  //  =========== Estrutura das Etapas ================
  //  ----------- Navegação e Progresso --------------

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

  //  =========== Validação do Perfil Público ================
  //  ----------- Regras da Etapa Perfil Público --------------

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
          ? 'Informe sua frase de destaque.'
          : value.headline.trim().length < 4
            ? 'A frase de destaque está muito curta.'
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

  //  =========== Validação Profissional ================
  //  ----------- Regras da Etapa Profissional --------------

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

  //  =========== Validação dos Projetos ================
  //  ----------- Regras do Rascunho --------------

  const projectsErrors = computed<OnboardingProjectsErrors>(() => {
    const value = projects.value.draft

    return {
      title: !value.title.trim() ? 'Informe o nome do projeto ou trabalho.' : '',
      summary:
        !value.summary.trim()
          ? 'Escreva um resumo curto do projeto ou trabalho.'
          : value.summary.trim().length < 20
            ? 'O resumo deve ter pelo menos 20 caracteres.'
            : ''
    }
  })

  const projectsCanAdd = computed(() => {
    const errors = projectsErrors.value
    return !errors.title && !errors.summary
  })

  const projectCount = computed(() => projects.value.items.length)
  const featuredProjectCount = computed(() => projects.value.items.filter(item => item.featured).length)

  //  =========== Validação da Etapa Atual ================
  //  ----------- Liberação de Avanço --------------

  const currentStepIsValid = computed(() => {
    if (currentStep.value.id === 'profile') return publicProfileIsValid.value
    if (currentStep.value.id === 'professional') return professionalIsValid.value

    return true
  })

  //  =========== Ações dos Projetos ================
  //  ----------- Manipulação da Etapa Projetos --------------

  function addProject() {
    if (!projectsCanAdd.value) return false

    const newProject = createProjectItem(
      projects.value.draft,
      projects.value.items.length + 1
    )

    projects.value = {
      draft: createEmptyProjectsDraft(),
      items: [
        ...projects.value.items,
        {
          ...newProject,
          featured: projects.value.items.length === 0
        }
      ]
    }

    return true
  }

  function clearProjectsDraft() {
    projects.value = {
      ...projects.value,
      draft: createEmptyProjectsDraft()
    }
  }

  //  =========== Ações dos Projetos ================
  //  ----------- Remover e Destacar --------------

  function removeProject(projectId: string) {
    const removedProject = projects.value.items.find(item => item.id === projectId)
    let nextItems = projects.value.items.filter(item => item.id !== projectId)

    if (removedProject?.featured && nextItems.length > 0 && !nextItems.some(item => item.featured)) {
      const firstItem = nextItems[0]

      if (firstItem) {
        nextItems = [
          { ...firstItem, featured: true },
          ...nextItems.slice(1)
        ]
      }
    }

    projects.value = {
      ...projects.value,
      items: nextItems
    }
  }

  function toggleProjectFeatured(projectId: string) {
    projects.value = {
      ...projects.value,
      items: projects.value.items.map(item =>
        item.id === projectId
          ? { ...item, featured: !item.featured }
          : item
      )
    }
  }

  //  =========== Navegação do Fluxo ================
  //  ----------- Passos e Conclusão --------------

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
    markOnboardingCompleted()
    finished.value = true

    return true
  }

  //  =========== Navegação do Fluxo ================
  //  ----------- Reiniciar Onboarding --------------

  function resetOnboarding() {
    keepOnboardingInProgress()

    activeStep.value = 'profile'
    completedSteps.value = []
    finished.value = false

    publicProfile.value = {
      publicName: session.value?.username ?? '',
      headline: '',
      location: '',
      publicEmail: session.value?.email ?? '',
      bio: '',
      linkedin: '',
      github: '',
      website: publicProfile.value.website?.trim() ?? '',
      whatsapp: publicProfile.value.whatsapp?.trim() ?? ''
    }

    professional.value = {
      roleTitle: '',
      professionalSummary: '',
      workArea: '',
      experienceLevel: '',
      mainSkills: []
    }

    projects.value = {
      draft: createEmptyProjectsDraft(),
      items: []
    }
  }

  function isStepCompleted(stepId: OnboardingStepId) {
    return completedSteps.value.includes(stepId)
  }

  return {
    activeStep,
    addProject,
    canGoNext,
    canGoPrev,
    clearProjectsDraft,
    completedSteps,
    currentIndex,
    currentStep,
    currentStepIsValid,
    featuredProjectCount,
    finishOnboarding,
    finished,
    goToStep,
    isLastStep,
    isStepCompleted,
    markStepCompleted,
    nextStep,
    prevStep,
    professional,
    professionalErrors,
    professionalIsValid,
    progressValue,
    projectCount,
    projects,
    projectsCanAdd,
    projectsErrors,
    publicProfile,
    publicProfileErrors,
    publicProfileIsValid,
    removeProject,
    resetOnboarding,
    skipStep,
    stepperItems,
    steps,
    toggleProjectFeatured
  }
}