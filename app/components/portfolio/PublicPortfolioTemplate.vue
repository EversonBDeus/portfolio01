<script setup lang="ts">
import { computed } from 'vue'
import PublicPortfolioRenderer from '~/components/portfolio/PublicPortfolioRenderer.vue'
import type { PublicPortfolioPayload } from '~/types/public-portfolio'
import type { PortfolioTemplateMode } from '~/types/portfolio-public-view-model'
import { buildPortfolioPublicViewModel } from '~/utils/public-portfolio-view-model'

const props = withDefaults(defineProps<{
  portfolio: PublicPortfolioPayload
  templateMode?: PortfolioTemplateMode
}>(), {
  templateMode: 'dark'
})

const portfolioViewModel = computed(() => {
  return buildPortfolioPublicViewModel(props.portfolio)
})
</script>

<template>
  <PublicPortfolioRenderer
    :portfolio="portfolioViewModel"
    :template-mode="templateMode"
  />
</template>