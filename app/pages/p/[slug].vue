<script setup lang="ts">
import { computed } from 'vue'
import type { LocationQueryValue } from 'vue-router'
import PublicPortfolioTemplate from '~/components/portfolio/PublicPortfolioTemplate.vue'
import type { PublicPortfolioPayload } from '~/types/public-portfolio'
import type { PortfolioTemplateMode } from '~/types/portfolio-public-view-model'

definePageMeta({
  layout: 'public-portfolio'
})

const route = useRoute()

function normalizeQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined
) {
  const candidate = Array.isArray(value) ? value[0] : value
  const normalizedValue = String(candidate ?? '').trim()

  return normalizedValue || null
}

const slug = computed(() => String(route.params.slug ?? '').trim())

const templateIdOverride = computed(() => {
  return normalizeQueryValue(route.query.template)
})

const templatePresetIdOverride = computed(() => {
  return normalizeQueryValue(route.query.preset)
})

const templateModeOverride = computed<PortfolioTemplateMode | null>(() => {
  const mode = normalizeQueryValue(route.query.mode)?.toLowerCase()

  if (mode === 'light') {
    return 'light'
  }

  if (mode === 'dark') {
    return 'dark'
  }

  return null
})

const {
  data: portfolio,
  error
} = await useFetch<PublicPortfolioPayload>(() => `/api/public-portfolio/${slug.value}`, {
  key: () => `public-portfolio-${slug.value}`
})

const errorMessage = computed(() => {
  const data = error.value?.data as { statusMessage?: string } | undefined

  return data?.statusMessage ?? 'Este portfólio não está disponível agora.'
})

const seoTitle = computed(() => {
  return portfolio.value ? `${portfolio.value.publicName} | Portfólio` : 'Portfólio'
})

const seoDescription = computed(() => {
  return portfolio.value?.headline || 'Portfólio público'
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription
})
</script>

<template>
  <PublicPortfolioTemplate
    v-if="portfolio"
    :portfolio="portfolio"
    :template-id="templateIdOverride"
    :template-preset-id="templatePresetIdOverride"
    :template-mode="templateModeOverride"
  />

  <div v-else class="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-16">
    <UAlert
      icon="i-lucide-globe-lock"
      title="Portfólio não disponível"
      :description="errorMessage"
      color="warning"
      variant="outline"
      class="w-full"
    />
  </div>
</template>