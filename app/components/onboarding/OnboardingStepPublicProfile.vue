<script setup lang="ts">
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'
import type { OnboardingPublicProfileData, OnboardingPublicProfileErrors } from '~/composables/useOnboardingState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

defineProps<{
  model: OnboardingPublicProfileData
  errors: OnboardingPublicProfileErrors
  isValid: boolean
}>()

const {
  textareaUi,
  floatingLabelBaseClass,
  floatingLabelSurfaceClass
} = useDashboardFormUi()
</script>

<template>
  <div class="space-y-6">
    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-id-card"
      title="Dados desta etapa"
      description="Aqui entram apenas os dados públicos que depois alimentam o portfólio e os templates."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <DashboardFloatingInput
          v-model="model.publicName"
          label="Nome público"
          icon="i-lucide-user-round"
          autocomplete="name"
        />
        <p v-if="errors.publicName" class="text-sm text-red-500">{{ errors.publicName }}</p>
      </div>

      <div class="space-y-2">
        <DashboardFloatingInput
          v-model="model.headline"
          label="Headline"
          icon="i-lucide-briefcase-business"
          autocomplete="organization-title"
        />
        <p v-if="errors.headline" class="text-sm text-red-500">{{ errors.headline }}</p>
      </div>

      <DashboardFloatingInput
        v-model="model.location"
        label="Localização"
        icon="i-lucide-map-pin"
        autocomplete="address-level2"
      />

      <div class="space-y-2">
        <DashboardFloatingInput
          v-model="model.publicEmail"
          label="E-mail público"
          icon="i-lucide-mail"
          type="email"
          autocomplete="email"
        />
        <p v-if="errors.publicEmail" class="text-sm text-red-500">{{ errors.publicEmail }}</p>
      </div>

      <DashboardFloatingInput
        v-model="model.linkedin"
        label="LinkedIn"
        icon="i-lucide-link"
        autocomplete="url"
      />

      <DashboardFloatingInput
        v-model="model.github"
        label="GitHub"
        icon="i-lucide-github"
        autocomplete="url"
      />
    </div>

    <div class="space-y-2">
      <div class="relative">
        <UTextarea
          v-model="model.bio"
          :rows="5"
          :placeholder="' '"
          class="w-full"
          :ui="textareaUi"
        />
        <label :class="[floatingLabelBaseClass, 'start-3']">
          <span :class="floatingLabelSurfaceClass">
            Bio pública
          </span>
        </label>
      </div>
      <p v-if="errors.bio" class="text-sm text-red-500">{{ errors.bio }}</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <p class="text-sm font-medium">Vai para o portfólio</p>
        <p class="mt-1 text-sm text-muted">
          Nome público, headline, bio, localização, links públicos e e-mail público.
        </p>
      </div>

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <p class="text-sm font-medium">Pode ajustar depois</p>
        <p class="mt-1 text-sm text-muted">
          Tudo o que for preenchido aqui poderá ser refinado no painel depois, sem mexer na conta.
        </p>
      </div>
    </div>

    <UAlert
      :icon="isValid ? 'i-lucide-circle-check' : 'i-lucide-info'"
      :title="isValid ? 'Perfil público pronto para avançar' : 'Preencha os dados públicos obrigatórios'"
      :description="isValid ? 'A apresentação pública mínima já está consistente para seguir no onboarding.' : 'Conclua nome público, headline e bio para liberar a próxima etapa.'"
      :color="isValid ? 'success' : 'warning'"
      variant="outline"
      class="dashboard-note-alert"
    />
  </div>
</template>