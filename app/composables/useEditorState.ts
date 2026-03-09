import { computed, onMounted, watch } from 'vue'
import {
  EDITOR_SECTIONS,
  type EditorSectionDefinition,
  type EditorSectionId
} from '~/data/editor-sections'
import { useEditorDraft, type EditorDraftPayload } from '~/composables/useEditorDraft'
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

type EditorSnapshot = Omit<EditorDraftPayload, 'version' | 'updatedAt'>

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

function serializeSnapshot(snapshot: EditorSnapshot) {
  return JSON.stringify(snapshot)
}

export function useEditorState() {
  //  =========== Dados do Onboarding ================
  //  ----------- Base do Preview --------------

  const { publicProfile, professional, projects } = useOnboardingState()
  const {
    hasSelectedTemplate,
    selectedTemplate,
    selectedTemplateId
  } = useTemplateSelection()

  const {
    clearDraft,
    hasSavedDraft,
    lastSavedAt,
    loadDraft,
    resetDraftMeta,
    saveDraft
  } = useEditorDraft()

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

  function createBaseHeroForm(): EditorHeroForm {
    return {
      publicName: basePreviewData.value.publicName,
      headline: basePreviewData.value.headline,
      roleTitle: basePreviewData.value.roleTitle,
      location: basePreviewData.value.location,
      skillsText: basePreviewData.value.skills.join(', ')
    }
  }

  function createBaseAboutForm(): EditorAboutForm {
    return {
      summary: basePreviewData.value.summary
    }
  }

  function createBaseContactForm(): EditorContactForm {
    return {
      publicEmail: publicProfileBase.value.publicEmail,
      whatsapp: '',
      website: '',
      linkedin: publicProfileBase.value.linkedin,
      github: publicProfileBase.value.github
    }
  }

  function createBaseProjectsState() {
    const nextProjects = onboardingProjects.value.map(toEditorProjectForm)

    return {
      activeProjectId: nextProjects[0]?.id ?? null,
      projectErrors: createProjectErrorsMap(nextProjects),
      projects: nextProjects
    }
  }

  function createBaseSnapshot(templateId: string): EditorSnapshot {
    const baseProjectsState = createBaseProjectsState()

    return {
      templateId,
      device: 'desktop',
      activeSection: 'hero',
      activeProjectId: baseProjectsState.activeProjectId,
      visibility: createInitialVisibility(),
      hero: createBaseHeroForm(),
      about: createBaseAboutForm(),
      contact: createBaseContactForm(),
      projects: baseProjectsState.projects
    }
  }

  //  =========== Estado do Editor ================
  //  ----------- Viewport, Seção e Visibilidade --------------

  const device = useState<EditorDevice>('editor-device', () => 'desktop')
  const activeSection = useState<EditorSectionId>('editor-active-section', () => 'hero')
  const visibility = useState<EditorSectionVisibility>('editor-section-visibility', createInitialVisibility)
  const savedSnapshotHash = useState<string | null>('editor-saved-snapshot-hash', () => null)

  const sections = computed<EditorSectionListItem[]>(() => {
    return EDITOR_SECTIONS.map((section) => ({
      ...section,
      enabled: visibility.value[section.id]
    }))
  })

  //  =========== Estado da Hero ================
  //  ----------- Edição Local --------------

  const heroForm = useState<EditorHeroForm>('editor-hero-form', createBaseHeroForm)

  //  =========== Estado do Sobre ================
  //  ----------- Edição Local --------------

  const aboutForm = useState<EditorAboutForm>('editor-about-form', createBaseAboutForm)

  //  =========== Estado do Contato ================
  //  ----------- Edição Local --------------

  const contactForm = useState<EditorContactForm>('editor-contact-form', createBaseContactForm)

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
    return createBaseProjectsState().projects
  })

  const activeProjectId = useState<string | null>('editor-active-project-id', () => {
    return createBaseProjectsState().activeProjectId
  })

  const projectErrors = useState<Record<string, EditorProjectErrors>>(
    'editor-project-errors',
    () => createBaseProjectsState().projectErrors
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

  const hasPendingChanges = computed(() => {
    const templateId = selectedTemplateId.value

    if (!templateId || !savedSnapshotHash.value) {
      return false
    }

    return serializeSnapshot(createCurrentSnapshot(templateId)) !== savedSnapshotHash.value
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

  //  =========== Helpers do Rascunho ================
  //  ----------- Snapshot, Aplicação e Persistência --------------

  const lastHydratedTemplateId = useState<string | null>('editor-last-hydrated-template-id', () => null)

  function createCurrentSnapshot(templateId: string): EditorSnapshot {
    return {
      templateId,
      device: device.value,
      activeSection: activeSection.value,
      activeProjectId: activeProjectId.value,
      visibility: {
        ...visibility.value
      },
      hero: {
        ...heroForm.value
      },
      about: {
        ...aboutForm.value
      },
      contact: {
        ...contactForm.value
      },
      projects: projectsForm.value.map((project) => ({
        ...project
      }))
    }
  }

  function applySnapshot(snapshot: EditorSnapshot) {
    device.value = snapshot.device
    activeSection.value = snapshot.activeSection
    visibility.value = {
      ...snapshot.visibility
    }
    heroForm.value = {
      ...snapshot.hero
    }
    aboutForm.value = {
      ...snapshot.about
    }
    contactForm.value = {
      ...snapshot.contact
    }
    projectsForm.value = snapshot.projects.map((project) => ({
      ...project
    }))
    activeProjectId.value = snapshot.projects.some((project) => project.id === snapshot.activeProjectId)
      ? snapshot.activeProjectId
      : snapshot.projects[0]?.id ?? null
    projectErrors.value = createProjectErrorsMap(projectsForm.value)
  }

  function updateSavedSnapshot(snapshot: EditorSnapshot) {
    savedSnapshotHash.value = serializeSnapshot(snapshot)
  }

  function hydrateEditorForTemplate(templateId: string) {
    const savedDraft = loadDraft(templateId)

    if (savedDraft) {
      const snapshot: EditorSnapshot = {
        templateId: savedDraft.templateId,
        device: savedDraft.device,
        activeSection: savedDraft.activeSection,
        activeProjectId: savedDraft.activeProjectId,
        visibility: savedDraft.visibility,
        hero: savedDraft.hero,
        about: savedDraft.about,
        contact: savedDraft.contact,
        projects: savedDraft.projects
      }

      applySnapshot(snapshot)
      updateSavedSnapshot(snapshot)
      lastHydratedTemplateId.value = templateId
      return
    }

    const baseSnapshot = createBaseSnapshot(templateId)

    applySnapshot(baseSnapshot)
    updateSavedSnapshot(baseSnapshot)
    lastHydratedTemplateId.value = templateId
  }

  function resetHydrationState() {
    resetDraftMeta()
    savedSnapshotHash.value = null
    lastHydratedTemplateId.value = null
  }

  function hydrateEditorState(force = false) {
    const templateId = selectedTemplateId.value

    if (!templateId) {
      resetHydrationState()
      return
    }

    if (!force && lastHydratedTemplateId.value === templateId) {
      return
    }

    hydrateEditorForTemplate(templateId)
  }

  watch(
    selectedTemplateId,
    () => {
      hydrateEditorState(true)
    },
    {
      immediate: true
    }
  )

  onMounted(() => {
    hydrateEditorState(true)
  })
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

  //  =========== Ações do Rascunho ================
  //  ----------- Salvar, Descartar e Restaurar --------------

function saveEditorDraft() {
  const templateId = selectedTemplateId.value

  if (!templateId) {
    return false
  }

  const currentSnapshot = createCurrentSnapshot(templateId)
  const result = saveDraft(currentSnapshot)

  if (!result) {
    return false
  }

  updateSavedSnapshot(currentSnapshot)
  lastHydratedTemplateId.value = templateId

  return true
}

  function discardChanges() {
    const templateId = selectedTemplateId.value

    if (!templateId) {
      return 'unavailable' as const
    }

    const savedDraft = loadDraft(templateId)

    if (savedDraft) {
      const snapshot: EditorSnapshot = {
        templateId: savedDraft.templateId,
        device: savedDraft.device,
        activeSection: savedDraft.activeSection,
        activeProjectId: savedDraft.activeProjectId,
        visibility: savedDraft.visibility,
        hero: savedDraft.hero,
        about: savedDraft.about,
        contact: savedDraft.contact,
        projects: savedDraft.projects
      }

      applySnapshot(snapshot)
      updateSavedSnapshot(snapshot)

      return 'draft' as const
    }

    const baseSnapshot = createBaseSnapshot(templateId)

    applySnapshot(baseSnapshot)
    updateSavedSnapshot(baseSnapshot)

    return 'base' as const
  }

function restoreBaseState() {
  const templateId = selectedTemplateId.value

  if (!templateId) {
    return false
  }

  clearDraft(templateId)

  const baseSnapshot = createBaseSnapshot(templateId)

  applySnapshot(baseSnapshot)
  updateSavedSnapshot(baseSnapshot)
  lastHydratedTemplateId.value = templateId

  return true
}
  //  =========== Reset das Seções ================
  //  ----------- Restaurar Base --------------

  function resetSection(sectionId: EditorSectionId) {
    if (sectionId === 'hero') {
      heroForm.value = createBaseHeroForm()
      return
    }

    if (sectionId === 'about') {
      aboutForm.value = createBaseAboutForm()
      return
    }

    if (sectionId === 'contact') {
      contactForm.value = createBaseContactForm()
      return
    }

    if (sectionId === 'projects') {
      const baseProjectsState = createBaseProjectsState()

      projectsForm.value = baseProjectsState.projects
      activeProjectId.value = baseProjectsState.activeProjectId
      projectErrors.value = baseProjectsState.projectErrors
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
    discardChanges,
    hasPendingChanges,
    hasSavedDraft,
    hasSelectedTemplate,
    heroForm,
    lastSavedAt,
    previewData,
    projectErrors,
    projectsForm,
    removeProject,
    resetSection,
    restoreBaseState,
    saveEditorDraft,
    sections,
    selectedTemplate,
    selectedTemplateId,
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