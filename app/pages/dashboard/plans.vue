<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Plans' })
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Plans</h1>
      <p class="text-sm text-muted">
        Em breve: preços, upgrades e integrações de pagamento.
      </p>
    </div>

    <UCard :ui="{ body: 'p-6' }">
      <UAlert
        icon="i-lucide-credit-card"
        title="Em desenvolvimento"
        description="Na fase Mercado Pago, esta página mostrará planos e checkout."
        color="neutral"
        variant="soft"
      />
    </UCard>
  </div>
</template>