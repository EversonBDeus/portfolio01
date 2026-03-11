<script setup lang="ts">
import { computed } from 'vue'
import { useAuthState } from '~/composables/useAuthState'
import { useOnboardingAccess } from '~/composables/useOnboardingAccess'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Redirecionando'
})

const { isAuthenticated } = useAuthState()
const { onboardingCompleted, onboardingStatus } = useOnboardingAccess()

const target = computed(() => {
  if (!isAuthenticated.value) {
    return '/auth/login'
  }

  if (onboardingCompleted.value || onboardingStatus.value === 'in_progress') {
    return '/dashboard'
  }

  return '/onboarding'
})

await navigateTo(target.value, { replace: true })
</script>

<template>
  <div class="mx-auto w-full max-w-[470px] rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(248,250,252,0.92)_100%)] p-5 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-md dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.82)_0%,rgba(15,23,42,0.74)_100%)] dark:text-white dark:shadow-[0_24px_70px_rgba(0,0,0,0.30)] sm:p-6">
    <div class="space-y-3 text-center">
      <UBadge color="primary" variant="subtle">
        Redirecionando
      </UBadge>

      <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
        Esta etapa não faz mais parte do fluxo atual
      </h2>

      <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
        Você será enviado automaticamente para a rota correta da sua conta.
      </p>
    </div>
  </div>
</template>