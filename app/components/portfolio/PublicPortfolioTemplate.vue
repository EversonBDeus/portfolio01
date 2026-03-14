<script setup lang="ts">
import { computed } from 'vue'
import PublicPortfolioRenderer from '~/components/portfolio/PublicPortfolioRenderer.vue'
import type { PublicPortfolioPayload } from '~/types/public-portfolio'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode
} from '~/types/portfolio-public-view-model'
import { buildPortfolioPublicViewModel } from '~/utils/public-portfolio-view-model'

const props = withDefaults(defineProps<{
  portfolio: PublicPortfolioPayload
  templateId?: string | null
  templatePresetId?: string | null
  templateMode?: PortfolioTemplateMode | null
}>(), {
  templateId: null,
  templatePresetId: null,
  templateMode: null
})

const portfolioViewModel = computed<PortfolioPublicViewModel>(() => {
  return buildPortfolioPublicViewModel(props.portfolio)
})
</script>

<template>
  <PublicPortfolioRenderer
    :portfolio="portfolioViewModel"
    :template-id="templateId"
    :template-preset-id="templatePresetId"
    :template-mode="templateMode"
  />
</template>