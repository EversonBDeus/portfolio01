<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import {
  getPortfolioTemplateRegistryItem,
  resolvePortfolioTemplatePresetId
} from '~/data/portfolio-template-registry'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode
} from '~/types/portfolio-public-view-model'

const props = withDefaults(defineProps<{
  portfolio: PortfolioPublicViewModel
  templateId?: string | null
  templatePresetId?: string | null
  templateMode?: PortfolioTemplateMode
}>(), {
  templateId: null,
  templatePresetId: null,
  templateMode: 'dark'
})

const resolvedTemplateDefinition = computed(() => {
  return getPortfolioTemplateRegistryItem(
    props.templateId ?? props.portfolio.settings.templateId
  )
})

const resolvedTemplatePresetId = computed(() => {
  const presetIdFromProps = props.templatePresetId
  const presetIdFromPortfolio = props.portfolio.settings.templatePresetId ?? null
  const fallbackPresetId = resolvedTemplateDefinition.value.defaultPresetId

  return resolvePortfolioTemplatePresetId(
    presetIdFromProps ?? presetIdFromPortfolio,
    fallbackPresetId
  )
})

const resolvedTemplateComponent = computed(() => {
  return defineAsyncComponent({
    loader: resolvedTemplateDefinition.value.loader,
    suspensible: false
  })
})
</script>

<template>
  <component
    :is="resolvedTemplateComponent"
    :portfolio="portfolio"
    :theme-name="resolvedTemplateDefinition.name"
    :template-preset-id="resolvedTemplatePresetId"
    :template-mode="templateMode"
  />
</template>