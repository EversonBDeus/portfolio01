<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TemplatesHeader from '~/components/dashboard/templates/TemplatesHeader.vue'
import TemplatesFilters from '~/components/dashboard/templates/TemplatesFilters.vue'
import TemplateCard from '~/components/dashboard/templates/TemplateCard.vue'
import TemplateListItem from '~/components/dashboard/templates/TemplateListItem.vue'
import TemplatesEmpty from '~/components/dashboard/templates/TemplatesEmpty.vue'
import TemplatesPreviewModal from '~/components/dashboard/templates/TemplatesPreviewModal.vue'
import { useTemplatesState } from '~/composables/useTemplatesState'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Templates' })

const toast = useToast()

const {
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
  totalFree,
  totalPlus,
  totalPro,
  templates,
  viewMode
} = useTemplatesState()

const selectedTemplateDescription = computed(() => {
  if (!selectedTemplate.value) return ''

  return `${selectedTemplate.value.name} está salvo como template atual desta conta e já alimenta o editor visual.`
})

onMounted(async () => {
  const loaded = await hydrateSelection()

  if (!loaded) {
    toast.add({
      title: 'Modo local temporário',
      description: 'Não foi possível carregar o template salvo agora. Você ainda pode escolher outro template nesta sessão.',
      color: 'warning',
      icon: 'i-lucide-cloud-off'
    })
  }
})

function handleViewMode(mode: 'grid' | 'list') {
  setViewMode(mode)
}

function handleCategory(category: typeof selectedCategory.value) {
  setCategory(category)
}

function handleSearch(value: string) {
  setSearchQuery(value)
}

function handlePreviewPlan(plan: typeof previewPlan.value) {
  setPreviewPlan(plan)
}

function handleOpenPreview(templateId: string) {
  openPreview(templateId)
}

async function handleSelectTemplate(templateId: string) {
  const result = await selectTemplate(templateId)

  if (!result.allowed) {
    toast.add({
      title: 'Não foi possível selecionar',
      description: result.reason,
      color: 'warning',
      icon: 'i-lucide-lock'
    })

    return
  }

  toast.add({
    title: 'Template selecionado',
    description: `${result.template.name} foi salvo como template atual da sua conta.`,
    color: 'success',
    icon: 'i-lucide-circle-check'
  })
}

function handleModalOpenChange(value: boolean) {
  if (!value) {
    closePreview()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!--  =========== Cabeçalho da Página ================ -->
    <!--  ----------- Título e Modo de Visualização -------------- -->

    <TemplatesHeader
      :total="templates.length"
      :total-free="totalFree"
      :total-plus="totalPlus"
      :total-pro="totalPro"
      :view-mode="viewMode"
      @update:view-mode="handleViewMode"
    />

    <!--  =========== Alertas da Etapa ================ -->
    <!--  ----------- Escopo e Seleção Atual -------------- -->

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-layout-template"
      title="Escopo desta tela"
      description="Aqui o usuário escolhe a base visual do portfólio. A seleção agora fica persistida na conta e continua separada dos dados públicos e internos do sistema."
      color="neutral"
      variant="outline"
    />

    <UAlert
      v-if="isSyncingSelection"
      class="dashboard-note-alert"
      icon="i-lucide-refresh-cw"
      title="Sincronizando template"
      description="Carregando ou salvando a seleção atual desta conta."
      color="neutral"
      variant="outline"
    />

    <UAlert
      v-if="selectedTemplate"
      class="dashboard-note-alert"
      icon="i-lucide-badge-check"
      title="Template atual"
      :description="selectedTemplateDescription"
      color="success"
      variant="outline"
    />

    <!--  =========== Filtros ================ -->
    <!--  ----------- Busca, Categorias e Plano -------------- -->

    <TemplatesFilters
      :categories="categories"
      :selected-category="selectedCategory"
      :search-query="searchQuery"
      :preview-plan="previewPlan"
      @update:selected-category="handleCategory"
      @update:search-query="handleSearch"
      @update:preview-plan="handlePreviewPlan"
    />

    <!--  =========== Resumo dos Resultados ================ -->
    <!--  ----------- Contagem Atual -------------- -->

    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="font-medium">Resultado atual</p>
          <p class="text-sm text-muted">
            {{ filteredTemplates.length }} template(s) encontrado(s) · {{ availableCount }} liberado(s) no plano simulado.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UBadge color="neutral" variant="soft">
            Plano atual: {{ previewPlan.toUpperCase() }}
          </UBadge>

          <UBadge color="primary" variant="subtle">
            Visualização: {{ viewMode === 'grid' ? 'Grid' : 'Lista' }}
          </UBadge>
        </div>
      </div>
    </div>

    <!--  =========== Estado Vazio ================ -->
    <!--  ----------- Sem Resultado -------------- -->

    <TemplatesEmpty
      v-if="filteredTemplates.length === 0"
      @reset="resetFilters"
    />

    <!--  =========== Grid de Templates ================ -->
    <!--  ----------- Cards -------------- -->

    <div
      v-else-if="viewMode === 'grid'"
      class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      <TemplateCard
        v-for="template in filteredTemplates"
        :key="template.id"
        :template="template"
        :available="isTemplateAvailable(template)"
        :selected="selectedTemplateId === template.id"
        @preview="handleOpenPreview"
        @select="handleSelectTemplate"
      />
    </div>

    <!--  =========== Lista de Templates ================ -->
    <!--  ----------- Linhas Horizontais -------------- -->

    <div v-else class="space-y-4">
      <TemplateListItem
        v-for="template in filteredTemplates"
        :key="template.id"
        :template="template"
        :available="isTemplateAvailable(template)"
        :selected="selectedTemplateId === template.id"
        @preview="handleOpenPreview"
        @select="handleSelectTemplate"
      />
    </div>

    <!--  =========== Modal de Preview ================ -->
    <!--  ----------- Pré-visualização -------------- -->

    <TemplatesPreviewModal
      :open="Boolean(previewTemplate)"
      :template="previewTemplate"
      :available="previewTemplate ? isTemplateAvailable(previewTemplate) : false"
      @update:open="handleModalOpenChange"
      @select="handleSelectTemplate"
    />
  </div>
</template>