<script setup lang="ts">
import type { UserProfile } from '~/composables/usePerfilState'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'
import { useDashboardThemeUi } from '~/composables/useDashboardThemeUi'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

const props = defineProps<{ model: UserProfile }>()
const emit = defineEmits<{ dirty: [] }>()

const { textareaUi } = useDashboardFormUi()
const { switchUi } = useDashboardThemeUi()

function markDirty() {
  emit('dirty')
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h2 class="text-base font-semibold">Dados públicos do portfólio</h2>
      <p class="text-sm text-muted">
        Estes campos alimentam o template público e, depois, também o editor visual.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-sparkles"
      title="Esses dados são do portfólio"
      description="Aqui ficam nome, headline, bio, contatos e links públicos. Dados internos da conta ficam nas outras abas."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <DashboardFloatingInput
        v-model="props.model.nome"
        label="Nome público"
        icon="i-lucide-user-round"
        autocomplete="name"
        @update:model-value="markDirty"
      />

      <DashboardFloatingInput
        v-model="props.model.location"
        label="Localização"
        icon="i-lucide-map-pin"
        autocomplete="address-level2"
        @update:model-value="markDirty"
      />

      <div class="sm:col-span-2">
        <DashboardFloatingInput
          v-model="props.model.headline"
          label="Título profissional"
          icon="i-lucide-briefcase-business"
          autocomplete="organization-title"
          @update:model-value="markDirty"
        />
      </div>

      <DashboardFloatingInput
        v-model="props.model.publicEmail"
        type="email"
        label="E-mail público"
        icon="i-lucide-mail"
        autocomplete="email"
        @update:model-value="markDirty"
      />

      <DashboardFloatingInput
        v-model="props.model.externalPortfolio"
        label="Link externo do portfólio"
        icon="i-lucide-globe"
        autocomplete="url"
        @update:model-value="markDirty"
      />

      <UFormField label="Bio" class="sm:col-span-2">
        <UTextarea
          v-model="props.model.bio"
          :rows="5"
          class="w-full"
          :ui="textareaUi"
          @update:model-value="markDirty"
        />
      </UFormField>
    </div>

    <USeparator />

    <div class="grid gap-4 lg:grid-cols-2">
      <div
       class="dashboard-form-surface-2 space-y-4 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="space-y-1">
          <p class="font-medium">Ações públicas</p>
          <p class="text-sm text-muted">
            Controle o que poderá aparecer no template sem mexer em assinatura ou segurança.
          </p>
        </div>

        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="text-sm font-medium">Exibir botão de currículo</p>
            <p class="text-xs text-muted">Mostra a ação de download no template.</p>
          </div>

          <USwitch
            v-model="props.model.allowResumeDownload"
            size="lg"
            color="success"
            :ui="switchUi"
            @update:model-value="markDirty"
          />
        </div>

        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="text-sm font-medium">Exibir botões rápidos de contato</p>
            <p class="text-xs text-muted">WhatsApp e Messenger no template, quando preenchidos.</p>
          </div>

          <USwitch
            v-model="props.model.allowContactButtons"
            size="lg"
            color="success"
            :ui="switchUi"
            @update:model-value="markDirty"
          />
        </div>
      </div>

      <div
      class="dashboard-form-surface-2 space-y-4 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="space-y-1">
          <p class="font-medium">Canais de contato</p>
          <p class="text-sm text-muted">
            Estes campos servem para ações rápidas do template e futuras configurações do editor.
          </p>
        </div>

        <DashboardFloatingInput
          v-model="props.model.whatsapp"
          label="WhatsApp"
          icon="i-simple-icons-whatsapp"
          autocomplete="tel"
          @update:model-value="markDirty"
        />

        <DashboardFloatingInput
          v-model="props.model.messenger"
          label="Messenger"
          icon="i-simple-icons-messenger"
          autocomplete="url"
          @update:model-value="markDirty"
        />
      </div>
    </div>

    <USeparator />

    <div class="grid gap-4 sm:grid-cols-2">
      <DashboardFloatingInput
        v-model="props.model.linkedin"
        label="LinkedIn"
        icon="i-simple-icons-linkedin"
        autocomplete="url"
        @update:model-value="markDirty"
      />

      <DashboardFloatingInput
        v-model="props.model.github"
        label="GitHub"
        icon="i-simple-icons-github"
        autocomplete="url"
        @update:model-value="markDirty"
      />

      <div class="sm:col-span-2">
        <DashboardFloatingInput
          v-model="props.model.instagram"
          label="Instagram"
          icon="i-simple-icons-instagram"
          autocomplete="url"
          @update:model-value="markDirty"
        />
      </div>
    </div>
  </div>
</template>