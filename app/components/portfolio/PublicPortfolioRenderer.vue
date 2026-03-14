<script setup lang="ts">
import { computed } from 'vue'
import {
  getPortfolioTemplateRegistryItem,
  resolvePortfolioTemplatePresetId,
} from '~/data/portfolio-template-registry'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode,
} from '~/types/portfolio-public-view-model'
import { normalizePortfolioPublicViewModel } from '~/utils/normalize-portfolio-public-view-model'

type Props = {
  portfolio?: PortfolioPublicViewModel | unknown | null
  templateId?: string | null
  templatePresetId?: string | null
  templateMode?: PortfolioTemplateMode | null
}

const props = withDefaults(defineProps<Props>(), {
  templateId: null,
  templatePresetId: null,
  templateMode: null,
})

const normalizedPortfolio = computed(() => {
  return normalizePortfolioPublicViewModel(props.portfolio)
})

const templateDefinition = computed(() => {
  return getPortfolioTemplateRegistryItem(
    props.templateId ?? normalizedPortfolio.value?.settings.templateId ?? null,
  )
})

const resolvedTemplatePresetId = computed(() => {
  return resolvePortfolioTemplatePresetId(
    props.templatePresetId ?? normalizedPortfolio.value?.settings.templatePresetId ?? null,
    templateDefinition.value.defaultPresetId,
  )
})

const resolvedTemplateMode = computed<PortfolioTemplateMode>(() => {
  return props.templateMode ?? templateDefinition.value.defaultMode
})

const resolvedTemplateComponent = computed(() => {
  return templateDefinition.value.component
})
</script>

<template>
  <component
    :is="resolvedTemplateComponent"
    v-if="normalizedPortfolio"
    :portfolio="normalizedPortfolio"
    :theme-name="templateDefinition.name"
    :template-preset-id="resolvedTemplatePresetId"
    :template-mode="resolvedTemplateMode"
  />

  <div
    v-else
    class="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300"
  >
    Não foi possível renderizar a prévia do template com os dados recebidos.
  </div>
</template>