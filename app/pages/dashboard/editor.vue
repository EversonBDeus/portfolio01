<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EditorPreview from '~/components/dashboard/editor/EditorPreview.vue'
import EditorSectionModal from '~/components/dashboard/editor/EditorSectionModal.vue'
import EditorSectionsPanel from '~/components/dashboard/editor/EditorSectionsPanel.vue'
import type {
  EditorAboutForm,
  EditorContactForm,
  EditorHeroForm,
  EditorProjectFieldUpdate
} from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'
import { useEditorState } from '~/composables/useEditorState'
import { useTemplateSelection } from '~/composables/useTemplateSelection'

definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Editor'
})

const toast = useToast()
const isSectionModalOpen = ref(false)

const {
  aboutForm,
  activeProjectId,
  activeSection,
  addProject,
  canAddProject,
  contactForm,
  device,
  discardChanges,
  hasPendingChanges,
  hasSavedDraft,
  hasSelectedTemplate,
  heroForm,
  lastSavedAt,
  previewData,
  projectErrors,
  projectsForm,
  removeProject,
  resetSection,
  restoreBaseState,
  saveEditorDraft,
  sections,
  selectedTemplate,
  setAboutForm,
  setActiveProject,
  setActiveSection,
  setContactForm,
  setDevice,
  setFeaturedProject,
  setHeroForm,
  toggleSection,
  updateProjectField,
  visibility
} = useEditorState()

const {
  loadSelectionFromServer,
  loadingFromServer: loadingTemplateSelectionFromServer
} = useTemplateSelection()

const isTemplateSelectionLoading = computed(() => loadingTemplateSelectionFromServer.value)

onMounted(async () => {
  await loadSelectionFromServer()
})

const draftStatusTitle = computed(() => {
  if (hasPendingChanges.value) {
    return 'Alterações não salvas'
  }

  if (hasSavedDraft.value) {
    return 'Rascunho salvo localmente'
  }

  return 'Usando base atual do onboarding'
})

const draftStatusDescription = computed(() => {
  if (hasPendingChanges.value) {
    return 'As mudanças atuais só entram no próximo acesso depois que você salvar o rascunho deste template.'
  }

  if (hasSavedDraft.value && lastSavedAt.value) {
    return `Último salvamento: ${formatSavedAt(lastSavedAt.value)}.`
  }

  return 'Sem rascunho salvo ainda. O editor está usando a base atual vinda do onboarding.'
})

function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value))
}

function handleHeroForm(value: EditorHeroForm) {
  setHeroForm(value)
}

function handleAboutForm(value: EditorAboutForm) {
  setAboutForm(value)
}

function handleContactForm(value: EditorContactForm) {
  setContactForm(value)
}

function handleProjectFieldUpdate(value: EditorProjectFieldUpdate) {
  updateProjectField(value.projectId, value.field, value.value)
}

function handleSelectSection(sectionId: EditorSectionId) {
  setActiveSection(sectionId)
  isSectionModalOpen.value = true
}

function handleSelectProject(projectId: string) {
  setActiveProject(projectId)
}

function handleAddProject() {
  addProject()
}

function handleRemoveProject(projectId: string) {
  removeProject(projectId)
}

function handleSetFeaturedProject(projectId: string) {
  setFeaturedProject(projectId)
}

function handleSaveDraft() {
  const saved = saveEditorDraft()

  if (!saved) {
    toast.add({
      title: 'Template não encontrado',
      description: 'Selecione um template antes de salvar um rascunho do editor.',
      color: 'warning',
      icon: 'i-lucide-layout-template'
    })

    return
  }

  toast.add({
    title: 'Rascunho salvo',
    description: 'As alterações deste template foram salvas localmente no navegador atual.',
    color: 'success',
    icon: 'i-lucide-save'
  })
}

function handleDiscardChanges() {
  const result = discardChanges()

  if (result === 'unavailable') {
    return
  }

  toast.add({
    title: 'Alterações descartadas',
    description:
      result === 'draft'
        ? 'O editor voltou para o último rascunho salvo deste template.'
        : 'O editor voltou para a base atual vinda do onboarding.',
    color: 'warning',
    icon: 'i-lucide-rotate-ccw'
  })
}

function handleRestoreBase() {
  const restored = restoreBaseState()

  if (!restored) {
    return
  }

  toast.add({
    title: 'Base restaurada',
    description: 'O rascunho salvo foi removido e o editor voltou para a base atual do onboarding.',
    color: 'success',
    icon: 'i-lucide-eraser'
  })
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
          O editor agora salva rascunhos locais por template para manter Hero, Sobre, Projetos e Contato entre acessos.
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
      icon="i-lucide-save"
      title="Escopo desta etapa"
      description="Hero, Sobre, Projetos e Contato agora podem ser editados, salvos localmente, descartados e restaurados para a base do onboarding sem backend real."
      color="neutral"
      variant="outline"
    />

<div
  v-if="isTemplateSelectionLoading"
  class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-6 shadow-(--dashboard-shadow-xs)"
>
  <UAlert
    icon="i-lucide-refresh-cw"
    title="Carregando template salvo"
    description="Estamos buscando o template atual da sua conta para montar o editor."
    color="neutral"
    variant="outline"
  />
</div>

    <!--  =========== Estado sem Template ================ -->
    <!--  ----------- Seleção Necessária -------------- -->

    <div
      v-else-if="!hasSelectedTemplate || !selectedTemplate"
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-6 shadow-(--dashboard-shadow-xs)"
    >
      <div class="space-y-4">
        <UAlert
          icon="i-lucide-layout-template"
          title="Selecione um template antes de editar"
          description="A base do editor precisa de um template atual para montar e salvar o rascunho do portfólio."
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

        <div
          class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
        >
          <div class="space-y-4">
            <div class="space-y-1">
              <p class="font-medium">Rascunho local do editor</p>
              <p class="text-sm text-muted">
                O rascunho fica salvo apenas neste navegador e separado da base atual do onboarding.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <UBadge
                :color="hasPendingChanges ? 'warning' : 'success'"
                variant="soft"
              >
                {{ draftStatusTitle }}
              </UBadge>

              <UBadge
                :color="hasSavedDraft ? 'primary' : 'neutral'"
                variant="soft"
              >
                {{ hasSavedDraft ? 'Com rascunho salvo' : 'Sem rascunho salvo' }}
              </UBadge>
            </div>

            <p class="text-xs leading-5 text-muted">
              {{ draftStatusDescription }}
            </p>

            <div class="flex flex-wrap gap-2">
              <UButton
                size="sm"
                color="primary"
                icon="i-lucide-save"
                @click="handleSaveDraft"
              >
                Salvar rascunho
              </UButton>

              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-rotate-ccw"
                :disabled="!hasPendingChanges"
                @click="handleDiscardChanges"
              >
                Descartar alterações
              </UButton>

              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-eraser"
                :disabled="!hasSavedDraft && !hasPendingChanges"
                @click="handleRestoreBase"
              >
                Restaurar base
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
      :contact-form="contactForm"
      :projects="projectsForm"
      :active-project-id="activeProjectId"
      :project-errors="projectErrors"
      :can-add-project="canAddProject"
      @update:open="isSectionModalOpen = $event"
      @update:hero-form="handleHeroForm"
      @update:about-form="handleAboutForm"
      @update:contact-form="handleContactForm"
      @add-project="handleAddProject"
      @remove-project="handleRemoveProject"
      @select-project="handleSelectProject"
      @set-featured-project="handleSetFeaturedProject"
      @update-project-field="handleProjectFieldUpdate"
      @reset="resetSection"
    />
  </div>
</template>