<script setup lang="ts">
import type { Project, ProjectRole } from '~/data/projects'

const props = defineProps<{ item: Project }>()
const emit = defineEmits<{ (e: 'open', item: Project): void }>()

const roleLabel: Record<ProjectRole, string> = {
  frontend: 'Front-end',
  backend: 'Back-end',
  fullstack: 'Full Stack'
}

const roleColor: Record<ProjectRole, 'primary' | 'secondary' | 'tertiary'> = {
  frontend: 'primary',
  backend: 'secondary',
  fullstack: 'tertiary'
}

function openScreenshots(e: MouseEvent | KeyboardEvent) {
  e.stopPropagation()
  navigateTo(`/projects/${props.item.slug}`)
}
</script>

<template>
  <UCard
    class="group cursor-pointer"
    :ui="{ body: 'p-3 space-y-3' }"
    @click="emit('open', item)"
  >
    <div
      class="relative rounded-xl overflow-hidden border border-default focus:outline-none"
      role="link"
      tabindex="0"
      @click="openScreenshots"
      @keydown.enter="openScreenshots"
      @keydown.space.prevent="openScreenshots"
    >
      <img :src="item.coverImage" :alt="item.title" class="h-44 w-full object-cover" />

      <div class="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

      <UBadge class="absolute top-2 left-2 z-10" :color="roleColor[item.role]" variant="solid" size="xs">
        {{ roleLabel[item.role] }}
      </UBadge>

      <UBadge
        v-if="item.stack?.length"
        class="absolute top-2 right-2 z-10 bg-black/40 text-white border border-white/10"
        color="neutral"
        variant="solid"
        size="xs"
      >
        {{ item.stack.length }} techs
      </UBadge>

      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3
               opacity-0 transition-opacity duration-200
               group-hover:opacity-100"
      >
        <div class="flex flex-wrap gap-1.5">
          <UBadge
            v-for="t in (item.stack || []).slice(0, 4)"
            :key="t"
            color="neutral"
            variant="solid"
            size="xs"
            class="bg-black/45 text-white border border-white/10"
          >
            {{ t }}
          </UBadge>

          <UBadge
            v-if="(item.stack || []).length > 4"
            color="neutral"
            variant="solid"
            size="xs"
            class="bg-black/45 text-white border border-white/10"
          >
            +{{ (item.stack || []).length - 4 }}
          </UBadge>
        </div>

        <p class="mt-2 text-[11px] text-white/80">
          Clique na imagem para screenshots • clique no card para detalhes
        </p>
      </div>

      <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <UBadge color="neutral" variant="solid" size="xs" class="bg-black/50 text-white border border-white/10">
          Ver screenshots
        </UBadge>
      </div>
    </div>

    <div class="text-left">
      <p class="text-sm font-semibold line-clamp-1">
        {{ item.title }}
      </p>
      <p class="text-xs text-muted line-clamp-2">
        {{ item.shortDescription }}
      </p>
    </div>
  </UCard>
</template>