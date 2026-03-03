<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import { usePortfolioSections } from '~/composables/usePortfolioSections'
import type { PortfolioSectionId } from '~/types/portfolio'

import TabProjects from '~/components/tabs/TabProjects.vue'
import TabSkills from '~/components/tabs/TabSkills.vue'
import TabCertificates from '~/components/tabs/TabCertificates.vue'
import TabExperience from '~/components/tabs/TabExperience.vue'
import TabEducation from '~/components/tabs/TabEducation.vue'

const props = withDefaults(
  defineProps<{
    /**
     * false (padrão) = público: some seção vazia quando hideWhenEmpty=true
     * true = editor (futuro): mostra seção mesmo vazia + UEmpty orientando
     */
    showEmpty?: boolean
  }>(),
  { showEmpty: false }
)

const { visibleSections, visibleSet } = usePortfolioSections({ showEmpty: props.showEmpty })

const componentById: Record<PortfolioSectionId, any> = {
  projects: TabProjects,
  skills: TabSkills,
  certificates: TabCertificates,
  experience: TabExperience,
  education: TabEducation
}

type TabItem = {
  label: string
  icon: string
  value: PortfolioSectionId
}

const items = computed<TabItem[]>(() =>
  visibleSections.value.map((s) => ({
    label: s.label,
    icon: s.icon,
    value: s.id
  }))
)

const active = ref<PortfolioSectionId>('projects')

const tick = reactive<Record<PortfolioSectionId, number>>({
  projects: 0,
  skills: 0,
  certificates: 0,
  experience: 0,
  education: 0
})

function isTabValue(v: unknown): v is PortfolioSectionId {
  return (
    v === 'projects' ||
    v === 'skills' ||
    v === 'certificates' ||
    v === 'experience' ||
    v === 'education'
  )
}

function onTabChange(v: PortfolioSectionId) {
  active.value = v
  tick[v]++
}

function onTabsUpdate(v: string | number) {
  if (isTabValue(v)) onTabChange(v)
}

function isVisible(id: PortfolioSectionId) {
  return visibleSet.value.has(id)
}

function tabProps(id: PortfolioSectionId) {
  if (id === 'skills') return { revealTick: tick.skills }
  return {}
}

// garante aba válida se uma seção sumir por estar vazia
watchEffect(() => {
  const first = items.value[0]?.value
  if (!first) return
  if (!isVisible(active.value)) active.value = first
})
</script>

<template>
  <div class="mt-6">
    <UEmpty
      v-if="items.length === 0"
      icon="i-lucide-layout-template"
      title="Nenhuma seção disponível"
      description="Ative seções em app/data/sections.ts (ou adicione conteúdo)."
    />

    <UTabs
      v-else
      :items="items"
      :model-value="active"
      class="w-full"
      @update:model-value="onTabsUpdate"
    >
      <!-- Melhor para conteúdo dinâmico -->
      <template #content="{ item }">
        <component
          :is="componentById[item.value as PortfolioSectionId]"
          v-bind="tabProps(item.value as PortfolioSectionId)"
          :key="`${item.value}-${tick[item.value as PortfolioSectionId]}`"
        />
      </template>
    </UTabs>
  </div>
</template>