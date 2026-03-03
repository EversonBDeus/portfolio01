<script setup lang="ts">
import { ref } from 'vue'

// 1. Controlo do Menu Mobile
const isOpen = ref(false)

// 2. Links de Navegação da Sidebar
// Usamos o formato do Nuxt UI (UVerticalNavigation)
const links = [
  {
    label: 'Meus Portfólios',
    icon: 'i-heroicons-window',
    to: '/dashboard/layouts'
  },
  {
    label: 'Loja de Temas',
    icon: 'i-heroicons-shopping-bag',
    to: '/dashboard/loja'
  },
  {
    label: 'Estatísticas',
    icon: 'i-heroicons-chart-bar',
    to: '/dashboard/analytics'
  },
  {
    label: 'O Meu Perfil',
    icon: 'i-heroicons-user',
    to: '/dashboard/perfil'
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#f9f9f9] dark:bg-neutral-950 flex">
    
    <aside class="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 fixed inset-y-0 z-50">
      <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <UIcon name="i-heroicons-sparkles" class="text-primary-500 text-2xl mr-2" />
        <span class="font-bold text-lg">MeuSaaS</span>
      </div>
      
      <div class="flex-1 overflow-y-auto py-4 px-3">
        <UVerticalNavigation :links="links" />
      </div>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left-on-rectangle" block label="Terminar Sessão" to="/" />
      </div>
    </aside>

    <main class="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
      
      <header class="md:hidden h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-40">
        <div class="flex items-center">
          <UIcon name="i-heroicons-sparkles" class="text-primary-500 text-xl mr-2" />
          <span class="font-bold">MeuSaaS</span>
        </div>
        <UButton icon="i-heroicons-bars-3" variant="ghost" color="gray" @click="isOpen = true" />
      </header>

      <div class="p-4 md:p-8 flex-1">
        <slot /> </div>
    </main>

    <USlideover v-model="isOpen" side="left">
      <div class="flex flex-col h-full bg-white dark:bg-neutral-900">
        <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <span class="font-bold text-lg">Menu Principal</span>
          <UButton icon="i-heroicons-x-mark" variant="ghost" color="gray" @click="isOpen = false" />
        </div>
        <div class="p-4 flex-1">
          <UVerticalNavigation :links="links" @click="isOpen = false" />
        </div>
      </div>
    </USlideover>

  </div>
</template>