<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Editor' })

import EditorPreview from '~/components/dashboard/editor/EditorPreview.vue'
import EditorSectionsPanel from '~/components/dashboard/editor/EditorSectionsPanel.vue'
import { useEditorState } from '~/composables/useEditorState'

const {
  activeSection,
  device,
  hasSelectedTemplate,
  previewData,
  sections,
  selectedTemplate,
  setActiveSection,
  setDevice,
  toggleSection,
  visibility
} = useEditorState()
</script>

<template>
  <div class="space-y-6">
    <!--  =========== Cabeçalho da Página ================ -->
    <!--  ----------- Título e Introdução -------------- -->

    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Editor</h1>
        <p class="text-sm text-muted">
          Base inicial do editor visual conectada ao template atual e aos dados já coletados no onboarding.
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
      description="Aqui fechamos a base do editor visual. Persistência real, reorder, blocos avançados e edição detalhada entram nas próximas fases."
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
      class="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]"
    >
      <div class="space-y-6">
        <div
          class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
        >
          <div class="space-y-3">
            <div class="space-y-1">
              <p class="font-medium">Template atual</p>
              <p class="text-sm text-muted">
                Esta tela já está ligada ao template escolhido na galeria.
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
          @select="setActiveSection"
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
  </div>
</template>