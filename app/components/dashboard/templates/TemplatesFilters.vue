<script setup lang="ts">
import type { PlanTier } from '~/composables/usePerfilState'
import type { TemplateCategoryFilter, TemplateCategoryOption } from '~/data/templates'

defineProps<{
  categories: TemplateCategoryOption[]
  selectedCategory: TemplateCategoryFilter
  searchQuery: string
  previewPlan: PlanTier
}>()

defineEmits<{
  'update:selectedCategory': [value: TemplateCategoryFilter]
  'update:searchQuery': [value: string]
  'update:previewPlan': [value: PlanTier]
}>()

const planOptions: Array<{ label: string; value: PlanTier }> = [
  { label: 'Free', value: 'free' },
  { label: 'Plus', value: 'plus' },
  { label: 'Pro', value: 'pro' }
]
</script>

<template>
  <div
    class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
  >
    <div class="flex flex-col gap-4">
      <!--  =========== Busca e Plano ================ -->
      <!--  ----------- Controles Superiores -------------- -->

      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <UInput
          :model-value="searchQuery"
          icon="i-lucide-search"
          placeholder="Pesquisar por nome, descrição ou tag..."
          size="lg"
          class="w-full xl:max-w-md"
          @update:model-value="$emit('update:searchQuery', String($event ?? ''))"
        />

        <div class="flex flex-col gap-2">
          <p class="text-xs font-medium uppercase tracking-wide text-muted">
            Simular plano atual
          </p>

          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="option in planOptions"
              :key="option.value"
              size="sm"
              :variant="previewPlan === option.value ? 'solid' : 'outline'"
              :color="previewPlan === option.value ? 'primary' : 'neutral'"
              @click="$emit('update:previewPlan', option.value)"
            >
              {{ option.label }}
            </UButton>
          </div>
        </div>
      </div>

      <!--  =========== Categorias ================ -->
      <!--  ----------- Filtros por Tipo -------------- -->

      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="category in categories"
          :key="category.label"
          :icon="category.icon"
          size="sm"
          :variant="selectedCategory === category.label ? 'solid' : 'outline'"
          :color="selectedCategory === category.label ? 'primary' : 'neutral'"
          @click="$emit('update:selectedCategory', category.label)"
        >
          {{ category.label }}
        </UButton>
      </div>
    </div>
  </div>
</template>