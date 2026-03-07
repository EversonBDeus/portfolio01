import { computed } from 'vue'
import {
  EDITOR_SECTIONS,
  type EditorSectionDefinition,
  type EditorSectionId
} from '~/data/editor-sections'
import { useOnboardingState } from '~/composables/useOnboardingState'
import { useTemplateSelection } from '~/composables/useTemplateSelection'
import {
  editorProjectSchema,
  isEditorProjectErrorField,
  type EditorProjectErrors,
  type EditorProjectForm
} from '~/schemas/editor-project'
export type EditorDevice = 'desktop' | 'mobile'

export type EditorSectionVisibility = Record<EditorSectionId, boolean>

export type EditorSectionListItem = EditorSectionDefinition & {
  enabled: boolean
}

export type EditorHeroForm = {
  publicName: string
  headline: string
  roleTitle: string
  location: string
  skillsText: string
}

export type EditorAboutForm = {
  summary: string
}

export type EditorProjectField = 'title' | 'category' | 'summary' | 'link'

export type EditorProjectFieldUpdate = {
  projectId: string
  field: EditorProjectField
  value: string
}

export type EditorPreviewProject = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

export type EditorPreviewLink = {
  label: string
  value: string
  href: string
}

export type EditorPreviewData = {
  publicName: string
  headline: string
  roleTitle: string
  summary: string
  location: string
  skills: string[]
  projects: EditorPreviewProject[]
  links: EditorPreviewLink[]
}

function createInitialVisibility(): EditorSectionVisibility {
  return {
    hero: true,
    about: true,
    projects: true,
    contact: true
  }
}

function normalizeSkills(skillsText: string) {
  return skillsText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6)
}

