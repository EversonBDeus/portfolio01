<script setup lang="ts">
import type { OnboardingAccountData, OnboardingAccountErrors } from '~/composables/useOnboardingState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'
import DashboardFloatingPasswordInput from '~/components/dashboard/profile/DashboardFloatingPasswordInput.vue'

defineProps<{
  model: OnboardingAccountData
  errors: OnboardingAccountErrors
  isValid: boolean
}>()

const checkboxUi = {
  root: 'relative flex items-start',
  container: 'flex items-center',
  base: [
    'rounded-[0.35rem] ring-1 ring-inset overflow-hidden transition-[background,border-color,box-shadow] duration-200',
    'bg-(--dashboard-surface-3)',
    'ring-[var(--dashboard-border-strong)]',
    'data-[state=unchecked]:bg-(--dashboard-surface-3)',
    'data-[state=unchecked]:ring-[var(--dashboard-border-strong)]',
    'data-[state=checked]:bg-primary',
    'data-[state=checked]:ring-primary',
    'shadow-(--dashboard-shadow-xs)',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  ].join(' '),
  indicator: 'flex items-center justify-center size-full text-inverted',
  icon: 'size-full',
  wrapper: 'w-full ms-2',
  label: 'block font-medium text-default',
  description: 'text-muted'
}
</script>

<template>
  <div class="space-y-6">
    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-shield-check"
      title="Dados desta etapa"
      description="Aqui entram apenas os dados da conta. Os dados públicos do portfólio ficam para a próxima etapa."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <DashboardFloatingInput
          v-model="model.email"
          label="E-mail de acesso"
          icon="i-lucide-mail"
          type="email"
          autocomplete="email"
        />
        <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
      </div>

      <div class="space-y-2">
        <DashboardFloatingInput
          v-model="model.username"
          label="Usuário"
          icon="i-lucide-at-sign"
          autocomplete="username"
        />
        <p v-if="errors.username" class="text-sm text-red-500">{{ errors.username }}</p>
      </div>

      <div class="space-y-2">
        <DashboardFloatingPasswordInput
          v-model="model.password"
          label="Senha"
          icon="i-lucide-lock"
          autocomplete="new-password"
        />
        <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
      </div>

      <div class="space-y-2">
        <DashboardFloatingPasswordInput
          v-model="model.confirmPassword"
          label="Confirmar senha"
          icon="i-lucide-badge-check"
          autocomplete="new-password"
        />
        <p v-if="errors.confirmPassword" class="text-sm text-red-500">{{ errors.confirmPassword }}</p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <UCheckbox
          v-model="model.acceptTerms"
          label="Aceito os termos e a política da plataforma"
          color="primary"
          :ui="checkboxUi"
        />
        <p class="mt-2 pl-7 text-sm text-muted">
          Obrigatório para concluir esta etapa do onboarding.
        </p>
        <p v-if="errors.acceptTerms" class="mt-2 pl-7 text-sm text-red-500">
          {{ errors.acceptTerms }}
        </p>
      </div>

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <UCheckbox
          v-model="model.acceptUpdates"
          label="Quero receber atualizações e dicas da plataforma"
          color="primary"
          :ui="checkboxUi"
        />
        <p class="mt-2 pl-7 text-sm text-muted">
          Opcional. Isso poderá ser alterado depois no painel.
        </p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <p class="text-sm font-medium">O que entra agora</p>
        <p class="mt-1 text-sm text-muted">
          E-mail, usuário, senha e preferências básicas de conta.
        </p>
      </div>

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <p class="text-sm font-medium">O que fica para depois</p>
        <p class="mt-1 text-sm text-muted">
          Nome público, headline, bio, contatos e conteúdo do portfólio entram na próxima etapa.
        </p>
      </div>
    </div>

    <UAlert
      :icon="isValid ? 'i-lucide-circle-check' : 'i-lucide-info'"
      :title="isValid ? 'Etapa pronta para avançar' : 'Preencha os dados obrigatórios para continuar'"
      :description="isValid ? 'A conta inicial já está consistente para seguir no fluxo.' : 'Conclua os campos obrigatórios e aceite os termos para liberar a próxima etapa.'"
      :color="isValid ? 'success' : 'warning'"
      variant="outline"
      class="dashboard-note-alert"
    />
  </div>
</template>