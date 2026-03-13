<script setup lang="ts">
const footerLinks = [
  { label: 'Recursos', to: '#recursos' },
  { label: 'Como funciona', to: '#como-funciona' },
  { label: 'Templates', to: '#templates' },
  { label: 'Entrar', to: '/auth/login' }
]
</script>

<template>
  <footer class="border-t border-black/5 pb-8 pt-10 dark:border-white/10 sm:pb-10 sm:pt-14">
    <div class="mx-auto flex max-w-[1560px] flex-col gap-4 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
      <!--  =========== Identidade ================ -->
      <!--  ----------- Texto institucional -------------- -->

      <div class="space-y-3">
        <img
          src="/brand/lumio-logo.png"
          alt="Lumio"
          class="h-8 w-auto"
        >

        <p class="max-w-xl text-sm text-slate-600 dark:text-slate-400">
          Crie, edite e publique seu portfólio profissional com uma experiência moderna, guiada e pronta para evoluir.
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