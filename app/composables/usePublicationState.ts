import { computed, watch } from 'vue'
import { useAuthState } from '~/composables/useAuthState'
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

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
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

function getCurrentAccountKey(email: string | null | undefined) {
  return normalizeText(email).toLowerCase() || null
}

export function usePublicationState() {
  const { session } = useAuthState()

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
  const hydratedForAccount = useState<string | null>(
    'portfolio-publication-hydrated-for-account',
    () => null
  )

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

  function resetRemoteState() {
    publicSlug.value = ''
    templateId.value = null
    publicationStatus.value = 'draft'
    hydratedForAccount.value = null
  }

  watch(
    () => getCurrentAccountKey(session.value?.email),
    (accountKey, previousAccountKey) => {
      if (!accountKey) {
        resetRemoteState()
        return
      }

      if (accountKey !== previousAccountKey) {
        resetRemoteState()
      }
    },
    {
      immediate: true
    }
  )

  async function loadPublication(force = false) {
    const accountKey = getCurrentAccountKey(session.value?.email)

    if (!session.value || !accountKey) {
      resetRemoteState()
      return false
    }

    if (!force && hydratedForAccount.value === accountKey) {
      return true
    }

    loadingFromServer.value = true

    try {
      const response = await $fetch<PublicationResponse>('/api/publication')

      applyState(response)
      hydratedForAccount.value = accountKey

      return true
    } catch {
      return false
    } finally {
      loadingFromServer.value = false
    }
  }

  async function savePublication(): Promise<PublicationSaveResult> {
    const accountKey = getCurrentAccountKey(session.value?.email)

    if (!session.value || !accountKey) {
      return {
        ok: false,
        error: 'Sua sessão expirou. Faça login novamente para salvar a publicação.'
      }
    }

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
      hydratedForAccount.value = accountKey

      return response
    } catch (error: any) {
      return {
        ok: false,
        error:
          error?.data?.statusMessage ||
          error?.statusMessage ||
          error?.message ||
          'Não foi possível salvar a publicação agora.'
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
    loadPublication,
    loadingFromServer,
    normalizedPublicSlug,
    publicationStatus,
    publicSlug,
    publicUrl,
    resetRemoteState,
    savePublication,
    savingToServer,
    setPublicationStatus,
    templateId
  }
}