<script setup lang="ts">
import { computed } from 'vue'
import PublicPortfolioRenderer from '~/components/portfolio/PublicPortfolioRenderer.vue'
import { DESIGNER_PREVIEW_PORTFOLIO } from '~/data/designer-preview'
import {
  getPortfolioTemplateRegistryItem,
  resolvePortfolioTemplatePresetId
} from '~/data/portfolio-template-registry'
import type { PortfolioTemplate } from '~/data/templates'

const props = defineProps<{
  open: boolean
  template: PortfolioTemplate | null
  available: boolean
}>()

defineEmits<{
  'update:open': [value: boolean]
  select: [templateId: string]
}>()

const templateDefinition = computed(() => {
  return props.template
    ? getPortfolioTemplateRegistryItem(props.template.id)
    : null
})

const previewPortfolio = computed(() => {
  if (!props.template || !templateDefinition.value) {
    return null
  }

  return {
    ...DESIGNER_PREVIEW_PORTFOLIO,
    settings: {
      ...DESIGNER_PREVIEW_PORTFOLIO.settings,
      templateId: props.template.id,
      templatePresetId: resolvePortfolioTemplatePresetId(
        DESIGNER_PREVIEW_PORTFOLIO.settings.templatePresetId ?? null,
        templateDefinition.value.defaultPresetId
      )
    }
  }
})
</script>

<template>
  <UModal
    :open="open"
    :ui="{ content: 'max-w-7xl' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #content>
      <div
        v-if="template"
        class="dashboard-form-surface-3 overflow-hidden rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-3)"
      >
        <div class="flex flex-col gap-6 p-5 sm:p-6">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xl font-semibold">
                {{ template.name }}
              </h2>

              <UBadge color="neutral" variant="soft">
                {{ template.category }}
              </UBadge>

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

            <p class="text-sm text-muted">
              {{ template.description }}
            </p>

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

          <div
            class="rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-3 shadow-(--dashboard-shadow-xs)"
          >
            <div class="mx-auto max-h-[72vh] overflow-auto rounded-[24px] border border-white/10 bg-black/10 p-2 sm:p-3">
              <PublicPortfolioRenderer
                v-if="previewPortfolio"
                :portfolio="previewPortfolio"
                :template-id="template.id"
                :template-preset-id="previewPortfolio.settings.templatePresetId"
                :template-mode="templateDefinition?.defaultMode ?? 'dark'"
              />
            </div>
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
              <p class="text-sm font-medium">Prévia real</p>
              <p class="mt-1 text-sm text-muted">
                O modal agora renderiza o template real com o preset padrão, em vez de usar uma capa estática.
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