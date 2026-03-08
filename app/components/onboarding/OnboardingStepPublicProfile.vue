<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'
import type { OnboardingPublicProfileData, OnboardingPublicProfileErrors } from '~/composables/useOnboardingState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

const props = defineProps<{
  model: OnboardingPublicProfileData
  errors: OnboardingPublicProfileErrors
  isValid: boolean
}>()

const {
  textareaUi,
  floatingLabelBaseClass,
  floatingLabelSurfaceClass
} = useDashboardFormUi()

const PUBLIC_NAME_MAX = 60
const HEADLINE_MAX = 100
const LOCATION_MAX = 80
const PUBLIC_EMAIL_MAX = 120
const LINKEDIN_MAX = 120
const GITHUB_MAX = 120
const BIO_MAX = 500

const bioTextareaUi = {
  ...textareaUi,
  base: `${textareaUi.base} resize-none overflow-y-auto min-h-[10rem] max-h-[10rem]`
}

props.model.publicName = props.model.publicName.slice(0, PUBLIC_NAME_MAX)
props.model.headline = props.model.headline.slice(0, HEADLINE_MAX)
props.model.location = props.model.location.slice(0, LOCATION_MAX)
props.model.publicEmail = props.model.publicEmail.slice(0, PUBLIC_EMAIL_MAX)
props.model.linkedin = props.model.linkedin.slice(0, LINKEDIN_MAX)
props.model.github = props.model.github.slice(0, GITHUB_MAX)
props.model.bio = props.model.bio.slice(0, BIO_MAX)

const counters = computed(() => ({
  publicName: `${props.model.publicName.length}/${PUBLIC_NAME_MAX}`,
  headline: `${props.model.headline.length}/${HEADLINE_MAX}`,
  location: `${props.model.location.length}/${LOCATION_MAX}`,
  publicEmail: `${props.model.publicEmail.length}/${PUBLIC_EMAIL_MAX}`,
  linkedin: `${props.model.linkedin.length}/${LINKEDIN_MAX}`,
  github: `${props.model.github.length}/${GITHUB_MAX}`,
  bio: `${props.model.bio.length}/${BIO_MAX}`
}))
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
      <div class="min-w-0 space-y-2">
        <DashboardFloatingInput
          v-model="model.publicName"
          label="Nome público"
          icon="i-lucide-user-round"
          autocomplete="name"
          :maxlength="PUBLIC_NAME_MAX"
        />
        <div class="flex min-h-5 items-start justify-between gap-3">
          <p v-if="errors.publicName" class="text-sm text-red-500">
            {{ errors.publicName }}
          </p>
          <span class="ml-auto shrink-0 text-xs text-muted">
            {{ counters.publicName }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <DashboardFloatingInput
          v-model="model.headline"
          label="Headline"
          icon="i-lucide-briefcase-business"
          autocomplete="organization-title"
          :maxlength="HEADLINE_MAX"
        />
        <div class="flex min-h-5 items-start justify-between gap-3">
          <p v-if="errors.headline" class="text-sm text-red-500">
            {{ errors.headline }}
          </p>
          <span class="ml-auto shrink-0 text-xs text-muted">
            {{ counters.headline }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <DashboardFloatingInput
          v-model="model.location"
          label="Localização"
          icon="i-lucide-map-pin"
          autocomplete="address-level2"
          :maxlength="LOCATION_MAX"
        />
        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.location }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <DashboardFloatingInput
          v-model="model.publicEmail"
          label="E-mail público"
          icon="i-lucide-mail"
          type="email"
          autocomplete="email"
          :maxlength="PUBLIC_EMAIL_MAX"
        />
        <div class="flex min-h-5 items-start justify-between gap-3">
          <p v-if="errors.publicEmail" class="text-sm text-red-500">
            {{ errors.publicEmail }}
          </p>
          <span class="ml-auto shrink-0 text-xs text-muted">
            {{ counters.publicEmail }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <DashboardFloatingInput
          v-model="model.linkedin"
          label="LinkedIn"
          icon="i-lucide-link"
          autocomplete="url"
          :maxlength="LINKEDIN_MAX"
        />
        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.linkedin }}
          </span>
        </div>
      </div>

      <div class="min-w-0 space-y-2">
        <DashboardFloatingInput
          v-model="model.github"
          label="GitHub"
          icon="i-lucide-github"
          autocomplete="url"
          :maxlength="GITHUB_MAX"
        />
        <div class="flex min-h-5 justify-end">
          <span class="shrink-0 text-xs text-muted">
            {{ counters.github }}
          </span>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <div class="relative">
        <UTextarea
          v-model="model.bio"
          :rows="5"
          :maxlength="BIO_MAX"
          :placeholder="' '"
          class="w-full"
          :ui="bioTextareaUi"
        />
        <label :class="[floatingLabelBaseClass, 'start-3']">
          <span :class="floatingLabelSurfaceClass">
            Bio pública
          </span>
        </label>
      </div>

      <div class="flex min-h-5 items-start justify-between gap-3">
        <p v-if="errors.bio" class="text-sm text-red-500">
          {{ errors.bio }}
        </p>
        <span class="ml-auto shrink-0 text-xs text-muted">
          {{ counters.bio }}
        </span>
      </div>
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