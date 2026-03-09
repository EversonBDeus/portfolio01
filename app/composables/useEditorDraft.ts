import type { EditorSectionId } from '~/data/editor-sections'
import type { EditorContactForm } from '~/schemas/editor-contact'
import type { EditorProjectForm } from '~/schemas/editor-project'

export type EditorDraftDevice = 'desktop' | 'mobile'

export type EditorDraftHeroForm = {
  publicName: string
  headline: string
  roleTitle: string
  location: string
  skillsText: string
}

export type EditorDraftAboutForm = {
  summary: string
}

export type EditorDraftVisibility = Record<EditorSectionId, boolean>

export type EditorDraftPayload = {
  version: 1
  templateId: string
  updatedAt: string
  device: EditorDraftDevice
  activeSection: EditorSectionId
  activeProjectId: string | null
  visibility: EditorDraftVisibility
  hero: EditorDraftHeroForm
  about: EditorDraftAboutForm
  contact: EditorContactForm
  projects: EditorProjectForm[]
}

const EDITOR_DRAFT_VERSION = 1
const EDITOR_SECTION_IDS = ['hero', 'about', 'projects', 'contact'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isEditorSectionId(value: unknown): value is EditorSectionId {
  return (
    typeof value === 'string' &&
    (EDITOR_SECTION_IDS as readonly string[]).includes(value)
  )
}

function isEditorDevice(value: unknown): value is EditorDraftDevice {
  return value === 'desktop' || value === 'mobile'
}

function getEditorDraftStorageKey(templateId: string) {
  return `portfolio-editor-draft:${templateId}`
}

function getString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function getBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function parseHero(value: unknown): EditorDraftHeroForm | null {
  if (!isRecord(value)) {
    return null
  }

  const publicName = value.publicName
  const headline = value.headline
  const roleTitle = value.roleTitle
  const location = value.location
  const skillsText = value.skillsText

  if (
    typeof publicName !== 'string' ||
    typeof headline !== 'string' ||
    typeof roleTitle !== 'string' ||
    typeof location !== 'string' ||
    typeof skillsText !== 'string'
  ) {
    return null
  }

  return {
    publicName,
    headline,
    roleTitle,
    location,
    skillsText
  }
}

function parseAbout(value: unknown): EditorDraftAboutForm | null {
  if (!isRecord(value)) {
    return null
  }

  const summary = value.summary

  if (typeof summary !== 'string') {
    return null
  }

  return {
    summary
  }
}

function parseVisibility(value: unknown): EditorDraftVisibility | null {
  if (!isRecord(value)) {
    return null
  }

  return {
    hero: typeof value.hero === 'boolean' ? value.hero : true,
    about: typeof value.about === 'boolean' ? value.about : true,
    projects: typeof value.projects === 'boolean' ? value.projects : true,
    contact: typeof value.contact === 'boolean' ? value.contact : true
  }
}

function parseContact(value: unknown): EditorContactForm | null {
  if (!isRecord(value)) {
    return null
  }

  return {
    publicEmail: getString(value.publicEmail),
    whatsapp: getString(value.whatsapp),
    website: getString(value.website),
    linkedin: getString(value.linkedin),
    github: getString(value.github)
  }
}

function parseProjects(value: unknown): EditorProjectForm[] {
  if (!Array.isArray(value)) {
    return []
  }

  const parsedProjects = value.slice(0, 3).map((item, index) => {
    if (!isRecord(item)) {
      return {
        id: `draft-project-${index + 1}`,
        title: '',
        category: '',
        summary: '',
        link: '',
        featured: index === 0
      }
    }

    return {
      id: getString(item.id, `draft-project-${index + 1}`),
      title: getString(item.title),
      category: getString(item.category),
      summary: getString(item.summary),
      link: getString(item.link),
      featured: getBoolean(item.featured, index === 0)
    }
  })

  const uniqueProjects = parsedProjects.filter((project, index, items) => {
    return items.findIndex((item) => item.id === project.id) === index
  })

const firstProject = uniqueProjects[0]

if (firstProject && !uniqueProjects.some((project) => project.featured)) {
  uniqueProjects[0] = {
    ...firstProject,
    featured: true
  }
}

  return uniqueProjects
}

function sanitizeDraftPayload(
  value: unknown,
  templateId: string
): EditorDraftPayload | null {
  if (!isRecord(value)) {
    return null
  }

  if (value.version !== EDITOR_DRAFT_VERSION) {
    return null
  }

  if (value.templateId !== templateId || typeof value.updatedAt !== 'string') {
    return null
  }

  if (!isEditorDevice(value.device) || !isEditorSectionId(value.activeSection)) {
    return null
  }

  const hero = parseHero(value.hero)
  const about = parseAbout(value.about)
  const visibility = parseVisibility(value.visibility)
  const contact = parseContact(value.contact)
  const projects = parseProjects(value.projects)

  if (!hero || !about || !visibility || !contact) {
    return null
  }

  const normalizedActiveProjectId =
    typeof value.activeProjectId === 'string' &&
    projects.some((project) => project.id === value.activeProjectId)
      ? value.activeProjectId
      : projects[0]?.id ?? null

  return {
    version: EDITOR_DRAFT_VERSION,
    templateId,
    updatedAt: value.updatedAt,
    device: value.device,
    activeSection: value.activeSection,
    activeProjectId: normalizedActiveProjectId,
    visibility,
    hero,
    about,
    contact,
    projects
  }
}

export function useEditorDraft() {
  //  =========== Metadados do Rascunho ================
  //  ----------- Estado Compartilhado --------------

  const hasSavedDraft = useState<boolean>('editor-has-saved-draft', () => false)
  const lastSavedAt = useState<string | null>('editor-last-saved-at', () => null)

  function resetDraftMeta() {
    hasSavedDraft.value = false
    lastSavedAt.value = null
  }

  function loadDraft(templateId: string) {
    if (!import.meta.client) {
      return null
    }

    const storageKey = getEditorDraftStorageKey(templateId)
    const rawDraft = window.localStorage.getItem(storageKey)

    if (!rawDraft) {
      resetDraftMeta()
      return null
    }

    try {
      const parsedDraft = JSON.parse(rawDraft)
      const draft = sanitizeDraftPayload(parsedDraft, templateId)

      if (!draft) {
        window.localStorage.removeItem(storageKey)
        resetDraftMeta()
        return null
      }

      hasSavedDraft.value = true
      lastSavedAt.value = draft.updatedAt

      return draft
    } catch {
      window.localStorage.removeItem(storageKey)
      resetDraftMeta()

      return null
    }
  }

  function saveDraft(payload: Omit<EditorDraftPayload, 'version' | 'updatedAt'>) {
    if (!import.meta.client) {
      return null
    }

    const nextDraft: EditorDraftPayload = {
      ...payload,
      version: EDITOR_DRAFT_VERSION,
      updatedAt: new Date().toISOString()
    }

    window.localStorage.setItem(
      getEditorDraftStorageKey(payload.templateId),
      JSON.stringify(nextDraft)
    )

    hasSavedDraft.value = true
    lastSavedAt.value = nextDraft.updatedAt

    return nextDraft
  }

  function clearDraft(templateId: string) {
    if (!import.meta.client) {
      return
    }

    window.localStorage.removeItem(getEditorDraftStorageKey(templateId))
    resetDraftMeta()
  }

  return {
    clearDraft,
    hasSavedDraft,
    lastSavedAt,
    loadDraft,
    resetDraftMeta,
    saveDraft
  }
}