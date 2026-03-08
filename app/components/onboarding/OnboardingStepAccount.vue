<script setup lang="ts">
//  =========== Tipos Legados ================
//  ----------- Compatibilidade do Typecheck --------------

type LegacyOnboardingAccountData = {
  email: string
  username: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  acceptUpdates: boolean
}

type LegacyOnboardingAccountErrors = Partial<Record<keyof LegacyOnboardingAccountData, string>>

defineProps<{
  model: LegacyOnboardingAccountData
  errors: LegacyOnboardingAccountErrors
  isValid: boolean
}>()
</script>

<template>
  <div class="space-y-4">
    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-info"
      title="Etapa Conta legada"
      description="Este componente foi mantido apenas para compatibilidade do typecheck. O fluxo atual do onboarding não usa mais esta etapa como parte principal."
      color="neutral"
      variant="outline"
    />
  </div>
</template>