<script setup lang="ts">
import { computed } from 'vue'
import PublicPortfolioRenderer from '~/components/portfolio/PublicPortfolioRenderer.vue'
import { DESIGNER_PREVIEW_PORTFOLIO } from '~/data/designer-preview'
import {
  getPortfolioTemplateRegistryItem,
  resolvePortfolioTemplatePresetId,
} from '~/data/portfolio-template-registry'
import type { EditorDevice, EditorPreviewData, EditorSectionVisibility } from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'
import type { PortfolioTemplate } from '~/data/templates'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode,
} from '~/types/portfolio-public-view-model'
import { normalizePortfolioPublicViewModel } from '~/utils/normalize-portfolio-public-view-model'

type Props = {
  template?: PortfolioTemplate | null
  preview?: EditorPreviewData | null
  device?: EditorDevice
  activeSection?: EditorSectionId
  visibility?: EditorSectionVisibility
  portfolio?: PortfolioPublicViewModel | unknown | null
  previewData?: unknown | null
  modelValue?: unknown | null
  templateId?: string | null
  selectedTemplateId?: string | null
  templatePresetId?: string | null
  selectedTemplatePresetId?: string | null
  templateMode?: PortfolioTemplateMode | null
  selectedTemplateMode?: PortfolioTemplateMode | null
  title?: string
  loading?: boolean
}

const props = defineProps<Props>()

const safeDevice = computed<EditorDevice>(() => props.device ?? 'desktop')
const safeActiveSection = computed<EditorSectionId>(() => props.activeSection ?? 'hero')

const effectiveVisibility = computed<EditorSectionVisibility>(() => {
  return {
    hero: props.visibility?.hero ?? true,
    about: props.visibility?.about ?? true,
    projects: props.visibility?.projects ?? true,
    contact: props.visibility?.contact ?? true,
  }
})

const frameClass = computed(() => {
  return safeDevice.value === 'mobile'
    ? 'mx-auto w-full max-w-[430px]'
    : 'mx-auto w-full max-w-6xl'
})

const activeSectionLabel = computed(() => {
  const labels: Record<EditorSectionId, string> = {
    hero: 'Hero',
    about: 'Sobre',
    projects: 'Projetos',
    contact: 'Contato',
  }

  return labels[safeActiveSection.value]
})

function getLinkValue(preview: EditorPreviewData, label: string) {
  return preview.links.find(item => item.label === label)?.value.trim() ?? ''
}

function buildPortfolioFromPreview(
  preview: EditorPreviewData,
  templateId: string,
): PortfolioPublicViewModel {
  return {
    settings: {
      templateId,
      templatePresetId: null,
      publicSlug: 'editor-preview',
      publicationStatus: 'published',
    },
    hero: {
      publicName: preview.publicName,
      headline: preview.headline,
      roleTitle: preview.roleTitle,
      location: preview.location,
      skills: preview.skills,
    },
    about: {
      summary: preview.summary,
    },
    projects: preview.projects.map(project => ({
      id: project.id,
      title: project.title,
      category: project.category,
      summary: project.summary,
      link: project.link,
      featured: project.featured,
    })),
    contact: {
      publicEmail: getLinkValue(preview, 'E-mail'),
      linkedin: getLinkValue(preview, 'LinkedIn'),
      github: getLinkValue(preview, 'GitHub'),
      website: getLinkValue(preview, 'Website'),
      whatsapp: getLinkValue(preview, 'WhatsApp'),
    },
  }
}

const normalizedInputPortfolio = computed(() => {
  return normalizePortfolioPublicViewModel(
    props.portfolio ?? props.previewData ?? props.modelValue,
  )
})

const templateDefinition = computed(() => {
  return getPortfolioTemplateRegistryItem(
    props.templateId
    ?? props.selectedTemplateId
    ?? props.template?.id
    ?? normalizedInputPortfolio.value?.settings.templateId
    ?? null,
  )
})

const resolvedTemplatePresetId = computed(() => {
  return resolvePortfolioTemplatePresetId(
    props.templatePresetId
    ?? props.selectedTemplatePresetId
    ?? props.template?.previewPresetId
    ?? props.template?.templatePresetId
    ?? normalizedInputPortfolio.value?.settings.templatePresetId
    ?? null,
    templateDefinition.value.defaultPresetId,
  )
})

const previewPortfolio = computed<PortfolioPublicViewModel>(() => {
  const basePortfolio = props.preview
    ? buildPortfolioFromPreview(props.preview, templateDefinition.value.id)
    : normalizedInputPortfolio.value ?? DESIGNER_PREVIEW_PORTFOLIO

  return {
    ...basePortfolio,
    settings: {
      ...basePortfolio.settings,
      templateId: templateDefinition.value.id,
      templatePresetId: resolvedTemplatePresetId.value,
    },
  }
})

const resolvedTemplateMode = computed<PortfolioTemplateMode>(() => {
  return props.templateMode
    ?? props.selectedTemplateMode
    ?? props.template?.previewMode
    ?? props.template?.templateMode
    ?? templateDefinition.value.defaultMode
})

const displayTemplateName = computed(() => {
  return props.template?.name ?? templateDefinition.value.name
})

const title = computed(() => props.title ?? 'Prévia ao vivo')
const loading = computed(() => props.loading ?? false)
</script>

<template>
  <div class="space-y-4">
    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="font-medium">
            {{ title }}
          </p>

          <p class="text-sm text-muted">
            O editor renderiza o template escolhido com os dados atuais do formulário.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UBadge color="primary" variant="subtle">
            {{ displayTemplateName }}
          </UBadge>

          <UBadge color="neutral" variant="soft">
            {{ safeDevice === 'desktop' ? 'Desktop' : 'Mobile' }}
          </UBadge>

          <UBadge color="neutral" variant="soft">
            Seção ativa: {{ activeSectionLabel }}
          </UBadge>
        </div>
      </div>
    </div>

    <div
      class="dashboard-form-surface-3 rounded-3xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-3) p-3 shadow-(--dashboard-shadow-md) sm:p-4"
    >
      <div :class="frameClass">
        <div class="overflow-hidden rounded-3xl border border-white/10 bg-black/10 p-2 sm:p-3">
          <PublicPortfolioRenderer
            :portfolio="previewPortfolio"
            :template-id="templateDefinition.id"
            :template-preset-id="resolvedTemplatePresetId"
            :template-mode="resolvedTemplateMode"
            :preview-device="safeDevice"
            :section-visibility="effectiveVisibility"
          />
        </div>
      </div>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-layout-template"
      color="neutral"
      variant="soft"
      :title="loading ? 'Atualizando prévia...' : 'Renderização central ativa'"
      description="O preview do editor agora usa o mesmo renderer central dos templates públicos."
    />
  </div>
</template>