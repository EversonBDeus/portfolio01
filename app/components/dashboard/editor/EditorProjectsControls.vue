<script setup lang="ts">
import { computed } from 'vue'
import type { EditorProjectFieldUpdate } from '~/composables/useEditorState'
import type { EditorProjectErrors, EditorProjectForm } from '~/schemas/editor-project'

const props = defineProps<{
  projects: EditorProjectForm[]
  activeProjectId: string | null
  projectErrors: Record<string, EditorProjectErrors>
  canAddProject: boolean
}>()

const emit = defineEmits<{
  addProject: []
  removeProject: [projectId: string]
  selectProject: [projectId: string]
  setFeaturedProject: [projectId: string]
  updateProjectField: [payload: EditorProjectFieldUpdate]
  reset: []
}>()

const activeProject = computed(() => {
  return props.projects.find((item) => item.id === props.activeProjectId) ?? props.projects[0] ?? null
})

const activeErrors = computed(() => {
  return props.projectErrors[activeProject.value?.id ?? ''] ?? {}
})

function updateField(field: 'title' | 'category' | 'summary' | 'link', value: string | number | undefined) {
  if (!activeProject.value) {
    return
  }

  emit('updateProjectField', {
    projectId: activeProject.value.id,
    field,
    value: String(value ?? '')
  })
}
</script>

<template>
  <div class="space-y-6">
    <!--  =========== Cabeçalho dos Projetos ================ -->
    <!--  ----------- Contexto da Edição -------------- -->

    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="primary" variant="subtle">
          Projetos
        </UBadge>

        <UBadge color="neutral" variant="soft">
          Vitrine do preview
        </UBadge>

        <UBadge color="neutral" variant="soft">
          {{ projects.length }}/3
        </UBadge>
      </div>

      <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-1">
          <p class="text-sm font-medium">
            Cards da seção Projetos no template
          </p>

          <p class="text-sm text-muted">
            Edite os itens que alimentam a vitrine inicial do preview. O destaque define qual projeto ganha prioridade visual.
          </p>
        </div>

        <UButton
          size="sm"
          color="primary"
          variant="subtle"
          icon="i-lucide-plus"
          :disabled="!canAddProject"
          @click="$emit('addProject')"
        >
          Adicionar projeto
        </UButton>
      </div>
    </div>

    <!--  =========== Estado Vazio ================ -->
    <!--  ----------- Sem Projetos -------------- -->

    <div
      v-if="projects.length === 0"
      class="space-y-4 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-5"
    >
      <UAlert
        class="dashboard-note-alert"
        icon="i-lucide-folder-plus"
        title="Nenhum projeto no editor ainda"
        description="Crie o primeiro projeto para começar a alimentar a vitrine do preview."
        color="neutral"
        variant="outline"
      />

      <UButton
        color="primary"
        icon="i-lucide-plus"
        @click="$emit('addProject')"
      >
        Criar primeiro projeto
      </UButton>
    </div>

    <!--  =========== Estrutura dos Projetos ================ -->
    <!--  ----------- Lista e Formulário -------------- -->

    <div
      v-else
      class="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div class="space-y-3">
        <article
          v-for="project in projects"
          :key="project.id"
          class="rounded-2xl border p-4 transition"
          :class="[
            activeProjectId === project.id
              ? 'border-(--dashboard-border-strong) bg-(--dashboard-surface-3)'
              : 'border-(--dashboard-border-soft) bg-(--dashboard-surface-2)'
          ]"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="truncate text-sm font-medium">
                    {{ project.title || 'Novo projeto' }}
                  </p>

                  <UBadge
                    v-if="project.featured"
                    color="success"
                    variant="soft"
                  >
                    Destaque
                  </UBadge>
                </div>

                <p class="truncate text-xs text-muted">
                  {{ project.category || 'Categoria do projeto' }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <UButton
                size="xs"
                :variant="activeProjectId === project.id ? 'solid' : 'outline'"
                :color="activeProjectId === project.id ? 'primary' : 'neutral'"
                icon="i-lucide-pen-square"
                @click="$emit('selectProject', project.id)"
              >
                Editar
              </UButton>

              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                :icon="project.featured ? 'i-lucide-star' : 'i-lucide-star-off'"
                @click="$emit('setFeaturedProject', project.id)"
              >
                {{ project.featured ? 'Em destaque' : 'Destacar' }}
              </UButton>

              <UButton
                size="xs"
                color="error"
                variant="outline"
                icon="i-lucide-trash-2"
                @click="$emit('removeProject', project.id)"
              >
                Remover
              </UButton>
            </div>
          </div>
        </article>
      </div>

      <div
        v-if="activeProject"
        class="space-y-5 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-5"
      >
        <div class="space-y-1">
          <p class="text-sm font-medium">
            Projeto selecionado
          </p>

          <p class="text-sm text-muted">
            Ajuste título, categoria, resumo e link público do card que será exibido no preview.
          </p>
        </div>

        <div class="grid gap-5">
          <UFormField
            class="w-full"
            size="xl"
            label="Nome do projeto"
            :error="activeErrors.title"
          >
            <UInput
              :model-value="activeProject.title"
              class="w-full"
              size="xl"
              color="primary"
              variant="subtle"
              spellcheck="false"
              placeholder="Ex.: Portfólio SaaS para arquitetos"
              @update:model-value="updateField('title', $event)"
            />
          </UFormField>

          <UFormField
            class="w-full"
            size="xl"
            label="Categoria"
            :error="activeErrors.category"
          >
            <UInput
              :model-value="activeProject.category"
              class="w-full"
              size="xl"
              color="primary"
              variant="subtle"
              spellcheck="false"
              placeholder="Ex.: Web Design, Branding, Produto"
              @update:model-value="updateField('category', $event)"
            />
          </UFormField>

          <UFormField
            class="w-full"
            size="xl"
            label="Resumo"
            :error="activeErrors.summary"
          >
            <UTextarea
              :model-value="activeProject.summary"
              class="w-full"
              :rows="6"
              :maxrows="10"
              autoresize
              size="xl"
              color="primary"
              variant="subtle"
              spellcheck="false"
              placeholder="Descreva o objetivo do projeto, o contexto e o valor entregue."
              @update:model-value="updateField('summary', $event)"
            />
          </UFormField>

          <UFormField
            class="w-full"
            size="xl"
            label="Link público"
            description="Opcional. Use URL completa com http:// ou https://."
            :error="activeErrors.link"
          >
            <UInput
              :model-value="activeProject.link"
              class="w-full"
              size="xl"
              color="primary"
              variant="subtle"
              spellcheck="false"
              placeholder="https://seuprojeto.com"
              @update:model-value="updateField('link', $event)"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <!--  =========== Apoio e Ação ================ -->
    <!--  ----------- Informação Local e Reset -------------- -->

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
        <div class="flex items-start gap-3">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2)">
            <UIcon name="i-lucide-folder-kanban" class="size-4 text-primary" />
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium">
              Validação local com Zod
            </p>

            <p class="text-sm text-muted">
              Os erros aparecem só nesta camada do editor e ajudam a testar a vitrine antes da persistência real.
            </p>
          </div>
        </div>
      </div>

      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-rotate-ccw"
        @click="$emit('reset')"
      >
        Restaurar Projetos
      </UButton>
    </div>
  </div>
</template>