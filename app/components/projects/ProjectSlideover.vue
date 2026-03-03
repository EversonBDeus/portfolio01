<script setup lang="ts">
import type { Project, ProjectRole } from '~/data/projects'
import { toPublicPath } from '~/utils/format'

const props = defineProps<{
  modelValue: boolean
  item: Project | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const toast = useToast()

const roleLabel: Record<ProjectRole, string> = {
  frontend: 'Front-end',
  backend: 'Back-end',
  fullstack: 'Full Stack'
}

const screenshotsPath = computed(() => (props.item ? `/projects/${props.item.slug}` : '/'))
const coverSrc = computed(() => (props.item ? toPublicPath(props.item.coverImage) : ''))

function notifyMissing(label: string, e?: Event) {
  e?.preventDefault?.()
  toast.add({
    title: 'Link não configurado',
    description: `Adicione o link de ${label} em data/projects.ts`,
    icon: 'i-lucide-link-2-off'
  })
}

function onScreenshotsClick(e: Event) {
  if (!props.item?.screenshots?.length) {
    e.preventDefault()
    toast.add({
      title: 'Sem screenshots',
      description: 'Adicione imagens em public/projects/<slug>/ e liste em data/projects.ts.',
      icon: 'i-lucide-images'
    })
    return
  }

  open.value = false
  toast.add({
    title: 'Screenshots',
    description: 'Abrindo a página de screenshots.',
    icon: 'i-lucide-images'
  })
}

function onRepoClick(e: Event) {
  if (!props.item?.repoUrl) notifyMissing('GitHub', e)
}

function onDemoClick(e: Event) {
  if (!props.item?.demoUrl) notifyMissing('Hospedagem', e)
}
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    inset
    :title="item?.title || 'Projeto'"
    :description="item ? roleLabel[item.role] : undefined"
  >
    <template #body>
      <div class="space-y-5">
        <p class="text-sm text-toned">
          {{ item?.description }}
        </p>

        <div class="flex flex-wrap gap-2">
          <UBadge v-for="t in item?.stack || []" :key="t" color="neutral" variant="soft">
            {{ t }}
          </UBadge>
        </div>

        <div class="flex gap-3 flex-wrap">
          <UButton icon="i-lucide-images" variant="soft" :to="screenshotsPath" @click="onScreenshotsClick">
            Ver screenshots
          </UButton>

          <UButton icon="i-lucide-github" variant="soft" :to="item?.repoUrl || '#'" target="_blank" @click="onRepoClick">
            GitHub
          </UButton>

          <UButton icon="i-lucide-external-link" variant="soft" :to="item?.demoUrl || '#'" target="_blank" @click="onDemoClick">
            Hospedagem
          </UButton>
        </div>

        <UCard :ui="{ body: 'p-3' }">
          <div class="rounded-xl overflow-hidden border border-default">
            <img v-if="item" :src="coverSrc" :alt="item.title" class="w-full object-cover" />
            <USkeleton v-else class="h-44 w-full" />
          </div>
        </UCard>

        <UCard v-if="item?.details?.trim()" :ui="{ body: 'p-3 space-y-2' }">
          <p class="font-semibold">Detalhes</p>

          <div class="hidden lg:block">
            <UScrollArea class="h-40 pr-2">
              <p class="text-sm text-muted whitespace-pre-line">
                {{ item.details }}
              </p>
            </UScrollArea>
          </div>

          <div class="lg:hidden">
            <p class="text-sm text-muted whitespace-pre-line">
              {{ item.details }}
            </p>
          </div>
        </UCard>
      </div>
    </template>
  </USlideover>
</template>