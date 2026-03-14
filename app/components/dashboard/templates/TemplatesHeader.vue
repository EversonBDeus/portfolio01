<script setup lang="ts">
import type { TemplatesViewMode } from '~/composables/useTemplatesState'

defineProps<{
  total: number
  totalFree: number
  totalPlus: number
  totalPro: number
  viewMode: TemplatesViewMode
}>()

defineEmits<{
  'update:viewMode': [mode: TemplatesViewMode]
}>()
</script>

<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <!--  =========== Título da Página ================ -->
    <!--  ----------- Resumo da Galeria -------------- -->

    <div class="space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="primary" variant="subtle">
          Catálogo visual
        </UBadge>

        <UBadge color="neutral" variant="soft">
          {{ total }} templates
        </UBadge>
      </div>

      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Templates</h1>
        <p class="text-sm text-muted">
          Escolha a base visual que faz mais sentido para a sua página.
        </p>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <UBadge color="neutral" variant="outline">
          Free: {{ totalFree }}
        </UBadge>

        <UBadge color="warning" variant="outline">
          Plus: {{ totalPlus }}
        </UBadge>

        <UBadge color="error" variant="outline">
          Pro: {{ totalPro }}
        </UBadge>
      </div>
    </div>

    <!--  =========== Modo de Visualização ================ -->
    <!--  ----------- Grid e Lista -------------- -->

    <div
      class="dashboard-form-surface-2 inline-flex w-full rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-1 shadow-(--dashboard-shadow-xs) sm:w-auto"
    >
      <UButton
        icon="i-lucide-layout-grid"
        size="sm"
        :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
        :color="viewMode === 'grid' ? 'primary' : 'neutral'"
        @click="$emit('update:viewMode', 'grid')"
      >
        Grid
      </UButton>

      <UButton
        icon="i-lucide-list"
        size="sm"
        :variant="viewMode === 'list' ? 'solid' : 'ghost'"
        :color="viewMode === 'list' ? 'primary' : 'neutral'"
        @click="$emit('update:viewMode', 'list')"
      >
        Lista
      </UButton>
    </div>
  </div>
</template>