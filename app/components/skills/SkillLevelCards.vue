<script setup lang="ts">
import type { Skill, SkillLevel } from '~/data/skills'

const props = defineProps<{ items: Skill[]; revealTick: number }>()

const labelByLevel: Record<SkillLevel, string> = {
  basic: 'Básico',
  intermediate: 'Intermediário',
  advanced: 'Avançado'
}

const iconByLevel: Record<SkillLevel, string> = {
  basic: 'i-lucide-leaf',
  intermediate: 'i-lucide-trending-up',
  advanced: 'i-lucide-badge-check'
}

const colorByLevel: Record<SkillLevel, 'primary' | 'secondary' | 'tertiary'> = {
  basic: 'tertiary',
  intermediate: 'secondary',
  advanced: 'primary'
}

const levels: SkillLevel[] = ['basic', 'intermediate', 'advanced']

const skillsByLevel = computed(() => {
  const map: Record<SkillLevel, Skill[]> = { basic: [], intermediate: [], advanced: [] }
  for (const s of props.items) map[s.level].push(s)
  return map
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
    <div
      v-for="(lvl, idx) in levels"
      :key="lvl"
      v-reveal="{ tick: revealTick, delay: idx * 80 }"
    >
      <UCard :ui="{ body: 'p-4 space-y-3' }">
        <div class="flex items-center gap-2">
          <UIcon :name="iconByLevel[lvl]" class="text-lg" />
          <h3 class="font-semibold">{{ labelByLevel[lvl] }}</h3>

          <UBadge :color="colorByLevel[lvl]" variant="soft" class="ml-auto">
            {{ skillsByLevel[lvl].length }}
          </UBadge>
        </div>

        <div v-if="skillsByLevel[lvl].length" class="flex flex-wrap gap-2">
          <UBadge
            v-for="s in skillsByLevel[lvl]"
            :key="s.name"
            :color="colorByLevel[lvl]"
            variant="subtle"
          >
            {{ s.name }}
          </UBadge>
        </div>

        <UEmpty
          v-else
          icon="i-lucide-circle-dashed"
          title="Sem itens"
          description="Adicione skills para este nível."
        />
      </UCard>
    </div>
  </div>
</template>