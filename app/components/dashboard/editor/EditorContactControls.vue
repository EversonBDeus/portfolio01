<script setup lang="ts">
import { computed } from 'vue'
import type { EditorContactForm } from '~/composables/useEditorState'

//  =========== Props e Emits ================
//  ----------- Estado do Contato --------------

const props = withDefaults(defineProps<{
  modelValue: EditorContactForm
  embedded?: boolean
}>(), {
  embedded: false
})

const emit = defineEmits<{
  'update:modelValue': [value: EditorContactForm]
  reset: []
}>()

//  =========== Limites dos Campos ================
//  ----------- Maxlength --------------

const PUBLIC_EMAIL_MAX = 120
const WHATSAPP_MAX = 24
const WEBSITE_MAX = 120
const LINKEDIN_MAX = 120
const GITHUB_MAX = 120

//  =========== Shell do Bloco ================
//  ----------- Layout Base --------------

const rootClass = computed(() => {
  return props.embedded
    ? 'space-y-6'
    : 'dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)'
})

//  =========== Contadores ================
//  ----------- UX dos Campos --------------

const counters = computed(() => ({
  publicEmail: `${props.modelValue.publicEmail.length}/${PUBLIC_EMAIL_MAX}`,
  whatsapp: `${props.modelValue.whatsapp.length}/${WHATSAPP_MAX}`,
  website: `${props.modelValue.website.length}/${WEBSITE_MAX}`,
  linkedin: `${props.modelValue.linkedin.length}/${LINKEDIN_MAX}`,
  github: `${props.modelValue.github.length}/${GITHUB_MAX}`
}))

//  =========== Atualização dos Campos ================
//  ----------- Estado Reativo --------------

function updateField(field: keyof EditorContactForm, value: string | number | undefined) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: String(value ?? '')
  })
}
</script>

<template>
  <div :class="rootClass">
    <!--  =========== Cabeçalho do Contato ================ -->
    <!--  ----------- Contexto da Edição -------------- -->

    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="primary" variant="subtle">
          Contato
        </UBadge>

        <UBadge color="neutral" variant="soft">
          Links públicos
        </UBadge>
      </div>

      <div class="space-y-1">
        <p class="text-sm font-medium">
          Canais públicos exibidos na seção Contato do template
        </p>

        <p class="text-sm text-muted">
          Ajuste e-mail, website e links principais sem sobrescrever a base original do onboarding nesta etapa.
        </p>
      </div>
    </div>

    <!--  =========== Campos do Contato ================ -->
    <!--  ----------- E-mail, WhatsApp e Links -------------- -->

    <div class="grid gap-5 xl:grid-cols-2">
      <div class="min-w-0 space-y-2">
        <UFormField
          class="w-full"
          size="xl"
          label="E-mail público"
          description="Esse e-mail aparece como canal público de contato."
        >
          <UInput
            :model-value="modelValue.publicEmail"
            class="w-full"
            size="xl"
            color="primary"
            variant="subtle"
            type="email"
            maxlength="120"
            placeholder="contato@seudominio.com"
            @update:model-value="updateField('publicEmail', $event)"
          />
        </UFormField>

        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.publicEmail }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <UFormField
          class="w-full"
          size="xl"
          label="WhatsApp"
          description="Opcional. Pode usar número com DDI ou só os dígitos principais."
        >
          <UInput
            :model-value="modelValue.whatsapp"
            class="w-full"
            size="xl"
            color="primary"
            variant="subtle"
            maxlength="24"
            spellcheck="false"
            placeholder="+55 67 99999-9999"
            @update:model-value="updateField('whatsapp', $event)"
          />
        </UFormField>

        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.whatsapp }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2 xl:col-span-2">
        <UFormField
          class="w-full"
          size="xl"
          label="Website"
          description="Opcional. Pode ser site, portfólio próprio ou link principal."
        >
          <UInput
            :model-value="modelValue.website"
            class="w-full"
            size="xl"
            color="primary"
            variant="subtle"
            type="url"
            maxlength="120"
            spellcheck="false"
            placeholder="https://seudominio.com"
            @update:model-value="updateField('website', $event)"
          />
        </UFormField>

        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.website }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <UFormField
          class="w-full"
          size="xl"
          label="LinkedIn"
        >
          <UInput
            :model-value="modelValue.linkedin"
            class="w-full"
            size="xl"
            color="primary"
            variant="subtle"
            type="url"
            maxlength="120"
            spellcheck="false"
            placeholder="linkedin.com/in/seuperfil"
            @update:model-value="updateField('linkedin', $event)"
          />
        </UFormField>

        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.linkedin }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <UFormField
          class="w-full"
          size="xl"
          label="GitHub"
        >
          <UInput
            :model-value="modelValue.github"
            class="w-full"
            size="xl"
            color="primary"
            variant="subtle"
            type="url"
            maxlength="120"
            spellcheck="false"
            placeholder="github.com/seuusuario"
            @update:model-value="updateField('github', $event)"
          />
        </UFormField>

        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.github }}
          </span>
        </div>
      </div>
    </div>

    <!--  =========== Apoio e Reset ================ -->
    <!--  ----------- Informação Local -------------- -->

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
        <div class="flex items-start gap-3">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2)">
            <UIcon name="i-lucide-send" class="size-4 text-primary" />
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium">
              Preview em tempo real
            </p>

            <p class="text-sm text-muted">
              Os links públicos são refletidos imediatamente na seção Contato do preview.
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
        Restaurar Contato
      </UButton>
    </div>
  </div>
</template>