<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioData } from '~/composables/usePortfolioData'
import type { Project } from '~/data/projects'

const route = useRoute()
const { data } = usePortfolioData()

const key = computed(() => String(route.params.id || '').trim().toLowerCase())

const project = computed<Project | undefined>(() => {
  if (!key.value) return undefined
  return data.projects.find((p) => p.id.toLowerCase() === key.value || p.slug.toLowerCase() === key.value)
})

const screenshots = computed(() => project.value?.screenshots ?? [])
</script>

<template>
  <section class="min-h-screen pt-24 px-4">
    <div class="w-full max-w-5xl mx-auto space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-bold">
            {{ project?.title || 'Projeto' }}
          </h1>
          <p v-if="project" class="text-sm text-muted">
            {{ project.shortDescription }}
          </p>
          <p v-else class="text-sm text-muted">
            Screenshots do projeto
          </p>
        </div>

        <UButton variant="soft" icon="i-lucide-arrow-left" to="/">
          Voltar
        </UButton>
      </div>

      <UEmpty
        v-if="!project"
        icon="i-lucide-folder-x"
        title="Projeto não encontrado"
        description="Verifique o link (id/slug) do projeto."
      />

      <div v-else class="space-y-4">
        <UCard class="surface-panel">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <img
              :src="project.coverImage"
              :alt="project.title"
              class="w-full h-56 object-cover rounded-xl border border-muted/40"
              loading="lazy"
            />

            <div class="space-y-3">
              <p class="text-sm">
                {{ project.description }}
              </p>

              <div class="flex flex-wrap gap-2">
                <UBadge v-for="t in project.stack" :key="t" variant="soft">
                  {{ t }}
                </UBadge>
              </div>

              <div class="flex items-center gap-2 flex-wrap pt-1">
                <UButton
                  v-if="project.repoUrl"
                  :to="project.repoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="i-lucide-github"
                  variant="soft"
                >
                  Repositório
                </UButton>

                <UButton
                  v-if="project.demoUrl"
                  :to="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="i-lucide-external-link"
                  variant="soft"
                >
                  Demo
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <UEmpty
          v-if="screenshots.length === 0"
          icon="i-lucide-images"
          title="Sem screenshots"
          description="Este projeto ainda não possui imagens cadastradas."
        />

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="(src, idx) in screenshots"
            :key="idx"
            :href="src"
            target="_blank"
            rel="noopener noreferrer"
            class="block"
          >
            <UCard class="surface-panel">
              <img
                :src="src"
                :alt="`Screenshot ${idx + 1}`"
                class="w-full h-48 object-cover rounded-lg"
                loading="lazy"
              />
            </UCard>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>