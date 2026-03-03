<script setup lang="ts">
import { computed } from 'vue'
import { experiences } from '~/data/experience'
import { formatYm } from '~/utils/format'

const timelineItems = computed(() =>
  experiences.map((e) => ({
    title: `${e.role} — ${e.company}`,
    date: `${formatYm(e.startDate)} → ${e.endDate ? formatYm(e.endDate) : 'atual'}`,
    icon: 'i-lucide-briefcase-business',
    description: e.location
  }))
)
</script>

<template>
  <div class="pt-4 space-y-4">
    <div class="text-left">
      <h2 class="text-lg font-semibold">Experiência</h2>
      <p class="text-sm text-muted">Histórico profissional (ou atuações).</p>
    </div>

    <UEmpty
      v-if="experiences.length === 0"
      icon="i-lucide-briefcase-business"
      title="Sem experiências cadastradas"
      description="Adicione itens em app/data/experience.ts."
    />

    <div v-else class="space-y-4">
      <UTimeline :items="timelineItems" />

      <div class="grid grid-cols-1 gap-3">
        <UCard v-for="e in experiences" :key="e.id" class="surface-panel">
          <div class="space-y-1">
            <div class="font-semibold">{{ e.role }}</div>
            <div class="text-sm text-muted">
              {{ e.company }}
              <span v-if="e.location"> • {{ e.location }}</span>
            </div>
            <div class="text-xs text-muted">
              {{ formatYm(e.startDate) }} → {{ e.endDate ? formatYm(e.endDate) : 'atual' }}
            </div>

            <p v-if="e.description" class="text-sm pt-2">{{ e.description }}</p>

            <ul v-if="e.highlights?.length" class="text-sm list-disc pl-5 pt-2 space-y-1">
              <li v-for="(h, i) in e.highlights" :key="i">{{ h }}</li>
            </ul>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>