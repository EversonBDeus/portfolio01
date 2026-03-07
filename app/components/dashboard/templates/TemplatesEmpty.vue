<script setup lang="ts">
defineEmits<{
  reset: []
}>()
</script>

<template>
  <div
    class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-6 shadow-(--dashboard-shadow-xs)"
  >
    <div class="flex flex-col items-start gap-4">
      <UAlert
        class="w-full"
        icon="i-lucide-search-x"
        title="Nenhum template encontrado"
        description="Os filtros atuais não retornaram resultados. Limpe a busca ou troque a categoria."
        color="neutral"
        variant="outline"
      />

      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-rotate-ccw"
        @click="$emit('reset')"
      >
        Limpar filtros
      </UButton>
    </div>
  </div>
</template>