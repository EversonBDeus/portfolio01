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
import {
  editorContactSchema,
  type EditorContactForm
} from '~/schemas/editor-contact'

export type { EditorContactForm } from '~/schemas/editor-contact'

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

function normalizePublicUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`
}

function normalizeWhatsAppHref(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  return `https://wa.me/${digits}`
}

export function useEditorState() {
  //  =========== Dados do Onboarding ================
  //  ----------- Base do Preview --------------

  const { publicProfile, professional, projects } = useOnboardingState()
  const { hasSelectedTemplate, selectedTemplate } = useTemplateSelection()

  //  =========== Base Pública Segura ================
  //  ----------- Fallback do Onboarding --------------

  const publicProfileBase = computed(() => {
    const source = publicProfile.value

    return {
      publicName: source?.publicName?.trim() ?? '',
      headline: source?.headline?.trim() ?? '',
      location: source?.location?.trim() ?? '',
      publicEmail: source?.publicEmail?.trim() ?? '',
      bio: source?.bio ?? '',
      linkedin: source?.linkedin?.trim() ?? '',
      github: source?.github?.trim() ?? ''
    }
  })

  const professionalBase = computed(() => {
    const source = professional.value

    return {
      roleTitle: source?.roleTitle?.trim() ?? '',
      professionalSummary: source?.professionalSummary ?? '',
      mainSkills: Array.isArray(source?.mainSkills)
        ? source.mainSkills
            .map((item) => String(item ?? '').trim())
            .filter(Boolean)
        : []
    }
  })

  const onboardingProjects = computed<EditorPreviewProject[]>(() => {
    const items = Array.isArray(projects.value?.items) ? projects.value.items : []

    return [...items]
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

  const basePreviewData = computed<EditorPreviewData>(() => {
    return {
      publicName: publicProfileBase.value.publicName || 'Seu nome público',
      headline:
        publicProfileBase.value.headline ||
        professionalBase.value.roleTitle ||
        'Sua headline profissional',
      roleTitle: professionalBase.value.roleTitle || 'Seu cargo principal',
      summary:
        professionalBase.value.professionalSummary.trim() ||
        publicProfileBase.value.bio.trim() ||
        'Adicione seu resumo profissional no onboarding ou no painel para alimentar esta seção do template.',
      location: publicProfileBase.value.location || 'Sua localização',
      skills: professionalBase.value.mainSkills.slice(0, 6),
      projects: onboardingProjects.value,
      links: []
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

  //  =========== Estado do Contato ================
  //  ----------- Edição Local --------------

  const contactForm = useState<EditorContactForm>('editor-contact-form', () => ({
    publicEmail: publicProfileBase.value.publicEmail,
    whatsapp: '',
    website: '',
    linkedin: publicProfileBase.value.linkedin,
    github: publicProfileBase.value.github
  }))

  const previewLinks = computed<EditorPreviewLink[]>(() => {
    const items: EditorPreviewLink[] = []

    if (contactForm.value.linkedin.trim()) {
      items.push({
        label: 'LinkedIn',
        value: contactForm.value.linkedin.trim(),
        href: normalizePublicUrl(contactForm.value.linkedin)
      })
    }

    if (contactForm.value.github.trim()) {
      items.push({
        label: 'GitHub',
        value: contactForm.value.github.trim(),
        href: normalizePublicUrl(contactForm.value.github)
      })
    }

    if (contactForm.value.website.trim()) {
      items.push({
        label: 'Website',
        value: contactForm.value.website.trim(),
        href: normalizePublicUrl(contactForm.value.website)
      })
    }

    if (contactForm.value.publicEmail.trim()) {
      items.push({
        label: 'E-mail',
        value: contactForm.value.publicEmail.trim(),
        href: `mailto:${contactForm.value.publicEmail.trim()}`
      })
    }

    if (contactForm.value.whatsapp.trim()) {
      const href = normalizeWhatsAppHref(contactForm.value.whatsapp)

      if (href) {
        items.push({
          label: 'WhatsApp',
          value: contactForm.value.whatsapp.trim(),
          href
        })
      }
    }

    return items
  })

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
      publicName: heroForm.value.publicName.trim() || basePreviewData.value.publicName,
      headline: heroForm.value.headline.trim() || basePreviewData.value.headline,
      roleTitle: heroForm.value.roleTitle.trim() || basePreviewData.value.roleTitle,
      summary: aboutForm.value.summary.trim() || basePreviewData.value.summary,
      location: heroForm.value.location.trim() || basePreviewData.value.location,
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
  //  ----------- Hero, Sobre, Contato e Seção --------------

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

  function setContactForm(nextValue: EditorContactForm) {
    const result = editorContactSchema.safeParse(nextValue)
    contactForm.value = result.success ? result.data : nextValue
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

    if (sectionId === 'contact') {
      contactForm.value = {
        publicEmail: publicProfileBase.value.publicEmail,
        whatsapp: '',
        website: '',
        linkedin: publicProfileBase.value.linkedin,
        github: publicProfileBase.value.github
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
    contactForm,
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
    setContactForm,
    setDevice,
    setFeaturedProject,
    setHeroForm,
    toggleSection,
    updateProjectField,
    visibility
  }
}