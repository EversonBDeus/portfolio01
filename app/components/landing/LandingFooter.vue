<script setup lang="ts">
const footerLinks = [
  { label: 'Recursos', to: '#recursos' },
  { label: 'Como funciona', to: '#como-funciona' },
  { label: 'Templates', to: '#templates' },
  { label: 'Ver portfólio', to: '/portfolio' }
]
</script>

<template>
  <footer class="border-t border-black/5 pb-8 pt-10 dark:border-white/10 sm:pb-10 sm:pt-14">
    <div class="mx-auto flex max-w-[1560px] flex-col gap-4 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
      <!--  =========== Identidade ================ -->
      <!--  ----------- Texto institucional -------------- -->

      <div class="space-y-1">
        <p class="font-semibold text-slate-950 dark:text-white">
          Portfolio SaaS
        </p>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Entrada pública da plataforma antes de login, onboarding e dashboard.
        </p>
      </div>

      <!--  =========== Links ================ -->
      <!--  ----------- Navegação rápida -------------- -->

      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="item in footerLinks"
          :key="item.label"
          :to="item.to"
          color="neutral"
          variant="ghost"
          size="sm"
          class="text-slate-600 dark:text-slate-300"
        >
          {{ item.label }}
        </UButton>
      </div>
    </div>
  </footer>
</template>