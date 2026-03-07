<script setup lang="ts">
import { computed } from 'vue'
import type { EditorAboutForm } from '~/composables/useEditorState'

const props = withDefaults(defineProps<{
  modelValue: EditorAboutForm
  embedded?: boolean
}>(), {
  embedded: false
})

const emit = defineEmits<{
  'update:modelValue': [value: EditorAboutForm]
  reset: []
}>()

const rootClass = computed(() => {
  return props.embedded
    ? 'space-y-6'
    : 'dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)'
})

function updateSummary(value: string | number | undefined) {
  emit('update:modelValue', {
    ...props.modelValue,
    summary: String(value ?? '')
  })
}
</script>

<template>
  <div :class="rootClass">
    <!--  =========== Cabeçalho do Sobre ================ -->
    <!--  ----------- Contexto da Edição -------------- -->

    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="primary" variant="subtle">
          Sobre
        </UBadge>

        <UBadge color="neutral" variant="soft">
          Texto principal
        </UBadge>
      </div>

      <div class="space-y-1">
        <p class="text-sm font-medium">
          Resumo profissional exibido no corpo do template
        </p>

        <p class="text-sm text-muted">
          Esse campo alimenta a seção Sobre do preview e ajuda a testar o tom do texto antes da persistência real.
        </p>
      </div>
    </div>

    <!--  =========== Campo do Sobre ================ -->
    <!--  ----------- Resumo Profissional -------------- -->

    <UFormField
      class="w-full"
      size="xl"
      label="Resumo profissional"
      description="Escreva um resumo claro, direto e orientado ao valor que você entrega."
    >
      <UTextarea
        :model-value="modelValue.summary"
        class="w-full"
        :rows="8"
        :maxrows="16"
        autoresize
        size="xl"
        color="primary"
        variant="subtle"
        placeholder="Descreva sua atuação, seus diferenciais, o tipo de problema que você resolve e como entrega valor."
        @update:model-value="updateSummary($event)"
      />
    </UFormField>

    <!--  =========== Apoio e Ação ================ -->
    <!--  ----------- Informação Local e Reset -------------- -->

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
        <div class="flex items-start gap-3">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2)">
            <UIcon name="i-lucide-file-pen-line" class="size-4 text-primary" />
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium">
              Preview em tempo real
            </p>

            <p class="text-sm text-muted">
              Você pode ajustar o texto à vontade e conferir o resultado visual no template antes de pensar em validação e persistência.
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
        Restaurar Sobre
      </UButton>
    </div>
  </div>
</template>