<script setup lang="ts">
import { computed } from 'vue'
import EditorAboutControls from '~/components/dashboard/editor/EditorAboutControls.vue'
import EditorHeroControls from '~/components/dashboard/editor/EditorHeroControls.vue'
import EditorProjectsControls from '~/components/dashboard/editor/EditorProjectsControls.vue'
import type {
  EditorAboutForm,
  EditorHeroForm,
  EditorProjectFieldUpdate
} from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'
import type { EditorProjectErrors, EditorProjectForm } from '~/schemas/editor-project'

const props = defineProps<{
  open: boolean
  activeSection: EditorSectionId
  heroForm: EditorHeroForm
  aboutForm: EditorAboutForm
  projects: EditorProjectForm[]
  activeProjectId: string | null
  projectErrors: Record<string, EditorProjectErrors>
  canAddProject: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:heroForm': [value: EditorHeroForm]
  'update:aboutForm': [value: EditorAboutForm]
  addProject: []
  removeProject: [projectId: string]
  selectProject: [projectId: string]
  setFeaturedProject: [projectId: string]
  updateProjectField: [payload: EditorProjectFieldUpdate]
  reset: [sectionId: EditorSectionId]
}>()

const sectionMeta = computed(() => {
  if (props.activeSection === 'hero') {
    return {
      title: 'Editar Hero',
      description: 'Ajuste nome público, headline, cargo, localização e competências em destaque.',
      icon: 'i-lucide-panels-top-left',
      badge: 'Hero ativa'
    }
  }

  if (props.activeSection === 'about') {
    return {
      title: 'Editar Sobre',
      description: 'Ajuste o resumo profissional que alimenta o preview do template.',
      icon: 'i-lucide-file-text',
      badge: 'Sobre ativa'
    }
  }

  if (props.activeSection === 'projects') {
    return {
      title: 'Editar Projetos',
      description: 'Ajuste os cards que alimentam a vitrine inicial da seção Projetos no template.',
      icon: 'i-lucide-folder-kanban',
      badge: 'Projetos ativa'
    }
  }

  return {
    title: 'Contato',
    description: 'A edição detalhada desta seção entra na próxima etapa.',
    icon: 'i-lucide-send',
    badge: 'Próxima etapa'
  }
})

function handleHeroUpdate(value: EditorHeroForm) {
  emit('update:heroForm', value)
}

function handleAboutUpdate(value: EditorAboutForm) {
  emit('update:aboutForm', value)
}

function handleProjectFieldUpdate(value: EditorProjectFieldUpdate) {
  emit('updateProjectField', value)
}

function handleResetHero() {
  emit('reset', 'hero')
}

function handleResetAbout() {
  emit('reset', 'about')
}

function handleResetProjects() {
  emit('reset', 'projects')
}
</script>

<template>
  <UModal
    :open="open"
    scrollable
    :title="sectionMeta.title"
    :description="sectionMeta.description"
    :ui="{ content: 'sm:max-w-5xl' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-6">
        <!--  =========== Destaque do Modal ================ -->
        <!--  ----------- Contexto da Seção Ativa -------------- -->

        <div class="overflow-hidden rounded-[24px] border border-(--dashboard-border-strong) bg-(--dashboard-surface-2)">
          <div class="border-b border-(--dashboard-border-soft) bg-(--dashboard-surface-3) px-5 py-4">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-2">
                  <div class="flex size-10 items-center justify-center rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2)">
                    <UIcon :name="sectionMeta.icon" class="size-5 text-primary" />
                  </div>

                  <UBadge color="primary" variant="subtle">
                    {{ sectionMeta.badge }}
                  </UBadge>

                  <UBadge color="neutral" variant="soft">
                    Editor visual
                  </UBadge>
                </div>

                <div class="space-y-1">
                  <p class="text-base font-semibold">
                    {{ sectionMeta.title }}
                  </p>

                  <p class="text-sm text-muted">
                    {{ sectionMeta.description }}
                  </p>
                </div>
              </div>

              <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) px-3 py-2 text-sm text-muted">
                Ajustes locais nesta etapa
              </div>
            </div>
          </div>

          <div class="px-5 py-5 sm:px-6 sm:py-6">
            <!--  =========== Conteúdo da Seção ================ -->
            <!--  ----------- Hero, Sobre, Projetos e Próximas Etapas -------------- -->

            <EditorHeroControls
              v-if="activeSection === 'hero'"
              :model-value="heroForm"
              embedded
              @update:model-value="handleHeroUpdate"
              @reset="handleResetHero"
            />

            <EditorAboutControls
              v-else-if="activeSection === 'about'"
              :model-value="aboutForm"
              embedded
              @update:model-value="handleAboutUpdate"
              @reset="handleResetAbout"
            />

            <EditorProjectsControls
              v-else-if="activeSection === 'projects'"
              :projects="projects"
              :active-project-id="activeProjectId"
              :project-errors="projectErrors"
              :can-add-project="canAddProject"
              @add-project="emit('addProject')"
              @remove-project="emit('removeProject', $event)"
              @select-project="emit('selectProject', $event)"
              @set-featured-project="emit('setFeaturedProject', $event)"
              @update-project-field="handleProjectFieldUpdate"
              @reset="handleResetProjects"
            />

            <div v-else class="space-y-4">
              <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-5">
                <UAlert
                  class="dashboard-note-alert"
                  icon="i-lucide-clock-3"
                  title="Controles desta seção entram na próxima etapa"
                  :description="`A edição detalhada de ${sectionMeta.title} será adicionada depois da base de Hero, Sobre e Projetos.`"
                  color="neutral"
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <!--  =========== Rodapé do Modal ================ -->
      <!--  ----------- Observação e Fechar -------------- -->

      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-muted">
          O preview ao fundo continua reagindo enquanto você edita.
        </p>

        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-x"
          @click="emit('update:open', false)"
        >
          Fechar
        </UButton>
      </div>
    </template>
  </UModal>
</template>