<script setup lang="ts">
import type { Skill, SkillLevel } from '~/data/skills'

defineProps<{ items: Skill[]; revealTick: number }>()

const labelByLevel: Record<SkillLevel, string> = {
  basic: 'Básico',
  intermediate: 'Intermediário',
  advanced: 'Avançado'
}

const colorByLevel: Record<SkillLevel, 'primary' | 'secondary' | 'tertiary'> = {
  basic: 'tertiary',
  intermediate: 'secondary',
  advanced: 'primary'
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    <div
      v-for="(skill, idx) in items"
      :key="skill.name"
      v-reveal="{ tick: revealTick, delay: idx * 60 }"
    >
      <UCard class="text-center" :ui="{ body: 'p-4 flex flex-col items-center gap-2' }">
        <UIcon :name="skill.icon" class="text-3xl" :class="skill.colorClass || ''" />

        <p class="text-sm font-medium leading-tight">
          {{ skill.name }}
        </p>

        <UBadge
          :color="colorByLevel[skill.level]"
          variant="subtle"
          size="xs"
          class="mt-1 font-semibold"
        >
          {{ labelByLevel[skill.level] }}
        </UBadge>
      </UCard>
    </div>
  </div>
</template>