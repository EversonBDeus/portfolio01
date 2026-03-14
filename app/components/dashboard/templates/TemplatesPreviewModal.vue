<script setup lang="ts">
import { computed } from 'vue'
import PublicPortfolioRenderer from '~/components/portfolio/PublicPortfolioRenderer.vue'
import { DESIGNER_PREVIEW_PORTFOLIO } from '~/data/designer-preview'
import {
  getPortfolioTemplateRegistryItem,
  resolvePortfolioTemplatePresetId,
} from '~/data/portfolio-template-registry'
import type { PortfolioTemplate } from '~/data/templates'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode,
} from '~/types/portfolio-public-view-model'
import { normalizePortfolioPublicViewModel } from '~/utils/normalize-portfolio-public-view-model'

type Props = {
  open?: boolean
  modelValue?: boolean
  isOpen?: boolean
  template?: PortfolioTemplate | null
  templateId?: string | null
  selectedTemplateId?: string | null
  templatePresetId?: string | null
  selectedTemplatePresetId?: string | null
  templateMode?: PortfolioTemplateMode | null
  selectedTemplateMode?: PortfolioTemplateMode | null
  available?: boolean
  portfolio?: PortfolioPublicViewModel | unknown | null
  previewData?: unknown | null
  device?: 'desktop' | 'mobile'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: boolean]
  select: [templateId: string]
}>()

const openState = computed(() => {
  return props.open ?? props.modelValue ?? props.isOpen ?? false
})

const isAvailable = computed(() => props.available ?? true)

const templateDefinition = computed(() => {
  return getPortfolioTemplateRegistryItem(
    props.templateId
    ?? props.selectedTemplateId
    ?? props.template?.id
    ?? null,
  )
})

const previewPortfolio = computed<PortfolioPublicViewModel>(() => {
  const basePortfolio
    = normalizePortfolioPublicViewModel(props.portfolio ?? props.previewData)
      ?? DESIGNER_PREVIEW_PORTFOLIO

  return {
    ...basePortfolio,
    settings: {
      ...basePortfolio.settings,
      templateId: templateDefinition.value.id,
      templatePresetId: resolvePortfolioTemplatePresetId(
        props.templatePresetId
        ?? props.selectedTemplatePresetId
        ?? basePortfolio.settings.templatePresetId
        ?? null,
        templateDefinition.value.defaultPresetId,
      ),
    },
  }
})

const resolvedTemplateMode = computed<PortfolioTemplateMode>(() => {
  return props.templateMode
    ?? props.selectedTemplateMode
    ?? templateDefinition.value.defaultMode
})

const displayName = computed(() => {
  return props.template?.name ?? templateDefinition.value.name
})

const displayDescription = computed(() => {
  return props.template?.description
    ?? 'Prévia real do template com o renderer central do portfólio.'
})

const displayCategory = computed(() => {
  return props.template?.category ?? 'Template'
})

const displayTier = computed(() => {
  return props.template?.tier ?? 'free'
})

const displayTags = computed(() => {
  return props.template?.tags ?? []
})

function closeModal() {
  emit('update:open', false)
  emit('update:modelValue', false)
}

function selectTemplate() {
  emit('select', templateDefinition.value.id)
  closeModal()
}
</script>

<template>
  <UModal
    :open="openState"
    :ui="{ content: 'max-w-7xl' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #content>
      <div
        class="dashboard-form-surface-3 overflow-hidden rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-3)"
      >
        <div class="flex flex-col gap-6 p-5 sm:p-6">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xl font-semibold">
                {{ displayName }}
              </h2>

              <UBadge color="neutral" variant="soft">
                {{ displayCategory }}
              </UBadge>

              <UBadge
                :color="displayTier === 'free' ? 'neutral' : displayTier === 'plus' ? 'warning' : 'error'"
                variant="solid"
              >
                {{ String(displayTier).toUpperCase() }}
              </UBadge>

              <UBadge
                :color="isAvailable ? 'success' : 'warning'"
                variant="soft"
              >
                {{ isAvailable ? 'Liberado no plano atual' : 'Bloqueado no plano atual' }}
              </UBadge>
            </div>

            <p class="text-sm text-muted">
              {{ displayDescription }}
            </p>

            <div
              v-if="displayTags.length"
              class="flex flex-wrap gap-2"
            >
              <UBadge
                v-for="tag in displayTags"
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
            <div class="mx-auto max-h-[72vh] overflow-auto rounded-3xl border border-white/10 bg-black/10 p-2 sm:p-3">
              <PublicPortfolioRenderer
                :portfolio="previewPortfolio"
                :template-id="templateDefinition.id"
                :template-preset-id="previewPortfolio.settings.templatePresetId"
                :template-mode="resolvedTemplateMode"
              />
            </div>
          </div>

          <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-(--dashboard-border-strong) px-4 py-2 text-sm font-medium transition hover:bg-white/5"
              @click="closeModal"
            >
              Fechar
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-(--ui-primary) px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!isAvailable"
              @click="selectTemplate"
            >
              {{ isAvailable ? 'Usar este template' : 'Indisponível no plano atual' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>