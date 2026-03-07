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
    class="dashboard-form-surface-3 overflow-hidden rounded-2xl border bg-(--dashboard-surface-3) p-4 shadow-(--dashboard-shadow-xs)"
    :class="[
      selected
        ? 'border-(--dashboard-border-strong) shadow-(--dashboard-shadow-md)'
        : 'border-(--dashboard-border-soft)'
    ]"
  >
    <div class="flex flex-col gap-4 lg:flex-row">
      <!--  =========== Visual do Template ================ -->
      <!--  ----------- Thumb Horizontal -------------- -->

      <div class="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl lg:w-280px">
        <div
          class="absolute inset-0 bg-linear-to-br"
          :class="template.gradient"
        />

        <div class="absolute inset-0 bg-black/10" />

        <div class="relative flex h-full flex-col gap-3 p-4">
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

          <div class="space-y-2 pt-4 text-white">
            <div class="h-2 w-20 rounded-full bg-white/50" />
            <div class="h-4 w-44 rounded-full bg-white/80" />
            <div class="h-2 w-32 rounded-full bg-white/40" />
          </div>

          <div class="mt-auto rounded-2xl border border-white/15 bg-white/10 p-3 text-white/90 backdrop-blur-sm">
            <p class="text-sm font-medium">{{ template.previewTitle }}</p>
          </div>
        </div>
      </div>

      <!--  =========== Dados e Ações ================ -->
      <!--  ----------- Conteúdo Principal -------------- -->

      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div class="min-w-0 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-base font-semibold">
                {{ template.name }}
              </h2>

              <UBadge
                :color="available ? 'success' : 'warning'"
                variant="soft"
              >
                {{ available ? 'Liberado' : 'Bloqueado' }}
              </UBadge>
            </div>

            <p class="text-sm text-muted">
              {{ template.category }} · {{ template.statsLabel }}
            </p>

            <p class="text-sm text-muted">
              {{ template.description }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-eye"
              @click="$emit('preview', template.id)"
            >
              Prévia
            </UButton>

            <UButton
              :color="available ? 'primary' : 'warning'"
              :variant="available ? 'solid' : 'outline'"
              :icon="available ? 'i-lucide-check' : 'i-lucide-lock'"
              @click="$emit('select', template.id)"
            >
              {{ available ? 'Usar template' : 'Ver bloqueio' }}
            </UButton>
          </div>
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
      </div>
    </div>
  </article>
</template>