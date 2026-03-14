<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import AuroraUxTemplate from '~/components/templates/AuroraUx/AuroraUxTemplate.vue'
import ImperialArcTemplate from '~/components/templates/ImperialArcTemplate/ImperialArcTemplate.vue'
import NeonPulseTemplate from '~/components/templates/NeonPulseTemplate/NeonPulseTemplate.vue'
import NoirSignalTemplate from '~/components/templates/NoirSignalTemplate/NoirSignalTemplate.vue'
import ObsidianPrimeTemplate from '~/components/templates/ObsidianPrimeTemplate/ObsidianPrimeTemplate.vue'
import QuietFrameTemplate from '~/components/templates/QuietFrameTemplate/QuietFrameTemplate.vue'
import StillFormTemplate from '~/components/templates/StillFormTemplate/StillFormTemplate.vue'
import StudioRailTemplate from '~/components/templates/StudioRailTemplate/StudioRailTemplate.vue'
import VelvetStageTemplate from '~/components/templates/VelvetStageTemplate/VelvetStageTemplate.vue'
import {
  getPortfolioTemplateRegistryItem,
  type PortfolioTemplateId,
  resolvePortfolioTemplatePresetId,
} from '~/data/portfolio-template-registry'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode,
} from '~/types/portfolio-public-view-model'
import { normalizePortfolioPublicViewModel } from '~/utils/normalize-portfolio-public-view-model'

type TemplateSectionVisibility = {
  hero?: boolean
  about?: boolean
  projects?: boolean
  contact?: boolean
}

type PreviewDevice = 'desktop' | 'mobile'

type Props = {
  portfolio?: PortfolioPublicViewModel | unknown | null
  templateId?: string | null
  templatePresetId?: string | null
  templateMode?: PortfolioTemplateMode | null
  previewDevice?: PreviewDevice | null
  sectionVisibility?: TemplateSectionVisibility | null
}

const props = withDefaults(defineProps<Props>(), {
  templateId: null,
  templatePresetId: null,
  templateMode: null,
  previewDevice: null,
  sectionVisibility: null,
})

const TEMPLATE_COMPONENTS: Record<PortfolioTemplateId, Component> = {
  'quiet-frame': QuietFrameTemplate,
  'still-form': StillFormTemplate,
  'aurora-ux': AuroraUxTemplate,
  'velvet-stage': VelvetStageTemplate,
  'neon-pulse': NeonPulseTemplate,
  'studio-rail': StudioRailTemplate,
  'imperial-arc': ImperialArcTemplate,
  'obsidian-prime': ObsidianPrimeTemplate,
  'noir-signal': NoirSignalTemplate,
}

const normalizedPortfolio = computed(() => {
  return normalizePortfolioPublicViewModel(props.portfolio)
})

const templateDefinition = computed(() => {
  return getPortfolioTemplateRegistryItem(
    props.templateId ?? normalizedPortfolio.value?.settings.templateId ?? null,
  )
})

const resolvedTemplatePresetId = computed(() => {
  return resolvePortfolioTemplatePresetId(
    props.templatePresetId ?? normalizedPortfolio.value?.settings.templatePresetId ?? null,
    templateDefinition.value.defaultPresetId,
  )
})

const resolvedTemplateMode = computed<PortfolioTemplateMode>(() => {
  return props.templateMode ?? templateDefinition.value.defaultMode
})

const resolvedTemplateComponent = computed<Component>(() => {
  return TEMPLATE_COMPONENTS[templateDefinition.value.id] ?? QuietFrameTemplate
})

const forwardedTemplateProps = computed<Record<string, unknown>>(() => {
  if (
    ![
      'quiet-frame',
      'neon-pulse',
      'still-form',
      'studio-rail',
      'aurora-ux',
      'obsidian-prime',
      'noir-signal',
      'velvet-stage',
      'imperial-arc',
    ].includes(templateDefinition.value.id)
  ) {
    return {}
  }

  return {
    previewDevice: props.previewDevice ?? 'desktop',
    sectionVisibility: props.sectionVisibility ?? null,
  }
})
</script>

<template>
  <component
    :is="resolvedTemplateComponent"
    v-if="normalizedPortfolio"
    v-bind="forwardedTemplateProps"
    :portfolio="normalizedPortfolio"
    :theme-name="templateDefinition.name"
    :template-preset-id="resolvedTemplatePresetId"
    :template-mode="resolvedTemplateMode"
  />

  <div
    v-else
    class="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300"
  >
    Não foi possível renderizar a prévia do template com os dados recebidos.
  </div>
</template>