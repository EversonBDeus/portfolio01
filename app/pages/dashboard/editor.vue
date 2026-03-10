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
  loadingBaseFromServer,
  loadingFromServer,
  previewData,
  projectErrors,
  projectsForm,
  removeProject,
  resetSection,
  restoreBaseState,
  saveEditorDraft,
  savingToServer,
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

const isEditorBootstrapLoading = computed(() => {
  return isTemplateSelectionLoading.value || loadingBaseFromServer.value
})

const bootstrapAlertTitle = computed(() => {
  return isTemplateSelectionLoading.value ? 'Carregando template salvo' : 'Carregando base do editor'
})

const bootstrapAlertDescription = computed(() => {
  return isTemplateSelectionLoading.value
    ? 'Estamos buscando o template atual da sua conta para montar o editor.'
    : 'Estamos buscando a base real do onboarding e do perfil para montar o fallback do editor.'
})

const isEditorBusy = computed(() => {
  return loadingBaseFromServer.value || loadingFromServer.value || savingToServer.value
})
onMounted(async () => {
  await loadSelectionFromServer()
})

const draftStatusTitle = computed(() => {
  if (savingToServer.value) {
    return 'Salvando alterações'
  }

  if (hasPendingChanges.value) {
    return 'Alterações não salvas'
  }

  if (hasSavedDraft.value) {
    return 'Editor salvo na conta'
  }

  return 'Usando base atual do onboarding'
})

const draftStatusDescription = computed(() => {
  if (savingToServer.value) {
    return 'Estamos sincronizando Hero, Sobre, Projetos e Contato com a sua conta.'
  }

  if (hasPendingChanges.value) {
    return 'As mudanças atuais só entram nos próximos acessos depois que você salvar o editor da sua conta.'
  }

  if (hasSavedDraft.value && lastSavedAt.value) {
    return `Última sincronização: ${formatSavedAt(lastSavedAt.value)}.`
  }

  return 'Sem editor salvo ainda. O preview está usando a base atual vinda do onboarding.'
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

async function handleSaveDraft() {
  const result = await saveEditorDraft()

  if (!result.ok) {
    toast.add({
      title: 'Não foi possível salvar o editor',
      description: result.error,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })

    return
  }

  toast.add({
    title: 'Editor salvo',
    description: 'As alterações deste template foram sincronizadas com a sua conta.',
    color: 'success',
    icon: 'i-lucide-save'
  })
}

async function handleDiscardChanges() {
 const result = await discardChanges()

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
async function handleRestoreBase() {
  const result = await restoreBaseState()

  if (!result.ok) {
    toast.add({
      title: 'Não foi possível restaurar a base',
      description: result.error,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })

    return
  }

  toast.add({
    title: 'Base restaurada',
    description: 'A base atual do onboarding foi aplicada novamente e sincronizada com a sua conta.',
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
            O editor agora salva Hero, Sobre, Projetos e Contato na sua conta para manter o conteúdo entre acessos e dispositivos.
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
          description="Hero, Sobre, Projetos e Contato agora podem ser editados, salvos na conta, descartados e restaurados para a base atual do onboarding com backend real."
          color="neutral"
          variant="outline"
        />

<div
  v-if="isEditorBootstrapLoading"
  class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-6 shadow-(--dashboard-shadow-xs)"
>
  <UAlert
    icon="i-lucide-refresh-cw"
    :title="bootstrapAlertTitle"
    :description="bootstrapAlertDescription"
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
       <p class="font-medium">Persistência do editor</p>
              <p class="text-sm text-muted">
                O editor fica salvo na sua conta e continua separado da base atual do onboarding.
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
                {{ hasSavedDraft ? 'Sincronizado com a conta' : 'Sem versão salva ainda' }}
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
                  :loading="savingToServer"
                  :disabled="isEditorBusy"
                  @click="handleSaveDraft"
                >
                  Salvar editor
                </UButton>

                <UButton
                  size="sm"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-rotate-ccw"
                  :disabled="!hasPendingChanges || isEditorBusy"
                  @click="handleDiscardChanges"
                >
                  Descartar alterações
                </UButton>

                <UButton
                  size="sm"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-eraser"
                  :disabled="isEditorBusy"
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