<script setup lang="ts">
import type { AccountData } from '~/composables/usePerfilState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

const props = defineProps<{ model: AccountData }>()

function formatDateTime(value: string) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

function formatPlan(value: AccountData['plan']) {
  if (value === 'plus') {
    return 'Plus'
  }

  if (value === 'pro') {
    return 'Pro'
  }

  return 'Free'
}

function formatOnboardingStatus(value: AccountData['onboardingStatus']) {
  if (value === 'completed') {
    return 'Concluído'
  }

  if (value === 'in_progress') {
    return 'Em andamento'
  }

  return 'Não iniciado'
}

function formatPublicationStatus(value: AccountData['publicationStatus']) {
  return value === 'published' ? 'Publicado' : 'Draft'
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h2 class="text-base font-semibold">Dados internos da conta</h2>
      <p class="text-sm text-muted">
        Esta aba mostra o estado real da conta, do onboarding e da publicação mínima já integrada ao backend.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-lock-keyhole"
      title="Leitura real da conta"
      description="E-mail, plano, onboarding, slug e template vêm do backend. Alteração de segurança e billing entram em fluxos próprios."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <DashboardFloatingInput
        :model-value="props.model.email || '—'"
        type="email"
        label="E-mail de acesso"
        icon="i-lucide-mail"
        disabled
      />

      <DashboardFloatingInput
        :model-value="props.model.username || '—'"
        label="Usuário"
        icon="i-lucide-at-sign"
        disabled
      />

      <div class="sm:col-span-2">
        <DashboardFloatingInput
          :model-value="props.model.accountId || '—'"
          label="ID da conta"
          icon="i-lucide-fingerprint"
          disabled
        />
      </div>

      <DashboardFloatingInput
        :model-value="formatPlan(props.model.plan)"
        label="Plano"
        icon="i-lucide-credit-card"
        disabled
      />

      <DashboardFloatingInput
        :model-value="formatOnboardingStatus(props.model.onboardingStatus)"
        label="Status do onboarding"
        icon="i-lucide-list-checks"
        disabled
      />

      <DashboardFloatingInput
        :model-value="props.model.publicSlug || '—'"
        label="Slug público"
        icon="i-lucide-link-2"
        disabled
      />

      <DashboardFloatingInput
        :model-value="formatPublicationStatus(props.model.publicationStatus)"
        label="Publicação"
        icon="i-lucide-send"
        disabled
      />

      <div class="sm:col-span-2">
        <DashboardFloatingInput
          :model-value="props.model.templateId || 'Nenhum template salvo'"
          label="Template atual"
          icon="i-lucide-layout-template"
          disabled
        />
      </div>

      <DashboardFloatingInput
        :model-value="formatDateTime(props.model.createdAt)"
        label="Conta criada em"
        icon="i-lucide-calendar-plus"
        disabled
      />

      <DashboardFloatingInput
        :model-value="formatDateTime(props.model.lastSignInAt)"
        label="Último acesso"
        icon="i-lucide-history"
        disabled
      />
    </div>
  </div>
</template>