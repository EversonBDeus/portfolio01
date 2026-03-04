<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioData } from '~/composables/usePortfolioData'
import { formatYm } from '~/utils/format'

const { data } = usePortfolioData()
const education = data.education

const timelineItems = computed(() =>
  education.map((e) => ({
    title: `${e.title} — ${e.institution}`,
    date: `${formatYm(e.startDate)} → ${e.endDate ? formatYm(e.endDate) : 'em andamento'}`,
    icon: 'i-lucide-graduation-cap'
  }))
)
</script>

<template>
  <div class="pt-4 space-y-4">
    <div class="text-left">
      <h2 class="text-lg font-semibold">Formação</h2>
      <p class="text-sm text-muted">Cursos, graduação e formações.</p>
    </div>

    <UEmpty
      v-if="education.length === 0"
      icon="i-lucide-graduation-cap"
      title="Sem formações cadastradas"
      description="Adicione itens em app/data/education.ts."
    />

    <div v-else class="space-y-4">
      <UTimeline :items="timelineItems" />

      <div class="grid grid-cols-1 gap-3">
        <UCard v-for="e in education" :key="e.id" class="surface-panel">
          <div class="space-y-1">
            <div class="font-semibold">{{ e.title }}</div>
            <div class="text-sm text-muted">{{ e.institution }}</div>
            <div class="text-xs text-muted">
              {{ formatYm(e.startDate) }} → {{ e.endDate ? formatYm(e.endDate) : 'em andamento' }}
            </div>
            <p v-if="e.description" class="text-sm mt-2">{{ e.description }}</p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>