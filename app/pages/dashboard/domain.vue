<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Domain' })
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Domain</h1>
      <p class="text-sm text-muted">
        Em breve: conectar domínio próprio e validar DNS.
      </p>
    </div>

    <UCard :ui="{ body: 'p-6' }">
      <UAlert
        icon="i-lucide-globe"
        title="Em desenvolvimento"
        description="Na fase Pro, aqui terá configuração e status do domínio."
        color="neutral"
        variant="soft"
      />
    </UCard>
  </div>
</template>