<script setup lang="ts">
import { usePortfolioData } from '~/composables/usePortfolioData'
import SkillGrid from '~/components/skills/SkillGrid.vue'
import SkillLevelCards from '~/components/skills/SkillLevelCards.vue'

const props = defineProps<{ revealTick: number }>()

const { data } = usePortfolioData()
const skills = data.skills
</script>

<template>
  <div class="pt-4 space-y-8">
    <div class="text-left">
      <h2 class="text-lg font-semibold">Habilidades</h2>
      <p class="text-sm text-muted">
        Tecnologias e ferramentas que uso no dia a dia.
      </p>
    </div>

    <SkillGrid :items="skills" :reveal-tick="props.revealTick" />

    <USeparator type="dashed" class="h-px" />

    <div class="text-left space-y-1">
      <h3 class="text-base font-semibold">Níveis</h3>
      <p class="text-sm text-muted">
        Visão geral das tecnologias por nível.
      </p>
    </div>

    <!-- ✅ SkillLevelCards exige revealTick -->
    <SkillLevelCards :items="skills" :reveal-tick="props.revealTick" />
  </div>
</template>