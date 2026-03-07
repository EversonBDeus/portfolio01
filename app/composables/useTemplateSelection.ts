import { computed } from 'vue'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'

export function useTemplateSelection() {
  //  =========== Estado do Template Atual ================
  //  ----------- Seleção Compartilhada --------------

  const selectedTemplateId = useState<string | null>('selected-template-id', () => null)

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