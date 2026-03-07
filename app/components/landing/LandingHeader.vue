<script setup lang="ts">
const navigationItems = [
  { label: 'Recursos', to: '#recursos' },
  { label: 'Como funciona', to: '#como-funciona' },
  { label: 'Templates', to: '#templates' }
]
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
    <div class="mx-auto flex min-h-18 max-w-[1560px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <!--  =========== Marca ================ -->
      <!--  ----------- Identidade pública -------------- -->

      <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <UIcon name="i-lucide-panels-top-left" class="size-5" />
        </span>

        <div class="min-w-0">
          <p class="truncate font-semibold text-slate-950 dark:text-white">
            Portfolio SaaS
          </p>
          <p class="truncate text-xs text-slate-500 dark:text-slate-400">
            Landing pública
          </p>
        </div>
      </NuxtLink>

      <!--  =========== Navegação ================ -->
      <!--  ----------- Links principais -------------- -->

      <nav class="hidden items-center gap-1 xl:flex">
        <UButton
          v-for="item in navigationItems"
          :key="item.label"
          :to="item.to"
          color="neutral"
          variant="ghost"
          size="sm"
          class="text-slate-600 dark:text-slate-300"
        >
          {{ item.label }}
        </UButton>
      </nav>

      <!--  =========== Ações ================ -->
      <!--  ----------- Portfólio, tema e templates -------------- -->

      <div class="flex items-center gap-2">
        <UButton
          to="/portfolio"
          color="neutral"
          variant="ghost"
          size="sm"
          class="hidden sm:inline-flex text-slate-600 dark:text-slate-300"
        >
          Ver portfólio
        </UButton>

        <UColorModeButton />

        <UButton
          to="/dashboard/templates"
          size="sm"
          icon="i-lucide-layout-template"
        >
          Templates
        </UButton>
      </div>
    </div>
  </header>
</template>