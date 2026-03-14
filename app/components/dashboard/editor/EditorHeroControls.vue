<script setup lang="ts">
import { computed } from 'vue'
import type { EditorHeroForm } from '~/composables/useEditorState'

const props = withDefaults(defineProps<{
  modelValue: EditorHeroForm
  embedded?: boolean
}>(), {
  embedded: false
})

const emit = defineEmits<{
  'update:modelValue': [value: EditorHeroForm]
  reset: []
}>()

const rootClass = computed(() => {
  return props.embedded
    ? 'space-y-6'
    : 'dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)'
})

function updateField(field: keyof EditorHeroForm, value: string | number | undefined) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: String(value ?? '')
  })
}
</script>

<template>
  <div :class="rootClass">
    <!--  =========== Cabeçalho da Hero ================ -->
    <!--  ----------- Contexto da Edição -------------- -->

    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="primary" variant="subtle">
          Hero
        </UBadge>

        <UBadge color="neutral" variant="soft">
          Preview em tempo real
        </UBadge>
      </div>

      <div class="space-y-1">
        <p class="text-sm font-medium">
          Informações principais do topo do template
        </p>

        <p class="text-sm text-muted">
          Ajuste os dados que aparecem primeiro no preview sem sobrescrever a base original do onboarding nesta etapa.
        </p>
      </div>
    </div>

    <!--  =========== Campos da Hero ================ -->
    <!--  ----------- Nome, Headline, Cargo e Skills -------------- -->

    <div class="grid gap-5 xl:grid-cols-2">
      <UFormField class="w-full" size="xl" label="Nome público">
        <UInput
          :model-value="modelValue.publicName"
          class="w-full"
          size="xl"
          color="primary"
          variant="subtle"
          placeholder="Seu nome público"
          @update:model-value="updateField('publicName', $event)"
        />
      </UFormField>

      <UFormField class="w-full" size="xl" label="Frase de destaque">
        <UInput
          :model-value="modelValue.headline"
          class="w-full"
          size="xl"
          color="primary"
          variant="subtle"
          placeholder="Sua frase de destaque principal"
          @update:model-value="updateField('headline', $event)"
        />
      </UFormField>

      <UFormField class="w-full" size="xl" label="Título / cargo">
        <UInput
          :model-value="modelValue.roleTitle"
          class="w-full"
          size="xl"
          color="primary"
          variant="subtle"
          placeholder="Seu cargo principal"
          @update:model-value="updateField('roleTitle', $event)"
        />
      </UFormField>

      <UFormField class="w-full" size="xl" label="Localização">
        <UInput
          :model-value="modelValue.location"
          class="w-full"
          size="xl"
          color="primary"
          variant="subtle"
          placeholder="Cidade, estado ou país"
          @update:model-value="updateField('location', $event)"
        />
      </UFormField>

      <UFormField
        class="w-full xl:col-span-2"
        size="xl"
        label="Competências em destaque"
        description="Separe por vírgula. O preview usa até 6 itens."
      >
        <UTextarea
          :model-value="modelValue.skillsText"
          class="w-full"
          :rows="4"
          :maxrows="8"
          autoresize
          size="xl"
          color="primary"
          variant="subtle"
          placeholder="Nuxt, Vue, UI Design, TypeScript, UX, Front-end"
          @update:model-value="updateField('skillsText', $event)"
        />
      </UFormField>
    </div>

    <!--  =========== Apoio e Ação ================ -->
    <!--  ----------- Informação Local e Reset -------------- -->

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
        <div class="flex items-start gap-3">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2)">
            <UIcon name="i-lucide-wand-sparkles" class="size-4 text-primary" />
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium">
              Edição local do editor
            </p>

            <p class="text-sm text-muted">
              As alterações aqui atualizam o preview imediatamente, sem salvar no onboarding ainda.
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
        Restaurar Hero
      </UButton>
    </div>
  </div>
</template>