function createProjectId() {
  return `editor-project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function toEditorProjectForm(project: EditorPreviewProject): EditorProjectForm {
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    summary: project.summary,
    link: project.link,
    featured: project.featured
  }
}

function createProjectErrorsMap(items: EditorProjectForm[]) {
  return items.reduce<Record<string, EditorProjectErrors>>((acc, item) => {
    acc[item.id] = {}
    return acc
  }, {})
}

export function useEditorState() {
  //  =========== Dados do Onboarding ================
  //  ----------- Base do Preview --------------

  const { publicProfile, professional, projects } = useOnboardingState()

  const { hasSelectedTemplate, selectedTemplate } = useTemplateSelection()

  const onboardingProjects = computed<EditorPreviewProject[]>(() => {
    return [...(projects.value.items ?? [])]
      .sort((current, next) => Number(next.featured) - Number(current.featured))
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        summary: item.summary,
        link: item.link,
        featured: item.featured
      }))
  })

  const previewLinks = computed<EditorPreviewLink[]>(() => {
    const items: EditorPreviewLink[] = []

    if (publicProfile.value.linkedin.trim()) {
      items.push({
        label: 'LinkedIn',
        value: publicProfile.value.linkedin.trim(),
        href: publicProfile.value.linkedin.trim().startsWith('http')
          ? publicProfile.value.linkedin.trim()
          : `https://${publicProfile.value.linkedin.trim()}`
      })
    }

    if (publicProfile.value.github.trim()) {
      items.push({
        label: 'GitHub',
        value: publicProfile.value.github.trim(),
        href: publicProfile.value.github.trim().startsWith('http')
          ? publicProfile.value.github.trim()
          : `https://${publicProfile.value.github.trim()}`
      })
    }

    if (publicProfile.value.publicEmail.trim()) {
      items.push({
        label: 'E-mail',
        value: publicProfile.value.publicEmail.trim(),
        href: `mailto:${publicProfile.value.publicEmail.trim()}`
      })
    }

    return items
  })

  const basePreviewData = computed<EditorPreviewData>(() => {
    return {
      publicName: publicProfile.value.publicName.trim() || 'Seu nome público',
      headline:
        publicProfile.value.headline.trim() ||
        professional.value.roleTitle.trim() ||
        'Sua headline profissional',
      roleTitle: professional.value.roleTitle.trim() || 'Seu cargo principal',
      summary:
        professional.value.professionalSummary.trim() ||
        publicProfile.value.bio.trim() ||
        'Adicione seu resumo profissional no onboarding ou no painel para alimentar esta seção do template.',
      location: publicProfile.value.location.trim() || 'Sua localização',
      skills: Array.isArray(professional.value.mainSkills)
        ? professional.value.mainSkills.slice(0, 6)
        : [],
      projects: onboardingProjects.value,
      links: previewLinks.value
    }
  })

  //  =========== Estado do Editor ================
  //  ----------- Viewport, Seção e Visibilidade --------------

  const device = useState<EditorDevice>('editor-device', () => 'desktop')
  const activeSection = useState<EditorSectionId>('editor-active-section', () => 'hero')
  const visibility = useState<EditorSectionVisibility>('editor-section-visibility', createInitialVisibility)

  const sections = computed<EditorSectionListItem[]>(() => {
    return EDITOR_SECTIONS.map((section) => ({
      ...section,
      enabled: visibility.value[section.id]
    }))
  })

  //  =========== Estado da Hero ================
  //  ----------- Edição Local --------------

  const heroForm = useState<EditorHeroForm>('editor-hero-form', () => ({
    publicName: basePreviewData.value.publicName,
    headline: basePreviewData.value.headline,
    roleTitle: basePreviewData.value.roleTitle,
    location: basePreviewData.value.location,
    skillsText: basePreviewData.value.skills.join(', ')
  }))

  //  =========== Estado do Sobre ================
  //  ----------- Edição Local --------------

  const aboutForm = useState<EditorAboutForm>('editor-about-form', () => ({
    summary: basePreviewData.value.summary
  }))

  //  =========== Estado dos Projetos ================
  //  ----------- Edição Local --------------

  const projectsForm = useState<EditorProjectForm[]>('editor-projects-form', () => {
    return onboardingProjects.value.map(toEditorProjectForm)
  })

  const activeProjectId = useState<string | null>('editor-active-project-id', () => {
    return onboardingProjects.value[0]?.id ?? null
  })

  const projectErrors = useState<Record<string, EditorProjectErrors>>(
    'editor-project-errors',
    () => createProjectErrorsMap(onboardingProjects.value.map(toEditorProjectForm))
  )

  const canAddProject = computed(() => projectsForm.value.length < 3)

  const previewProjects = computed<EditorPreviewProject[]>(() => {
    return [...projectsForm.value]
      .sort((current, next) => Number(next.featured) - Number(current.featured))
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title.trim() || 'Novo projeto',
        category: item.category.trim() || 'Categoria do projeto',
        summary:
          item.summary.trim() ||
          'Adicione um resumo para este projeto no editor ou no onboarding.',
        link: item.link.trim(),
        featured: item.featured
      }))
  })

  //  =========== Preview Final ================
  //  ----------- Dados Renderizados --------------

  const previewData = computed<EditorPreviewData>(() => {
    return {
      publicName: heroForm.value.publicName.trim(),
      headline: heroForm.value.headline.trim(),
      roleTitle: heroForm.value.roleTitle.trim(),
      summary: aboutForm.value.summary.trim(),
      location: heroForm.value.location.trim(),
      skills: normalizeSkills(heroForm.value.skillsText),
      projects: previewProjects.value,
      links: previewLinks.value
    }
  })

  //  =========== Validação dos Projetos ================
  //  ----------- Zod Local --------------

