<script setup lang="ts">
import { ref } from 'vue'
import EditorPreview from '~/components/dashboard/editor/EditorPreview.vue'
import EditorSectionModal from '~/components/dashboard/editor/EditorSectionModal.vue'
import EditorSectionsPanel from '~/components/dashboard/editor/EditorSectionsPanel.vue'
import type {
  EditorAboutForm,
  EditorHeroForm
} from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'
import { useEditorState } from '~/composables/useEditorState'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Editor' })

const isSectionModalOpen = ref(false)

const {
  aboutForm,
  activeSection,
  device,
  hasSelectedTemplate,
  heroForm,
  previewData,
  resetSection,
  sections,
  selectedTemplate,
  setAboutForm,
  setActiveSection,
  setDevice,
  setHeroForm,
  toggleSection,
  visibility
} = useEditorState()

function handleHeroForm(value: EditorHeroForm) {
  setHeroForm(value)
}

function handleAboutForm(value: EditorAboutForm) {
  setAboutForm(value)
}

function handleSelectSection(sectionId: EditorSectionId) {
  setActiveSection(sectionId)
  isSectionModalOpen.value = true
}
</script>

<template>
  <div class="space-y-6">
    <!--  =========== Cabeçalho da Página ================ -->
    <!--  ----------- Título e Viewport -------------- -->

    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Editor</h1>
        <p class="text-sm text-muted">
          Agora a edição das seções acontece em modal, mantendo o preview visível durante o ajuste.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <UButton
          size="sm"
          :variant="device === 'desktop' ? 'solid' : 'outline'"
          :color="device === 'desktop' ? 'primary' : 'neutral'"
          icon="i-lucide-monitor"
          @click="setDevice('desktop')"
        >
          Desktop
        </UButton>

        <UButton
          size="sm"
          :variant="device === 'mobile' ? 'solid' : 'outline'"
          :color="device === 'mobile' ? 'primary' : 'neutral'"
          icon="i-lucide-smartphone"
          @click="setDevice('mobile')"
        >
          Mobile
        </UButton>
      </div>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-sliders-horizontal"
      title="Escopo desta etapa"
      description="A edição agora abre em modal. Hero e Sobre continuam com preview em tempo real. Projetos e Contato entram na próxima fase."
      color="neutral"
      variant="outline"
    />

    <!--  =========== Estado sem Template ================ -->
    <!--  ----------- Seleção Necessária -------------- -->

    <div
      v-if="!hasSelectedTemplate || !selectedTemplate"
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-6 shadow-(--dashboard-shadow-xs)"
    >
      <div class="space-y-4">
        <UAlert
          icon="i-lucide-layout-template"
          title="Selecione um template antes de editar"
          description="A base do editor precisa de um template atual para montar o preview do portfólio."
          color="warning"
          variant="outline"
        />

        <div class="flex flex-wrap gap-2">
          <UButton
            to="/dashboard/templates"
            color="primary"
            icon="i-lucide-arrow-right"
          >
            Ir para Templates
          </UButton>

          <UButton
            to="/dashboard/perfil"
            color="neutral"
            variant="outline"
            icon="i-lucide-user-round"
          >
            Revisar perfil
          </UButton>
        </div>
      </div>
    </div>

    <!--  =========== Estrutura do Editor ================ -->
    <!--  ----------- Painel e Preview -------------- -->

    <div
      v-else
      class="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"
    >
      <div class="space-y-6">
        <div
          class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
        >
          <div class="space-y-3">
            <div class="space-y-1">
              <p class="font-medium">Template atual</p>
              <p class="text-sm text-muted">
                Esta tela continua ligada ao template escolhido na galeria.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="subtle">
                {{ selectedTemplate.name }}
              </UBadge>

              <UBadge color="neutral" variant="soft">
                {{ selectedTemplate.category }}
              </UBadge>

              <UBadge
                :color="selectedTemplate.tier === 'free' ? 'neutral' : selectedTemplate.tier === 'plus' ? 'warning' : 'error'"
                variant="soft"
              >
                {{ selectedTemplate.tier.toUpperCase() }}
              </UBadge>
            </div>

            <div class="flex flex-wrap gap-2 pt-1">
              <UButton
                to="/dashboard/templates"
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-refresh-cw"
              >
                Trocar template
              </UButton>

              <UButton
                to="/dashboard/perfil"
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-pencil-line"
              >
                Editar dados
              </UButton>
            </div>
          </div>
        </div>

        <EditorSectionsPanel
          :sections="sections"
          :active-section="activeSection"
          @select="handleSelectSection"
          @toggle="toggleSection"
        />
      </div>

      <EditorPreview
        :template="selectedTemplate"
        :preview="previewData"
        :device="device"
        :active-section="activeSection"
        :visibility="visibility"
      />
    </div>

    <EditorSectionModal
      :open="isSectionModalOpen"
      :active-section="activeSection"
      :hero-form="heroForm"
      :about-form="aboutForm"
      @update:open="isSectionModalOpen = $event"
      @update:hero-form="handleHeroForm"
      @update:about-form="handleAboutForm"
      @reset="resetSection"
    />
  </div>
</template>