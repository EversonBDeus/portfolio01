import { computed } from 'vue'
import type { PlanTier } from '~/composables/usePerfilState'
import { useTemplateSelection } from '~/composables/useTemplateSelection'
import {
  PORTFOLIO_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type PortfolioTemplate,
  type TemplateCategoryFilter,
  type TemplateTier
} from '~/data/templates'

export type TemplatesViewMode = 'grid' | 'list'

type TemplateSelectionResult =
  | {
      allowed: true
      template: PortfolioTemplate
    }
  | {
      allowed: false
      reason: string
    }

const PLAN_ACCESS_ORDER: Record<PlanTier, number> = {
  free: 0,
  plus: 1,
  pro: 2
}

const TEMPLATE_ACCESS_ORDER: Record<TemplateTier, number> = {
  free: 0,
  plus: 1,
  pro: 2
}

export function useTemplatesState() {
  //  =========== Estado da Tela ================
  //  ----------- Filtros e Visualização --------------

  const selectedCategory = useState<TemplateCategoryFilter>('templates-selected-category', () => 'Todos')
  const searchQuery = useState<string>('templates-search-query', () => '')
  const viewMode = useState<TemplatesViewMode>('templates-view-mode', () => 'grid')
  const previewPlan = useState<PlanTier>('templates-preview-plan', () => 'free')

  //  =========== Estado do Template ================
  //  ----------- Preview e Seleção --------------

  const previewTemplateId = useState<string | null>('templates-preview-template-id', () => null)

  const {
    loadingFromServer,
    loadSelectionFromServer,
    saveSelectionToServer,
    savingToServer,
    selectedTemplate,
    selectedTemplateId
  } = useTemplateSelection()

  const isSyncingSelection = computed(() => loadingFromServer.value || savingToServer.value)

  //  =========== Catálogo ================
  //  ----------- Dados Mockados --------------

  const templates = computed(() => PORTFOLIO_TEMPLATES)
  const categories = computed(() => TEMPLATE_CATEGORIES)

  const filteredTemplates = computed(() => {
    const normalizedQuery = searchQuery.value.trim().toLowerCase()

    return templates.value.filter((template) => {
      const matchesCategory =
        selectedCategory.value === 'Todos' || template.category === selectedCategory.value

      const matchesQuery =
        !normalizedQuery ||
        template.name.toLowerCase().includes(normalizedQuery) ||
        template.description.toLowerCase().includes(normalizedQuery) ||
        template.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesQuery
    })
  })

  const previewTemplate = computed(() => {
    return templates.value.find((template) => template.id === previewTemplateId.value) ?? null
  })

  const totalFree = computed(() => templates.value.filter((template) => template.tier === 'free').length)
  const totalPlus = computed(() => templates.value.filter((template) => template.tier === 'plus').length)
  const totalPro = computed(() => templates.value.filter((template) => template.tier === 'pro').length)

  const availableCount = computed(() => {
    return filteredTemplates.value.filter((template) => isTemplateAvailable(template)).length
  })

  //  =========== Regras de Acesso ================
  //  ----------- Plano x Template --------------

  function isTemplateAvailable(template: PortfolioTemplate) {
    return PLAN_ACCESS_ORDER[previewPlan.value] >= TEMPLATE_ACCESS_ORDER[template.tier]
  }

  function getLockedReason(template: PortfolioTemplate) {
    if (template.tier === 'plus') {
      return 'Este template exige o plano Plus ou superior.'
    }

    if (template.tier === 'pro') {
      return 'Este template exige o plano Pro.'
    }

    return 'Este template não está disponível no plano atual.'
  }

  //  =========== Ações da Tela ================
  //  ----------- Filtros e Preview --------------

  function setCategory(category: TemplateCategoryFilter) {
    selectedCategory.value = category
  }

  function setSearchQuery(value: string) {
    searchQuery.value = value
  }

  function setViewMode(mode: TemplatesViewMode) {
    viewMode.value = mode
  }

  function setPreviewPlan(plan: PlanTier) {
    previewPlan.value = plan
  }

  function openPreview(templateId: string) {
    previewTemplateId.value = templateId
  }

  function closePreview() {
    previewTemplateId.value = null
  }

  function resetFilters() {
    selectedCategory.value = 'Todos'
    searchQuery.value = ''
  }

  async function hydrateSelection(force = false) {
    return loadSelectionFromServer(force)
  }

  //  =========== Seleção do Template ================
  //  ----------- Estado Atual --------------

  async function selectTemplate(templateId: string): Promise<TemplateSelectionResult> {
    const template = templates.value.find((item) => item.id === templateId)

    if (!template) {
      return {
        allowed: false,
        reason: 'Template não encontrado.'
      }
    }

    if (!isTemplateAvailable(template)) {
      return {
        allowed: false,
        reason: getLockedReason(template)
      }
    }

    const saveResult = await saveSelectionToServer(template.id)

    if (!saveResult.ok) {
      return {
        allowed: false,
        reason: saveResult.error
      }
    }

    return {
      allowed: true,
      template
    }
  }

  return {
    availableCount,
    categories,
    closePreview,
    filteredTemplates,
    hydrateSelection,
    isSyncingSelection,
    isTemplateAvailable,
    openPreview,
    previewPlan,
    previewTemplate,
    resetFilters,
    searchQuery,
    selectTemplate,
    selectedCategory,
    selectedTemplate,
    selectedTemplateId,
    setCategory,
    setPreviewPlan,
    setSearchQuery,
    setViewMode,
    templates,
    totalFree,
    totalPlus,
    totalPro,
    viewMode
  }
}