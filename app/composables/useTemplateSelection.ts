import { computed, watch } from 'vue'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'

export function useTemplateSelection() {
  //  =========== Estado do Template Atual ================
  //  ----------- State + Cookie Sincronizados --------------

  const selectedTemplateIdState = useState<string | null>('selected-template-id', () => null)

  const selectedTemplateIdCookie = useCookie<string | null>('portfolio-selected-template-id', {
    sameSite: 'lax',
    path: '/',
    default: () => null
  })

  watch(
    selectedTemplateIdCookie,
    (value) => {
      if (value !== selectedTemplateIdState.value) {
        selectedTemplateIdState.value = value
      }
    },
    {
      immediate: true
    }
  )

  watch(
    selectedTemplateIdState,
    (value) => {
      if (value !== selectedTemplateIdCookie.value) {
        selectedTemplateIdCookie.value = value
      }
    },
    {
      immediate: true
    }
  )

  const selectedTemplateId = computed<string | null>({
    get: () => selectedTemplateIdState.value ?? selectedTemplateIdCookie.value ?? null,
    set: (value) => {
      selectedTemplateIdState.value = value
      selectedTemplateIdCookie.value = value
    }
  })

  const selectedTemplate = computed(() => {
    return PORTFOLIO_TEMPLATES.find((template) => template.id === selectedTemplateId.value) ?? null
  })

  const hasSelectedTemplate = computed(() => Boolean(selectedTemplate.value))

  function setSelectedTemplate(templateId: string) {
    selectedTemplateId.value = templateId
  }

  function clearSelectedTemplate() {
    selectedTemplateId.value = null
  }

  return {
    clearSelectedTemplate,
    hasSelectedTemplate,
    selectedTemplate,
    selectedTemplateId,
    setSelectedTemplate
  }
}