<script setup lang="ts">
import { projects } from '~/data/projects'
import { toPublicPath } from '~/utils/format'

const route = useRoute()
const projectKey = computed(() => String(route.params.slug || '').trim().toLowerCase())
const project = computed(() => {
  if (!projectKey.value) {
    return null
  }

  return projects.find((p) => {
    return p.slug.toLowerCase() === projectKey.value || p.id.toLowerCase() === projectKey.value
  }) || null
})

useHead(() => ({
  title: project.value ? `${project.value.title} | Screenshots` : 'Projeto | Screenshots'
}))

const toast = useToast()
const isLink = (u?: string) => !!u && u.startsWith('http')

// ✅ Só usa o layout “docs 3D” se tiver bastante imagens
const useFancyMarquee = computed(() => (project.value?.screenshots?.length || 0) >= 8)

const shots = computed(() => (project.value?.screenshots || []).map(toPublicPath))
const col1 = computed(() => shots.value.slice(0, 4))
const col2 = computed(() => shots.value.slice(4, 8))
const col3 = computed(() => shots.value.slice(8, 12))

function openShot(src: string) {
  toast.add({
    title: 'Abrindo screenshot',
    description: 'Abrindo em uma nova guia.',
    icon: 'i-lucide-external-link'
  })
  window.open(src, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="pt-20 px-4">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold">
            {{ project?.title || 'Projeto não encontrado' }}
          </h1>
          <p v-if="project" class="text-sm text-muted">
            Screenshots do projeto (rolagem infinita)
          </p>
          <p v-if="project && shots.length" class="text-xs text-muted mt-1">
            Dica: clique em uma imagem para abrir em tamanho real.
          </p>
        </div>

        <UButton icon="i-lucide-arrow-left" variant="soft" to="/" aria-label="Voltar">
          Voltar
        </UButton>
      </div>

      <!-- Descrição + Links -->
      <UCard v-if="project" :ui="{ body: 'p-4 space-y-3' }">
        <p class="text-sm text-toned">
          {{ project.description }}
        </p>

        <div class="flex gap-3 flex-wrap">
          <UButton
            v-if="isLink(project.repoUrl)"
            icon="i-lucide-github"
            variant="soft"
            :to="project.repoUrl"
            target="_blank"
          >
            GitHub
          </UButton>

          <UButton
            v-if="isLink(project.demoUrl)"
            icon="i-lucide-external-link"
            variant="soft"
            :to="project.demoUrl"
            target="_blank"
          >
            Hospedagem
          </UButton>
        </div>
      </UCard>

      <!-- Estados vazios -->
      <UEmpty
        v-if="!project"
        icon="i-lucide-triangle-alert"
        title="Projeto não encontrado"
        description="Verifique o slug e os dados em data/projects.ts."
      />

      <UEmpty
        v-else-if="shots.length === 0"
        icon="i-lucide-images"
        title="Sem screenshots"
        description="Adicione imagens em public/projects/<slug>/ e liste em data/projects.ts."
      />

      <!-- ✅ Layout simples (poucas imagens): centralizado, sem cortar -->
      <div
        v-else-if="!useFancyMarquee"
        class="rounded-xl border border-default overflow-hidden bg-muted p-4"
      >
        <UMarquee pause-on-hover :overlay="false">
          <div class="flex items-center gap-4 pr-4">
            <UCard
              v-for="(src, i) in shots"
              :key="src + i"
              class="w-[320px] sm:w-[460px]"
              :ui="{ body: 'p-2' }"
            >
              <button type="button" class="block w-full" @click="openShot(src)">
                <img
                  :src="src"
                  :alt="`Screenshot ${i + 1}`"
                  class="aspect-video border border-default rounded-lg bg-white object-contain cursor-zoom-in"
                />
              </button>
            </UCard>
          </div>
        </UMarquee>

        <UMarquee pause-on-hover reverse :overlay="false" class="mt-4">
          <div class="flex items-center gap-4 pr-4">
            <UCard
              v-for="(src, i) in shots"
              :key="src + 'r' + i"
              class="w-[260px] sm:w-[400px]"
              :ui="{ body: 'p-2' }"
            >
              <button type="button" class="block w-full" @click="openShot(src)">
                <img
                  :src="src"
                  :alt="`Screenshot alt ${i + 1}`"
                  class="aspect-video border border-default rounded-lg bg-white object-contain cursor-zoom-in"
                />
              </button>
            </UCard>
          </div>
        </UMarquee>
      </div>

      <!-- ✅ Layout “docs 3D” (8+ imagens): estilo documentação -->
      <div
        v-else
        class="relative w-full h-[420px] bg-muted overflow-hidden rounded-xl border border-default"
      >
        <UMarquee
          v-if="col1.length"
          reverse
          orientation="vertical"
          :overlay="false"
          :ui="{
            root: '[--duration:40s] absolute w-[460px] left-[40px] -top-[260px] h-[940px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30'
          }"
        >
          <button
            v-for="(src, i) in col1"
            :key="src + i"
            type="button"
            class="block"
            @click="openShot(src)"
          >
            <img
              :src="src"
              width="460"
              height="258"
              :alt="`Screenshot ${i + 1}`"
              class="aspect-video border border-default rounded-lg bg-white object-contain cursor-zoom-in"
            />
          </button>
        </UMarquee>

        <UMarquee
          v-if="col2.length"
          orientation="vertical"
          :overlay="false"
          :ui="{
            root: '[--duration:40s] absolute w-[460px] -top-[360px] left-[520px] h-[1160px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30'
          }"
        >
          <button
            v-for="(src, i) in col2"
            :key="src + i"
            type="button"
            class="block"
            @click="openShot(src)"
          >
            <img
              :src="src"
              width="460"
              height="258"
              :alt="`Screenshot ${i + 1}`"
              class="aspect-video border border-default rounded-lg bg-white object-contain cursor-zoom-in"
            />
          </button>
        </UMarquee>

        <UMarquee
          v-if="col3.length"
          reverse
          orientation="vertical"
          :overlay="false"
          :ui="{
            root: 'hidden md:flex [--duration:40s] absolute w-[460px] -top-[260px] left-[1000px] h-[1060px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30'
          }"
        >
          <button
            v-for="(src, i) in col3"
            :key="src + i"
            type="button"
            class="block"
            @click="openShot(src)"
          >
            <img
              :src="src"
              width="460"
              height="258"
              :alt="`Screenshot ${i + 1}`"
              class="aspect-video border border-default rounded-lg bg-white object-contain cursor-zoom-in"
            />
          </button>
        </UMarquee>
      </div>
    </div>
  </div>
</template>