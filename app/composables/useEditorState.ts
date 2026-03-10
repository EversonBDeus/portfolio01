import { computed, onMounted, watch } from 'vue'
import {
  EDITOR_SECTIONS,
  type EditorSectionDefinition,
  type EditorSectionId
} from '~/data/editor-sections'
import { useEditorDraft, type EditorDraftPayload } from '~/composables/useEditorDraft'
import {
  useEditorPersistence,
  type EditorRemotePayload
} from '~/composables/useEditorPersistence'
import { useOnboardingPersistence } from '~/composables/useOnboardingPersistence'
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
import {
  buildEditorBaseContent,
  resolveAboutRecord,
  resolveContactRecord,
  resolveHeroRecord
} from '~/utils/editor-content'

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

function normalizeRemoteProjects(projects: EditorProjectForm[]): EditorProjectForm[] {
  const normalized: EditorProjectForm[] = projects
    .slice(0, 3)
    .map((project, index): EditorProjectForm => ({
      id: project.id || `editor-project-${index + 1}`,
      title: project.title,
      category: project.category,
      summary: project.summary,
      link: project.link,
      featured: project.featured
    }))

  const uniqueProjects: EditorProjectForm[] = normalized.filter((project, index, items) => {
    return items.findIndex((item) => item.id === project.id) === index
  })

  if (uniqueProjects.length > 0 && !uniqueProjects.some((project) => project.featured)) {
    const firstProject = uniqueProjects[0]

    if (firstProject) {
      uniqueProjects[0] = {
        id: firstProject.id,
        title: firstProject.title,
        category: firstProject.category,
        summary: firstProject.summary,
        link: firstProject.link,
        featured: true
      }
    }
  }

  return uniqueProjects
}

