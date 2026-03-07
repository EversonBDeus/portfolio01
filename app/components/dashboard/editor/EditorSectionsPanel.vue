<script setup lang="ts">
import type { EditorSectionListItem } from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'

defineProps<{
  sections: EditorSectionListItem[]
  activeSection: EditorSectionId
}>()

defineEmits<{
  select: [sectionId: EditorSectionId]
  toggle: [sectionId: EditorSectionId]
}>()
</script>

<template>
  <div class="space-y-4">
    <!--  =========== Cabeçalho do Painel ================ -->
    <!--  ----------- Resumo das Seções -------------- -->

    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <p class="font-medium">Seções do editor</p>
      <p class="mt-1 text-sm text-muted">
        Nesta etapa você controla a base visual do template e quais blocos aparecem no preview.
      </p>
    </div>

    <!--  =========== Lista de Seções ================ -->
    <!--  ----------- Hero, Sobre, Projetos e Contato -------------- -->

    <div class="space-y-3">
      <article
        v-for="section in sections"
        :key="section.id"
        class="dashboard-form-surface-3 rounded-2xl border p-4 shadow-(--dashboard-shadow-xs)"
        :class="[
          activeSection === section.id
            ? 'border-(--dashboard-border-strong) bg-(--dashboard-surface-3)'
            : 'border-(--dashboard-border-soft) bg-(--dashboard-surface-2)'
        ]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 space-y-2">
            <div class="flex items-center gap-2">
              <UIcon :name="section.icon" class="size-4 shrink-0 text-primary" />
              <p class="font-medium">{{ section.label }}</p>
            </div>

            <p class="text-sm text-muted">
              {{ section.description }}
            </p>
          </div>

          <UBadge
            :color="section.enabled ? 'success' : 'neutral'"
            variant="soft"
          >
            {{ section.enabled ? 'Visível' : 'Oculta' }}
          </UBadge>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <UButton
            size="sm"
            :variant="activeSection === section.id ? 'solid' : 'outline'"
            :color="activeSection === section.id ? 'primary' : 'neutral'"
            icon="i-lucide-pen-square"
            @click="$emit('select', section.id)"
          >
            Editar seção
          </UButton>

          <UButton
            size="sm"
            :variant="section.enabled ? 'outline' : 'solid'"
            :color="section.enabled ? 'neutral' : 'warning'"
            :icon="section.enabled ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            @click="$emit('toggle', section.id)"
          >
            {{ section.enabled ? 'Ocultar' : 'Mostrar' }}
          </UButton>
        </div>
      </article>
    </div>
  </div>
</template>