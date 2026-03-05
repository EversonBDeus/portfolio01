
<script setup lang="ts">
const main = [
  { label: 'Início', to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: 'Perfil', to: '/dashboard/perfil', icon: 'i-lucide-user' },
  { label: 'Templates', to: '/dashboard/templates', icon: 'i-lucide-layout-template' }
]

const billing = [
  { label: 'Plans', to: '/dashboard/plans', icon: 'i-lucide-credit-card' },
  { label: 'Domain', to: '/dashboard/domain', icon: 'i-lucide-globe' }
]
</script>

<template>
  <div class="p-2 space-y-3">
    <UNavigationMenu
      orientation="vertical"
      :items="main"
      class="text-default"
    />

    <USeparator />

    <UNavigationMenu
      orientation="vertical"
      :items="billing"
      class="text-default"
    />
  </div>
</template>