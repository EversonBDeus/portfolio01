import { computed, watch } from 'vue'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'
import { useAuthState } from '~/composables/useAuthState'

type TemplateSelectionResponse = {
  templateId: string | null
}

type TemplateSelectionSaveResult =
  | {
      ok: true
      templateId: string
    }
  | {
      ok: false
      error: string
    }

const LEGACY_TEMPLATE_ID_ALIASES: Record<string, string> = {
  berlim: 'quiet-frame',
  toquio: 'neon-pulse',
  'nova-york': 'aurora-ux',
  londres: 'obsidian-prime',
  lisboa: 'still-form',
  seul: 'noir-signal'
}

function normalizeTemplateId(value: unknown) {
  const templateId = String(value ?? '').trim()

  if (!templateId) {
    return null
  }

  const currentTemplate = PORTFOLIO_TEMPLATES.find((template) => template.id === templateId)

  if (currentTemplate) {
    return currentTemplate.id
  }

  return LEGACY_TEMPLATE_ID_ALIASES[templateId] ?? null
}

export function useTemplateSelection() {
  const { session } = useAuthState()

  const selectedTemplateIdCookie = useCookie<string | null>('portfolio-selected-template-id', {
    sameSite: 'lax',
    path: '/',
    default: () => null
  })

  const selectedTemplateIdState = useState<string | null>(
    'selected-template-id',
    () => normalizeTemplateId(selectedTemplateIdCookie.value)
  )

  const loadingFromServer = useState<boolean>('template-selection-loading-from-server', () => false)
  const savingToServer = useState<boolean>('template-selection-saving-to-server', () => false)
  const hydratedForAccount = useState<string | null>('template-selection-hydrated-for-account', () => null)

  function applySelection(templateId: string | null) {
    selectedTemplateIdState.value = templateId
    selectedTemplateIdCookie.value = templateId
  }

  function getCurrentAccountKey() {
    return session.value?.email?.trim().toLowerCase() ?? null
  }

  watch(
    () => getCurrentAccountKey(),
    (accountKey, previousAccountKey) => {
      if (!accountKey) {
        applySelection(null)
        hydratedForAccount.value = null
        return
      }

      if (accountKey !== previousAccountKey) {
        applySelection(null)
        hydratedForAccount.value = null
      }
    },
    {
      immediate: true
    }
  )

  const selectedTemplateId = computed<string | null>({
    get: () => selectedTemplateIdState.value,
    set: (value) => {
      applySelection(normalizeTemplateId(value))
    }
  })

  const selectedTemplate = computed(() => {
    return PORTFOLIO_TEMPLATES.find((template) => template.id === selectedTemplateId.value) ?? null
  })

  const hasSelectedTemplate = computed(() => Boolean(selectedTemplate.value))
  const isTemplateSelectionBusy = computed(() => loadingFromServer.value || savingToServer.value)

  async function loadSelectionFromServer(force = false) {
    const accountKey = getCurrentAccountKey()

    if (!import.meta.client || !accountKey) {
      return false
    }

    if (!force && hydratedForAccount.value === accountKey) {
      return true
    }

    loadingFromServer.value = true

    try {
      const response = await $fetch<TemplateSelectionResponse>('/api/template-selection')

      applySelection(normalizeTemplateId(response.templateId))
      hydratedForAccount.value = accountKey

      return true
    } catch {
      return false
    } finally {
      loadingFromServer.value = false
    }
  }

  async function saveSelectionToServer(templateId: string): Promise<TemplateSelectionSaveResult> {
    const normalizedTemplateId = normalizeTemplateId(templateId)

    if (!normalizedTemplateId) {
      return {
        ok: false,
        error: 'Selecione um template válido antes de salvar.'
      }
    }

    if (!session.value) {
      return {
        ok: false,
        error: 'Sua sessão expirou. Faça login novamente para salvar o template.'
      }
    }

    const templateExists = PORTFOLIO_TEMPLATES.some((template) => template.id === normalizedTemplateId)

    if (!templateExists) {
      return {
        ok: false,
        error: 'Template não encontrado.'
      }
    }

    savingToServer.value = true

    try {
      const response = await $fetch<{ ok: true; templateId: string }>('/api/template-selection', {
        method: 'POST',
        body: {
          templateId: normalizedTemplateId
        }
      })

      applySelection(normalizeTemplateId(response.templateId))
      hydratedForAccount.value = getCurrentAccountKey()

      return {
        ok: true,
        templateId: normalizedTemplateId
      }
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Não foi possível salvar o template agora.'
      }
    } finally {
      savingToServer.value = false
    }
  }

  function setSelectedTemplate(templateId: string) {
    applySelection(normalizeTemplateId(templateId))
  }

  function clearSelectedTemplate() {
    applySelection(null)
  }

  return {
    clearSelectedTemplate,
    hasSelectedTemplate,
    isTemplateSelectionBusy,
    loadingFromServer,
    loadSelectionFromServer,
    savingToServer,
    saveSelectionToServer,
    selectedTemplate,
    selectedTemplateId,
    setSelectedTemplate
  }
}