import { computed } from 'vue'
import type { PortfolioPublicationStatus } from '~/types/portfolio'

type PublicationResponse = {
  templateId: string | null
  publicSlug: string
  publicationStatus: PortfolioPublicationStatus
  publicUrl: string
}

type PublicationSaveResult =
  | ({ ok: true } & PublicationResponse)
  | {
      ok: false
      error: string
    }

function sanitizePortfolioSlug(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function usePublicationState() {
  //  =========== Estado da Publicação ================
  //  ----------- Slug, Status e Template --------------

  const publicSlug = useState<string>('portfolio-publication-public-slug', () => '')
  const templateId = useState<string | null>('portfolio-publication-template-id', () => null)
  const publicationStatus = useState<PortfolioPublicationStatus>(
    'portfolio-publication-status',
    () => 'draft'
  )

  const loadingFromServer = useState<boolean>('portfolio-publication-loading', () => false)
  const savingToServer = useState<boolean>('portfolio-publication-saving', () => false)
  const hydrated = useState<boolean>('portfolio-publication-hydrated', () => false)

  const normalizedPublicSlug = computed(() => sanitizePortfolioSlug(publicSlug.value))
  const publicUrl = computed(() => {
    return normalizedPublicSlug.value ? `/p/${normalizedPublicSlug.value}` : ''
  })

  const isPublished = computed(() => publicationStatus.value === 'published')

  function applyState(payload: PublicationResponse) {
    publicSlug.value = payload.publicSlug
    templateId.value = payload.templateId
    publicationStatus.value = payload.publicationStatus
  }

  async function loadPublication(force = false) {
    if (!force && hydrated.value) {
      return true
    }

    loadingFromServer.value = true

    try {
      const response = await $fetch<PublicationResponse>('/api/publication')

      applyState(response)
      hydrated.value = true

      return true
    } catch {
      return false
    } finally {
      loadingFromServer.value = false
    }
  }

  async function savePublication(): Promise<PublicationSaveResult> {
    if (!normalizedPublicSlug.value) {
      return {
        ok: false,
        error: 'Informe um slug público válido antes de salvar.'
      }
    }

    savingToServer.value = true

    try {
      const response = await $fetch<{ ok: true } & PublicationResponse>('/api/publication', {
        method: 'POST',
        body: {
          publicSlug: normalizedPublicSlug.value,
          publicationStatus: publicationStatus.value
        }
      })

      applyState(response)
      hydrated.value = true

      return response
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Não foi possível salvar a publicação agora.'
      }
    } finally {
      savingToServer.value = false
    }
  }

  function setPublicationStatus(value: PortfolioPublicationStatus) {
    publicationStatus.value = value
  }

  return {
    isPublished,
    loadingFromServer,
    normalizedPublicSlug,
    publicationStatus,
    publicSlug,
    publicUrl,
    savePublication,
    savingToServer,
    setPublicationStatus,
    templateId,
    loadPublication
  }
}