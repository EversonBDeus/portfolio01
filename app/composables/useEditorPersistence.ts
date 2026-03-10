import type { EditorSectionId } from '~/data/editor-sections'
import type { EditorContactForm } from '~/schemas/editor-contact'
import type { EditorProjectForm } from '~/schemas/editor-project'
import type {
  EditorAboutForm,
  EditorDevice,
  EditorHeroForm,
  EditorSectionVisibility
} from '~/composables/useEditorState'
import { useAuthState } from '~/composables/useAuthState'

export type EditorRemotePayload = {
  templateId: string | null
  device: EditorDevice
  activeSection: EditorSectionId
  activeProjectId: string | null
  visibility: EditorSectionVisibility
  hero: EditorHeroForm
  about: EditorAboutForm
  contact: EditorContactForm
  projects: EditorProjectForm[]
}

type EditorRemoteResponse = {
  hasEditor: boolean
  hasCustomEditor: boolean
  updatedAt: string | null
  editor: EditorRemotePayload | null
}

type EditorRemoteSaveResult =
  | {
      ok: true
      updatedAt: string | null
    }
  | {
      ok: false
      error: string
    }

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function normalizeDevice(value: unknown): EditorDevice {
  return value === 'mobile' ? 'mobile' : 'desktop'
}

function normalizeSection(value: unknown): EditorSectionId {
  return value === 'about' || value === 'projects' || value === 'contact'
    ? value
    : 'hero'
}

function normalizeVisibility(value: unknown): EditorSectionVisibility {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    hero: typeof source.hero === 'boolean' ? source.hero : true,
    about: typeof source.about === 'boolean' ? source.about : true,
    projects: typeof source.projects === 'boolean' ? source.projects : true,
    contact: typeof source.contact === 'boolean' ? source.contact : true
  }
}

function normalizeHero(value: unknown): EditorHeroForm {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    publicName: normalizeText(source.publicName),
    headline: normalizeText(source.headline),
    roleTitle: normalizeText(source.roleTitle),
    location: normalizeText(source.location),
    skillsText: normalizeText(source.skillsText)
  }
}

function normalizeAbout(value: unknown): EditorAboutForm {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    summary: normalizeText(source.summary)
  }
}

function normalizeContact(value: unknown): EditorContactForm {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    publicEmail: normalizeText(source.publicEmail),
    whatsapp: normalizeText(source.whatsapp),
    website: normalizeText(source.website),
    linkedin: normalizeText(source.linkedin),
    github: normalizeText(source.github)
  }
}

function normalizeProjects(value: unknown): EditorProjectForm[] {
  if (!Array.isArray(value)) {
    return []
  }

  const projects: EditorProjectForm[] = value
    .slice(0, 3)
    .map((item, index): EditorProjectForm => {
      const source =
        item && typeof item === 'object' && !Array.isArray(item)
          ? (item as Record<string, unknown>)
          : {}

      return {
        id: normalizeText(source.id) || `editor-project-${index + 1}`,
        title: normalizeText(source.title),
        category: normalizeText(source.category),
        summary: normalizeText(source.summary),
        link: normalizeText(source.link),
        featured: typeof source.featured === 'boolean' ? source.featured : index === 0
      }
    })

  const uniqueProjects: EditorProjectForm[] = projects.filter((project, index, items) => {
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

function normalizeEditorPayload(value: unknown): EditorRemotePayload | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const source = value as Record<string, unknown>
  const projects = normalizeProjects(source.projects)

  const activeProjectId =
    typeof source.activeProjectId === 'string' &&
    projects.some((project) => project.id === source.activeProjectId)
      ? source.activeProjectId
      : projects[0]?.id ?? null

  return {
    templateId: normalizeText(source.templateId) || null,
    device: normalizeDevice(source.device),
    activeSection: normalizeSection(source.activeSection),
    activeProjectId,
    visibility: normalizeVisibility(source.visibility),
    hero: normalizeHero(source.hero),
    about: normalizeAbout(source.about),
    contact: normalizeContact(source.contact),
    projects
  }
}

function getCurrentAccountKey(email: string | null | undefined) {
  return normalizeText(email).toLowerCase() || null
}

export function useEditorPersistence() {
  const { session } = useAuthState()

  const loadingFromServer = useState<boolean>('editor-loading-from-server', () => false)
  const savingToServer = useState<boolean>('editor-saving-to-server', () => false)
  const hydratedForAccount = useState<string | null>('editor-hydrated-for-account', () => null)
  const hasSavedEditor = useState<boolean>('editor-has-saved-remote', () => false)
  const hasCustomEditor = useState<boolean>('editor-has-custom-remote', () => false)
  const lastSavedAt = useState<string | null>('editor-last-saved-at', () => null)

  function resetRemoteMeta() {
    hasSavedEditor.value = false
    hasCustomEditor.value = false
    lastSavedAt.value = null
  }

  function resetRemoteState() {
    hydratedForAccount.value = null
    resetRemoteMeta()
  }

  async function loadEditorFromServer(force = false): Promise<EditorRemoteResponse | null> {
    const accountKey = getCurrentAccountKey(session.value?.email)

    if (!session.value || !accountKey) {
      resetRemoteState()
      return null
    }

    if (!force && hydratedForAccount.value === accountKey) {
      return null
    }

    loadingFromServer.value = true

    try {
      const response = await $fetch<EditorRemoteResponse>('/api/editor')

      hydratedForAccount.value = accountKey
      hasSavedEditor.value = Boolean(response.hasEditor)
      hasCustomEditor.value = Boolean(response.hasCustomEditor)
      lastSavedAt.value = response.updatedAt ?? null

      return {
        hasEditor: Boolean(response.hasEditor),
        hasCustomEditor: Boolean(response.hasCustomEditor),
        updatedAt: response.updatedAt ?? null,
        editor: normalizeEditorPayload(response.editor)
      }
    } catch {
      return null
    } finally {
      loadingFromServer.value = false
    }
  }

  async function saveEditorToServer(
    payload: EditorRemotePayload
  ): Promise<EditorRemoteSaveResult> {
    if (!session.value) {
      return {
        ok: false,
        error: 'Sua sessão expirou. Faça login novamente para salvar o editor.'
      }
    }

    savingToServer.value = true

    try {
      const response = await $fetch<{ ok: true; updatedAt: string | null }>('/api/editor/save', {
        method: 'POST',
        body: payload
      })

      hydratedForAccount.value = getCurrentAccountKey(session.value.email)
      hasSavedEditor.value = true
      hasCustomEditor.value = true
      lastSavedAt.value = response.updatedAt ?? new Date().toISOString()

      return {
        ok: true,
        updatedAt: lastSavedAt.value
      }
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Não foi possível salvar o editor agora.'
      }
    } finally {
      savingToServer.value = false
    }
  }

  return {
    hasCustomEditor,
    hasSavedEditor,
    hydratedForAccount,
    lastSavedAt,
    loadEditorFromServer,
    loadingFromServer,
    resetRemoteMeta,
    resetRemoteState,
    saveEditorToServer,
    savingToServer
  }
}