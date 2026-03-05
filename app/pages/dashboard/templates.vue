<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Templates' })
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Templates</h1>
      <p class="text-sm text-muted">
        Em breve: escolha e edite templates (free/premium) com preview desktop/mobile.
      </p>
    </div>

    <UCard :ui="{ body: 'p-6' }">
      <UAlert
        icon="i-lucide-layout-template"
        title="Em desenvolvimento"
        description="Na próxima fase vamos criar a galeria de templates e o editor."
        color="neutral"
        variant="soft"
      />
    </UCard>
  </div>
</template>