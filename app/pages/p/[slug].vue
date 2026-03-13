<script setup lang="ts">
import { computed } from 'vue'
import PublicPortfolioTemplate from '~/components/portfolio/PublicPortfolioTemplate.vue'
import type { PublicPortfolioPayload } from '~/types/public-portfolio'

const route = useRoute()

const slug = computed(() => String(route.params.slug ?? '').trim())

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
  />

  <div v-else class="mx-auto max-w-3xl px-4 py-16">
    <UAlert
      icon="i-lucide-globe-lock"
      title="Portfólio não disponível"
      :description="errorMessage"
      color="warning"
      variant="outline"
    />
  </div>
</template>