function validateProject(projectId: string) {
  const project = projectsForm.value.find((item) => item.id === projectId)

  if (!project) {
    return false
  }

  const result = editorProjectSchema.safeParse(project)

  if (result.success) {
    projectErrors.value = {
      ...projectErrors.value,
      [projectId]: {}
    }

    return true
  }

  const nextErrors: EditorProjectErrors = {}

  for (const issue of result.error.issues) {
    const field = issue.path[0]

    if (isEditorProjectErrorField(field) && !nextErrors[field]) {
      nextErrors[field] = issue.message
    }
  }

  projectErrors.value = {
    ...projectErrors.value,
    [projectId]: nextErrors
  }

  return false
}

  //  =========== Ações Gerais ================
  //  ----------- Hero, Sobre e Seção --------------

  function setDevice(nextDevice: EditorDevice) {
    device.value = nextDevice
  }

  function setActiveSection(sectionId: EditorSectionId) {
    activeSection.value = sectionId
  }

  function toggleSection(sectionId: EditorSectionId) {
    visibility.value = {
      ...visibility.value,
      [sectionId]: !visibility.value[sectionId]
    }
  }

  function setHeroForm(nextValue: EditorHeroForm) {
    heroForm.value = nextValue
  }

  function setAboutForm(nextValue: EditorAboutForm) {
    aboutForm.value = nextValue
  }

  //  =========== Ações dos Projetos ================
  //  ----------- Lista e Destaque --------------

  function setActiveProject(projectId: string) {
    activeProjectId.value = projectId
  }

  function addProject() {
    if (!canAddProject.value) {
      return
    }

    const shouldBeFeatured =
      projectsForm.value.length === 0 ||
      !projectsForm.value.some((item) => item.featured)

    const nextProject: EditorProjectForm = {
      id: createProjectId(),
      title: '',
      category: '',
      summary: '',
      link: '',
      featured: shouldBeFeatured
    }

    projectsForm.value = [...projectsForm.value, nextProject]
    activeProjectId.value = nextProject.id

    projectErrors.value = {
      ...projectErrors.value,
      [nextProject.id]: {}
    }
  }

  function removeProject(projectId: string) {
    const nextItems = projectsForm.value.filter((item) => item.id !== projectId)
    const nextErrors = { ...projectErrors.value }

    delete nextErrors[projectId]

    if (nextItems.length > 0 && !nextItems.some((item) => item.featured)) {
      const [firstItem, ...restItems] = nextItems

      if (firstItem) {
        projectsForm.value = [{ ...firstItem, featured: true }, ...restItems]
      } else {
        projectsForm.value = nextItems
      }
    } else {
      projectsForm.value = nextItems
    }

    projectErrors.value = nextErrors

    if (activeProjectId.value === projectId) {
      activeProjectId.value = projectsForm.value[0]?.id ?? null
    }
  }

  function setFeaturedProject(projectId: string) {
    projectsForm.value = projectsForm.value.map((item) => ({
      ...item,
      featured: item.id === projectId
    }))
  }

  function updateProjectField(projectId: string, field: EditorProjectField, value: string) {
    projectsForm.value = projectsForm.value.map((item) => {
      if (item.id !== projectId) {
        return item
      }

      return {
        ...item,
        [field]: value
      }
    })

    validateProject(projectId)
  }

  //  =========== Reset das Seções ================
  //  ----------- Restaurar Base --------------

  function resetSection(sectionId: EditorSectionId) {
    if (sectionId === 'hero') {
      heroForm.value = {
        publicName: basePreviewData.value.publicName,
        headline: basePreviewData.value.headline,
        roleTitle: basePreviewData.value.roleTitle,
        location: basePreviewData.value.location,
        skillsText: basePreviewData.value.skills.join(', ')
      }

      return
    }

    if (sectionId === 'about') {
      aboutForm.value = {
        summary: basePreviewData.value.summary
      }

      return
    }

    if (sectionId === 'projects') {
      const nextProjects = onboardingProjects.value.map(toEditorProjectForm)

      projectsForm.value = nextProjects
      activeProjectId.value = nextProjects[0]?.id ?? null
      projectErrors.value = createProjectErrorsMap(nextProjects)
    }
  }

  return {
    aboutForm,
    activeProjectId,
    activeSection,
    addProject,
    canAddProject,
    device,
    hasSelectedTemplate,
    heroForm,
    previewData,
    projectErrors,
    projectsForm,
    removeProject,
    resetSection,
    sections,
    selectedTemplate,
    setAboutForm,
    setActiveProject,
    setActiveSection,
    setDevice,
    setFeaturedProject,
    setHeroForm,
    toggleSection,
    updateProjectField,
    visibility
  }
}