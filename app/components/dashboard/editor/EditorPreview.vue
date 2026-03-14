<script setup lang="ts">
import { computed } from 'vue'
import PublicPortfolioRenderer from '~/components/portfolio/PublicPortfolioRenderer.vue'
import type { EditorDevice, EditorPreviewData, EditorSectionVisibility } from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'
import type { PortfolioTemplate } from '~/data/templates'
import type { PortfolioPublicViewModel } from '~/types/portfolio-public-view-model'

const props = defineProps<{
  template: PortfolioTemplate
  preview: EditorPreviewData
  device: EditorDevice
  activeSection: EditorSectionId
  visibility: EditorSectionVisibility
}>()

const frameClass = computed(() => {
  return props.device === 'mobile'
    ? 'mx-auto max-w-[430px]'
    : 'mx-auto max-w-6xl'
})

const activeSectionLabel = computed(() => {
  const labels: Record<EditorSectionId, string> = {
    hero: 'Hero',
    about: 'Sobre',
    projects: 'Projetos',
    contact: 'Contato'
  }

  return labels[props.activeSection]
})

function getLinkValue(label: string) {
  return props.preview.links.find((item) => item.label === label)?.value.trim() ?? ''
}

const previewPortfolio = computed<PortfolioPublicViewModel>(() => {
  return {
    settings: {
      templateId: props.template.id,
      templatePresetId: null,
      publicSlug: 'editor-preview',
      publicationStatus: 'published'
    },
    hero: {
      publicName: props.preview.publicName,
      headline: props.preview.headline,
      roleTitle: props.preview.roleTitle,
      location: props.preview.location,
      skills: props.preview.skills
    },
    about: {
      summary: props.preview.summary
    },
    projects: props.preview.projects.map((project) => ({
      id: project.id,
      title: project.title,
      category: project.category,
      summary: project.summary,
      link: project.link,
      featured: project.featured
    })),
    contact: {
      publicEmail: getLinkValue('Email'),
      linkedin: getLinkValue('LinkedIn'),
      github: getLinkValue('GitHub'),
      website: getLinkValue('Website'),
      whatsapp: getLinkValue('WhatsApp')
    }
  }
})
</script>

<template>
  <div class="space-y-4">
    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="font-medium">Preview real do template</p>
          <p class="text-sm text-muted">
            O editor agora renderiza o template escolhido com os dados atuais do formulário.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UBadge color="primary" variant="subtle">
            {{ template.name }}
          </UBadge>

          <UBadge color="neutral" variant="soft">
            {{ device === 'desktop' ? 'Desktop' : 'Mobile' }}
          </UBadge>

          <UBadge color="neutral" variant="soft">
            Seção ativa: {{ activeSectionLabel }}
          </UBadge>
        </div>
      </div>
    </div>

    <div
      class="dashboard-form-surface-3 rounded-[28px] border border-(--dashboard-border-strong) bg-(--dashboard-surface-3) p-3 shadow-(--dashboard-shadow-md) sm:p-4"
    >
      <div :class="frameClass">
        <div class="overflow-hidden rounded-[24px] border border-white/10 bg-black/10 p-2 sm:p-3">
          <PublicPortfolioRenderer
            :portfolio="previewPortfolio"
            :template-id="template.id"
          />
        </div>
      </div>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-info"
      title="Leitura do preview"
      description="Este frame mostra o template real aplicado ao estado atual do editor. Os badges acima ajudam a acompanhar dispositivo e seção em edição."
      color="neutral"
      variant="outline"
    />
  </div>
</template>