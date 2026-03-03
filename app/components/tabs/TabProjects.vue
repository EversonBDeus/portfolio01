<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { projects } from '~/data/projects'
import type { Project } from '~/data/projects'

import ProjectCard from '../projects/ProjectCard.vue'
import ProjectSlideover from '../projects/ProjectSlideover.vue'

const selected = ref<Project | null>(null)
const isOpen = ref(false)

function openProject(item: Project) {
  selected.value = item
  isOpen.value = true
}

// Desktop ScrollArea root (viewport interno)
const scrollWrap = ref<HTMLElement | null>(null)
const scrollRoot = ref<Element | null>(null)
const desktopReady = ref(false)

onMounted(() => {
  const host = scrollWrap.value
  if (!host) {
    desktopReady.value = true
    return
  }

  // tenta achar viewport interno (Nuxt UI / Radix)
  scrollRoot.value =
    host.querySelector('[data-slot="viewport"]') ||
    host.querySelector('[data-radix-scroll-area-viewport]') ||
    null

  desktopReady.value = true
})
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
      icon="i-lucide-folder-x"
      title="Nenhum projeto ainda"
      description="Adicione projetos em data/projects.ts."
    />

    <div v-else>
      <!-- Desktop: Scroll Area -->
      <div class="hidden lg:block" ref="scrollWrap">
        <UScrollArea class="h-[520px] pr-2">
          <!-- skeleton rápido até capturar o viewport -->
          <div v-if="!desktopReady" class="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <USkeleton v-for="n in 6" :key="n" class="h-64 rounded-xl" />
          </div>

          <div v-else class="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <div
              v-for="(p, idx) in projects"
              :key="p.id"
              v-reveal="{ root: scrollRoot, delay: idx * 70 }"
            >
              <ProjectCard :item="p" @open="openProject" />
            </div>
          </div>
        </UScrollArea>
      </div>

      <!-- Mobile: rolagem normal da página -->
      <div class="lg:hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="(p, idx) in projects"
            :key="p.id"
            v-reveal="{ delay: idx * 70 }"
          >
            <ProjectCard :item="p" @open="openProject" />
          </div>
        </div>
      </div>
    </div>

    <ProjectSlideover v-model="isOpen" :item="selected" />
  </div>
</template>