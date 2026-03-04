<script setup lang="ts">
import { ref } from 'vue'
import { usePortfolioData } from '~/composables/usePortfolioData'
import type { Project } from '~/data/projects'

import ProjectCard from '~/components/projects/ProjectCard.vue'
import ProjectSlideover from '~/components/projects/ProjectSlideover.vue'

const { data } = usePortfolioData()
const projects = data.projects

const isOpen = ref(false)
const selected = ref<Project | null>(null)

function openProject(item: Project) {
  selected.value = item
  isOpen.value = true
}
</script>

<template>
  <div class="pt-4 space-y-4">
    <div class="text-left">
      <h2 class="text-lg font-semibold">Projetos</h2>
      <p class="text-sm text-muted">
        Clique no card para detalhes. Clique na imagem para ver screenshots.
      </p>
    </div>

    <UEmpty
      v-if="projects.length === 0"
      icon="i-lucide-folder-open"
      title="Nenhum projeto"
      description="Ainda não há projetos cadastrados no portfólio."
    />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProjectCard
        v-for="p in projects"
        :key="p.id"
        :item="p"
        @open="openProject"
      />
    </div>

    <ProjectSlideover v-model="isOpen" :item="selected" />
  </div>
</template>