export function useEditorState() {
  //  =========== Dados do Onboarding ================
  //  ----------- Base do Preview --------------

  const { publicProfile, professional, projects } = useOnboardingState()
  const {
    loadOnboardingFromServer,
    loadingFromServer: loadingOnboardingFromServer
  } = useOnboardingPersistence()

  const {
    hasSelectedTemplate,
    selectedTemplate,
    selectedTemplateId
  } = useTemplateSelection()

  const {
    clearDraft,
    loadDraft,
    resetDraftMeta,
    saveDraft
  } = useEditorDraft()

  const {
    hasSavedEditor,
    lastSavedAt,
    loadEditorFromServer,
    loadingFromServer,
    resetRemoteMeta,
    saveEditorToServer,
    savingToServer
  } = useEditorPersistence()

  const hasSavedDraft = computed(() => hasSavedEditor.value)
  const loadingBaseFromServer = computed(() => loadingOnboardingFromServer.value)

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
      github: source?.github?.trim() ?? '',
      website: source?.website?.trim() ?? '',
      whatsapp: source?.whatsapp?.trim() ?? ''
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

  const editorBaseContent = computed(() => {
    return buildEditorBaseContent({
      publicName: publicProfileBase.value.publicName,
      headline: publicProfileBase.value.headline,
      roleTitle: professionalBase.value.roleTitle,
      professionalSummary: professionalBase.value.professionalSummary,
      bio: publicProfileBase.value.bio,
      location: publicProfileBase.value.location,
      publicEmail: publicProfileBase.value.publicEmail,
      linkedin: publicProfileBase.value.linkedin,
      github: publicProfileBase.value.github,
      website: publicProfileBase.value.website,
      whatsapp: publicProfileBase.value.whatsapp,
      mainSkills: professionalBase.value.mainSkills
    })
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
      publicName: editorBaseContent.value.hero.publicName || 'Seu nome público',
      headline:
        editorBaseContent.value.hero.headline ||
        editorBaseContent.value.hero.roleTitle ||
        'Sua headline profissional',
      roleTitle: editorBaseContent.value.hero.roleTitle || 'Seu cargo principal',
      summary:
        editorBaseContent.value.about.summary ||
        'Adicione seu resumo profissional no onboarding ou no painel para alimentar esta seção do template.',
      location: editorBaseContent.value.hero.location || 'Sua localização',
      skills: normalizeSkills(editorBaseContent.value.hero.skillsText),
      projects: onboardingProjects.value,
      links: []
    }
  })

  function createBaseHeroForm(): EditorHeroForm {
    return {
      ...editorBaseContent.value.hero
    }
  }

  function createBaseAboutForm(): EditorAboutForm {
    return {
      ...editorBaseContent.value.about
    }
  }

  function createBaseContactForm(): EditorContactForm {
    return {
      ...editorBaseContent.value.contact
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

  function createSnapshotFromRemote(
    templateId: string,
    payload: EditorRemotePayload
  ): EditorSnapshot {
    const baseSnapshot = createBaseSnapshot(templateId)
    const remoteProjects = normalizeRemoteProjects(payload.projects)

    const normalizedProjects =
      remoteProjects.length > 0
        ? remoteProjects
        : baseSnapshot.projects

    const normalizedActiveProjectId =
      typeof payload.activeProjectId === 'string' &&
      normalizedProjects.some((project) => project.id === payload.activeProjectId)
        ? payload.activeProjectId
        : normalizedProjects[0]?.id ?? null

    return {
      templateId,
      device: payload.device,
      activeSection: payload.activeSection,
      activeProjectId: normalizedActiveProjectId,
      visibility: {
        ...payload.visibility
      },
      hero: resolveHeroRecord(baseSnapshot.hero, payload.hero),
      about: resolveAboutRecord(baseSnapshot.about, payload.about),
      contact: resolveContactRecord(baseSnapshot.contact, payload.contact),
      projects: normalizedProjects
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
      skills: normalizeSkills(heroForm.value.skillsText || editorBaseContent.value.hero.skillsText),
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

  async function hydrateEditorForTemplate(templateId: string, force = false) {
    await loadOnboardingFromServer(force)

    const remoteResponse = await loadEditorFromServer(force)

    if (remoteResponse?.editor) {
      const remoteSnapshot = createSnapshotFromRemote(
        templateId,
        remoteResponse.editor
      )

      applySnapshot(remoteSnapshot)
      updateSavedSnapshot(remoteSnapshot)
      lastHydratedTemplateId.value = templateId
      saveDraft(remoteSnapshot)

      return
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
    resetRemoteMeta()
    savedSnapshotHash.value = null
    lastHydratedTemplateId.value = null
  }

  async function hydrateEditorState(force = false) {
    const templateId = selectedTemplateId.value

    if (!templateId) {
      resetHydrationState()
      return
    }

    if (!force && lastHydratedTemplateId.value === templateId) {
      return
    }

    await hydrateEditorForTemplate(templateId, force)
  }

  watch(
    selectedTemplateId,
    () => {
      void hydrateEditorState(true)
    },
    {
      immediate: true
    }
  )

  onMounted(() => {
    void hydrateEditorState(true)
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

  async function saveEditorDraft() {
    const templateId = selectedTemplateId.value

    if (!templateId) {
      return {
        ok: false as const,
        error: 'Selecione um template antes de salvar o editor.'
      }
    }

    const currentSnapshot = createCurrentSnapshot(templateId)

    const result = await saveEditorToServer({
      templateId: currentSnapshot.templateId,
      device: currentSnapshot.device,
      activeSection: currentSnapshot.activeSection,
      activeProjectId: currentSnapshot.activeProjectId,
      visibility: currentSnapshot.visibility,
      hero: currentSnapshot.hero,
      about: currentSnapshot.about,
      contact: currentSnapshot.contact,
      projects: currentSnapshot.projects
    })

    if (!result.ok) {
      return result
    }

    saveDraft(currentSnapshot)
    updateSavedSnapshot(currentSnapshot)
    lastHydratedTemplateId.value = templateId

    return {
      ok: true as const
    }
  }

  async function discardChanges() {
    const templateId = selectedTemplateId.value

    if (!templateId) {
      return 'unavailable' as const
    }

    const remoteResponse = await loadEditorFromServer(true)

    if (remoteResponse?.editor) {
      const remoteSnapshot = createSnapshotFromRemote(
        templateId,
        remoteResponse.editor
      )

      applySnapshot(remoteSnapshot)
      updateSavedSnapshot(remoteSnapshot)
      saveDraft(remoteSnapshot)

      return 'remote' as const
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

  async function restoreBaseState() {
    const templateId = selectedTemplateId.value

    if (!templateId) {
      return {
        ok: false as const,
        error: 'Selecione um template antes de restaurar a base.'
      }
    }

    await loadOnboardingFromServer(true)

    const baseSnapshot = createBaseSnapshot(templateId)

    const result = await saveEditorToServer({
      templateId: baseSnapshot.templateId,
      device: baseSnapshot.device,
      activeSection: baseSnapshot.activeSection,
      activeProjectId: baseSnapshot.activeProjectId,
      visibility: baseSnapshot.visibility,
      hero: baseSnapshot.hero,
      about: baseSnapshot.about,
      contact: baseSnapshot.contact,
      projects: baseSnapshot.projects
    })

    if (!result.ok) {
      return result
    }

    clearDraft(templateId)
    applySnapshot(baseSnapshot)
    updateSavedSnapshot(baseSnapshot)
    lastHydratedTemplateId.value = templateId

    return {
      ok: true as const
    }
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
    loadingFromServer,
    loadingBaseFromServer,
    previewData,
    projectErrors,
    projectsForm,
    removeProject,
    resetSection,
    restoreBaseState,
    saveEditorDraft,
    savingToServer,
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