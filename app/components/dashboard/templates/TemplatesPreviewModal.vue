<script setup lang="ts">
import type { PortfolioTemplate } from '~/data/templates'

defineProps<{
  open: boolean
  template: PortfolioTemplate | null
  available: boolean
}>()

defineEmits<{
  'update:open': [value: boolean]
  select: [templateId: string]
}>()
</script>

<template>
  <UModal
    :open="open"
    :ui="{ content: 'max-w-4xl' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #content>
      <div v-if="template" class="overflow-hidden rounded-2xl">
        <!--  =========== Hero do Modal ================ -->
        <!--  ----------- Preview Expandido -------------- -->

        <div class="relative aspect-16/8 overflow-hidden">
          <div
            class="absolute inset-0 bg-linear-to-br"
            :class="template.gradient"
          />

          <div class="absolute inset-0 bg-black/15" />

          <div class="relative flex h-full flex-col gap-4 p-6 sm:p-8">
            <div class="flex flex-wrap gap-2">
              <UBadge
                :color="template.tier === 'free' ? 'neutral' : template.tier === 'plus' ? 'warning' : 'error'"
                variant="solid"
              >
                {{ template.tier.toUpperCase() }}
              </UBadge>

              <UBadge
                :color="available ? 'success' : 'warning'"
                variant="soft"
              >
                {{ available ? 'Liberado no plano atual' : 'Bloqueado no plano atual' }}
              </UBadge>
            </div>

            <div class="mt-auto max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
              <p class="text-lg font-semibold">
                {{ template.previewTitle }}
              </p>

              <p class="mt-2 text-sm text-white/85">
                {{ template.previewSubtitle }}
              </p>
            </div>
          </div>
        </div>

        <!--  =========== Conteúdo do Modal ================ -->
        <!--  ----------- Informações do Template -------------- -->

        <div class="dashboard-form-surface-3 space-y-5 bg-(--dashboard-surface-3) p-6">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xl font-semibold">
                {{ template.name }}
              </h2>

              <UBadge color="neutral" variant="soft">
                {{ template.category }}
              </UBadge>
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

          <div class="grid gap-4 md:grid-cols-2">
            <div
              class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4"
            >
              <p class="text-sm font-medium">Perfil ideal</p>
              <p class="mt-1 text-sm text-muted">
                {{ template.statsLabel }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4"
            >
              <p class="text-sm font-medium">Próxima etapa</p>
              <p class="mt-1 text-sm text-muted">
                Depois desta seleção, o editor visual poderá usar este template como base.
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row">
            <UButton
              block
              color="neutral"
              variant="outline"
              @click="$emit('update:open', false)"
            >
              Fechar
            </UButton>

            <UButton
              block
              :color="available ? 'primary' : 'warning'"
              :variant="available ? 'solid' : 'outline'"
              :icon="available ? 'i-lucide-check' : 'i-lucide-lock'"
              @click="template && $emit('select', template.id)"
            >
              {{ available ? 'Usar este template' : 'Ver bloqueio' }}
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>