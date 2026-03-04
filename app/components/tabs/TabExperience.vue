<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioData } from '~/composables/usePortfolioData'
import { formatYm } from '~/utils/format'

const { data } = usePortfolioData()
const experiences = data.experiences

const endLabel = (end?: string) => (end && end.trim() ? formatYm(end) : 'atual')

const timelineItems = computed(() =>
  experiences.map((e) => {
    const period = `${formatYm(e.startDate)} → ${endLabel(e.endDate)}`
    const place = `${e.company}${e.location ? ` • ${e.location}` : ''}`
    return {
      title: e.role,
      description: place,
      date: period,
      icon: 'i-lucide-briefcase-business'
    }
  })
)
</script>

<template>
  <div class="pt-4 space-y-4">
    <div class="text-left">
      <h2 class="text-lg font-semibold">Experiência</h2>
      <p class="text-sm text-muted">Histórico profissional e atuações.</p>
    </div>

    <UEmpty
      v-if="experiences.length === 0"
      icon="i-lucide-briefcase-business"
      title="Sem experiências"
      description="Adicione itens em app/data/experience.ts."
    />

    <div v-else class="space-y-4">
      <UTimeline :items="timelineItems" />

      <!-- detalhes (sem repetir título/data) -->
      <div class="grid grid-cols-1 gap-3">
        <UCard v-for="e in experiences" :key="e.id" class="surface-panel">
          <div class="space-y-2">
            <p v-if="e.description" class="text-sm">
              {{ e.description }}
            </p>

            <ul v-if="e.highlights?.length" class="text-sm list-disc pl-4 space-y-1">
              <li v-for="(h, idx) in e.highlights" :key="idx">{{ h }}</li>
            </ul>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>