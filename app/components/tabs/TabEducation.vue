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
      <p class="text-sm text-muted">Graduação, cursos e formações.</p>
    </div>

    <UEmpty
      v-if="education.length === 0"
      icon="i-lucide-graduation-cap"
      title="Sem formações"
      description="Adicione itens em app/data/education.ts."
    />

    <div v-else class="space-y-4">
      <!-- Resumo em timeline -->
      <UTimeline :items="timelineItems" />

      <!-- Detalhes em cards compactos -->
      <div class="grid grid-cols-1 gap-3">
        <UCard v-for="e in education" :key="e.id" class="surface-panel">
          <div class="space-y-2 text-left">
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <div class="space-y-0.5">
                <div class="font-semibold">{{ e.title }}</div>
                <div class="text-sm text-muted">{{ e.institution }}</div>
              </div>

              <div class="text-xs text-muted">
                {{ formatYm(e.startDate) }} → {{ e.endDate && e.endDate.trim() ? formatYm(e.endDate) : 'em andamento' }}
              </div>
            </div>

            <p v-if="e.description" class="text-sm">
              {{ e.description }}
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>