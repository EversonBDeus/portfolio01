<script setup lang="ts">
import type { PortfolioTemplate } from '~/data/templates'

defineProps<{
  template: PortfolioTemplate
  available: boolean
  selected: boolean
}>()

defineEmits<{
  preview: [templateId: string]
  select: [templateId: string]
}>()
</script>

<template>
  <article
    class="dashboard-form-surface-3 flex h-full flex-col overflow-hidden rounded-2xl border bg-(--dashboard-surface-3) shadow-(--dashboard-shadow-xs) transition"
    :class="[
      selected
        ? 'border-(--dashboard-border-strong) shadow-(--dashboard-shadow-md)'
        : 'border-(--dashboard-border-soft)'
    ]"
  >
    <!--  =========== Preview do Card ================ -->
    <!--  ----------- Hero Visual -------------- -->

    <div class="relative aspect-16/10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-br"
        :class="template.gradient"
      />

      <div class="absolute inset-0 bg-black/10" />

      <div class="relative flex h-full flex-col gap-3 p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-wrap gap-2">
            <UBadge
              :color="template.tier === 'free' ? 'neutral' : template.tier === 'plus' ? 'warning' : 'error'"
              variant="solid"
            >
              {{ template.tier.toUpperCase() }}
            </UBadge>

            <UBadge
              v-if="selected"
              color="success"
              variant="solid"
            >
              Atual
            </UBadge>
          </div>

          <UBadge
            :color="available ? 'success' : 'warning'"
            variant="soft"
          >
            {{ available ? 'Liberado' : 'Bloqueado' }}
          </UBadge>
        </div>

        <div class="space-y-2 pt-4 text-white">
          <div class="h-2 w-20 rounded-full bg-white/50" />
          <div class="h-4 w-40 rounded-full bg-white/80" />
          <div class="h-2 w-28 rounded-full bg-white/40" />
        </div>

        <div class="mt-auto space-y-2 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
          <p class="text-sm font-medium text-white">
            {{ template.previewTitle }}
          </p>

          <p class="text-xs text-white/80">
            {{ template.previewSubtitle }}
          </p>
        </div>
      </div>
    </div>

    <!--  =========== Conteúdo do Card ================ -->
    <!--  ----------- Informações e Ações -------------- -->

    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="space-y-2">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-base font-semibold">
              {{ template.name }}
            </h2>

            <p class="text-xs text-muted">
              {{ template.category }} · {{ template.statsLabel }}
            </p>
          </div>
        </div>

        <p class="text-sm text-muted">
          {{ template.description }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in template.tags"
          :key="tag"
          color="neutral"
          variant="soft"
        >
          {{ tag }}
        </UBadge>
      </div>

      <div class="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
        <UButton
          block
          color="neutral"
          variant="outline"
          icon="i-lucide-eye"
          @click="$emit('preview', template.id)"
        >
          Prévia
        </UButton>

        <UButton
          block
          :color="available ? 'primary' : 'warning'"
          :variant="available ? 'solid' : 'outline'"
          :icon="available ? 'i-lucide-check' : 'i-lucide-lock'"
          @click="$emit('select', template.id)"
        >
          {{ available ? 'Usar template' : 'Ver bloqueio' }}
        </UButton>
      </div>
    </div>
  </article>
</template>