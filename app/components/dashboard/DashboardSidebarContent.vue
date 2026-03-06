<script setup lang="ts">
import DashboardNav from '~/components/dashboard/DashboardNav.vue'
import DashboardUserMenu from '~/components/dashboard/DashboardUserMenu.vue'

withDefaults(
  defineProps<{
    mobile?: boolean
  }>(),
  {
    mobile: false
  }
)

const emit = defineEmits<{
  close: []
  navigate: []
}>()
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex items-center justify-between gap-2 px-4 py-3">
      <div class="flex min-w-0 items-center gap-2">
        <UIcon name="i-lucide-sparkles" class="size-5 shrink-0 text-primary" />
        <span class="truncate font-semibold">FolioForge</span>
      </div>

      <UButton
        v-if="mobile"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        aria-label="Fechar menu"
        @click="emit('close')"
      />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      <DashboardNav @navigate="emit('navigate')" />
    </div>

    <DashboardUserMenu />
  </div>
</template>