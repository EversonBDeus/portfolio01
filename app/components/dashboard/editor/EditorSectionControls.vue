<script setup lang="ts">
import EditorAboutControls from '~/components/dashboard/editor/EditorAboutControls.vue'
import EditorHeroControls from '~/components/dashboard/editor/EditorHeroControls.vue'
import type {
  EditorAboutForm,
  EditorHeroForm
} from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'

const props = defineProps<{
  activeSection: EditorSectionId
  heroForm: EditorHeroForm
  aboutForm: EditorAboutForm
}>()

defineEmits<{
  'update:heroForm': [value: EditorHeroForm]
  'update:aboutForm': [value: EditorAboutForm]
  reset: [sectionId: EditorSectionId]
}>()

const upcomingSectionLabels: Record<EditorSectionId, string> = {
  hero: 'Hero',
  about: 'Sobre',
  projects: 'Projetos',
  contact: 'Contato'
}

const activeSectionLabel = computed(() => upcomingSectionLabels[props.activeSection])
</script>

<template>
  <div class="space-y-4">
    <!--  =========== Cabeçalho dos Controles ================ -->
    <!--  ----------- Seção Ativa -------------- -->

    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <p class="font-medium">Controles da seção</p>
      <p class="mt-1 text-sm text-muted">
        Você está editando: {{ activeSectionLabel }}.
      </p>
    </div>

    <!--  =========== Controles Editáveis ================ -->
    <!--  ----------- Hero e Sobre -------------- -->

    <EditorHeroControls
      v-if="activeSection === 'hero'"
      :model-value="heroForm"
      @update:model-value="$emit('update:heroForm', $event)"
      @reset="$emit('reset', 'hero')"
    />

    <EditorAboutControls
      v-else-if="activeSection === 'about'"
      :model-value="aboutForm"
      @update:model-value="$emit('update:aboutForm', $event)"
      @reset="$emit('reset', 'about')"
    />

    <!--  =========== Próximas Seções ================ -->
    <!--  ----------- Projetos e Contato -------------- -->

    <div
      v-else
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <UAlert
        class="dashboard-note-alert"
        icon="i-lucide-clock-3"
        title="Controles desta seção entram na próxima etapa"
        :description="`A edição detalhada de ${activeSectionLabel} será adicionada depois da base de Hero e Sobre.`"
        color="neutral"
        variant="outline"
      />
    </div>
  </div>
</template>