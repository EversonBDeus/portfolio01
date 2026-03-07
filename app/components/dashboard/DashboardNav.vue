<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const emit = defineEmits<{
  navigate: []
}>()

function onNavigate() {
  emit('navigate')
}

const main = computed<NavigationMenuItem[]>(() => [
  { label: 'Início', to: '/dashboard', icon: 'i-lucide-layout-dashboard', onSelect: onNavigate },
  { label: 'Perfil', to: '/dashboard/perfil', icon: 'i-lucide-user', onSelect: onNavigate },
  { label: 'Templates', to: '/dashboard/templates', icon: 'i-lucide-layout-template', onSelect: onNavigate },
  { label: 'Editor', to: '/dashboard/editor', icon: 'i-lucide-sliders-horizontal', onSelect: onNavigate }
])

const billing = computed<NavigationMenuItem[]>(() => [
  { label: 'Plans', to: '/dashboard/plans', icon: 'i-lucide-credit-card', onSelect: onNavigate },
  { label: 'Domain', to: '/dashboard/domain', icon: 'i-lucide-globe', onSelect: onNavigate },
  { label: 'Analytics', to: '/dashboard/analytics', icon: 'i-lucide-bar-chart-3', onSelect: onNavigate }
])
</script>

<template>
  <div class="space-y-3">
    <UNavigationMenu
      orientation="vertical"
      variant="pill"
      :items="main"
      class="w-full"
    />

    <USeparator />

    <UNavigationMenu
      orientation="vertical"
      variant="pill"
      :items="billing"
      class="w-full"
    />
  </div>
</template>