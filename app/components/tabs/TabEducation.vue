<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioData } from '~/composables/usePortfolioData'
import { formatYm } from '~/utils/format'

const { data } = usePortfolioData()
const education = data.education

const endLabel = (end?: string) => (end && end.trim() ? formatYm(end) : 'em andamento')

const timelineItems = computed(() =>
  education.map((e) => ({
    title: e.title,
    description: e.institution,
    date: `${formatYm(e.startDate)} → ${endLabel(e.endDate)}`,
    icon: 'i-lucide-graduation-cap'
  }))
)
</script>

<template>
  <div class="pt-4 space-y-4">
    <div class="text-left">
      <h2 class="text-lg font-semibold">Formação</h2>
      <p class="text-sm text-muted">Graduação, cursos e formaações.</p>
    </div>

    <UEmpty
      v-if="education.length === 0"
      icon="i-lucide-graduation-cap"
      title="Sem formações"
      description="Adicione itens em app/data/education.ts."
    />

    <div v-else class="space-y-4">
      <UTimeline :items="timelineItems" />

      <!-- detalhes (sem repetir título/data) -->
      <div class="grid grid-cols-1 gap-3">
        <UCard v-for="e in education" :key="e.id" class="surface-panel">
          <p v-if="e.description" class="text-sm">
            {{ e.description }}
          </p>
        </UCard>
      </div>
    </div>
  </div>
</template>