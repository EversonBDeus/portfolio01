<script setup lang="ts">
import { computed, ref } from 'vue'
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

// Se passar disso, vale scroll interno no desktop
const SHOULD_SCROLL_MIN = 5

const useDesktopScroll = computed(() => projects.length >= SHOULD_SCROLL_MIN)
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

    <template v-else>
      <!-- Desktop (md+): com scroll interno só quando tiver muitos -->
      <div class="hidden md:block">
        <UScrollArea v-if="useDesktopScroll" class="h-[520px] pr-2">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProjectCard
              v-for="p in projects"
              :key="p.id"
              :item="p"
              @open="openProject"
            />
          </div>
        </UScrollArea>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProjectCard
            v-for="p in projects"
            :key="p.id"
            :item="p"
            @open="openProject"
          />
        </div>
      </div>

      <!-- Mobile: scroll normal -->
      <div class="md:hidden grid grid-cols-1 gap-4">
        <ProjectCard
          v-for="p in projects"
          :key="p.id"
          :item="p"
          @open="openProject"
        />
      </div>
    </template>

    <ProjectSlideover v-model="isOpen" :item="selected" />
  </div>
</template>