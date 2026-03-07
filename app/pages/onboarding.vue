<script setup lang="ts">
import { computed } from 'vue'
import type { OnboardingStepId } from '~/composables/useOnboardingState'
import { useOnboardingState } from '~/composables/useOnboardingState'
import OnboardingStepAccount from '~/components/onboarding/OnboardingStepAccount.vue'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Onboarding'
})

const toast = useToast()

const {
  activeStep,
  account,
  accountErrors,
  accountIsValid,
  currentIndex,
  currentStep,
  currentStepIsValid,
  finished,
  isLastStep,
  progressValue,
  steps,
  stepperItems,
  canGoPrev,
  nextStep,
  prevStep,
  skipStep,
  finishOnboarding,
  resetOnboarding,
  isStepCompleted
} = useOnboardingState()

const isAccountStep = computed(() => currentStep.value.id === 'account')

function handleNext() {
  if (!currentStepIsValid.value) {
    toast.add({
      title: 'Complete a etapa atual',
      description: 'Preencha os campos obrigatórios antes de seguir no onboarding.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })

    return
  }

  if (isLastStep.value) {
    const done = finishOnboarding()

    if (!done) return

    toast.add({
      title: 'Onboarding concluído',
      description: 'A shell inicial foi concluída. Na próxima etapa entram os campos reais restantes.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    return
  }

  nextStep()
}

function handleSkip() {
  const skipped = skipStep()

  if (!skipped) return

  toast.add({
    title: 'Etapa pulada',
    description: 'O fluxo avançou e poderá ser completado depois no painel.',
    color: 'neutral',
    icon: 'i-lucide-forward'
  })
}

function handleReset() {
  resetOnboarding()

  toast.add({
    title: 'Onboarding reiniciado',
    description: 'A shell voltou para a primeira etapa.',
    color: 'neutral',
    icon: 'i-lucide-rotate-ccw'
  })
}

function handleStepClick(stepId: string | number | undefined) {
  if (!stepId || typeof stepId !== 'string') return
  activeStep.value = stepId as OnboardingStepId
}
</script>

<template>
  <div class="min-h-screen bg-[var(--dashboard-app-bg)]">
    <header class="dashboard-topbar-shell sticky top-0 z-20">
      <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-3) shadow-(--dashboard-shadow-xs)"
          >
            <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
          </div>

          <div class="min-w-0">
            <p class="text-xs text-muted">Primeiro acesso</p>
            <p class="truncate text-sm font-medium">Onboarding</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            to="/dashboard"
            color="neutral"
            variant="ghost"
            class="hidden sm:inline-flex"
          >
            Continuar depois
          </UButton>

          <UColorModeButton />
        </div>
      </div>
    </header>

    <main class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto w-full max-w-7xl">
        <UPage>
          <UPageHeader
            headline="Onboarding"
            title="Vamos montar a base inicial do seu espaço"
            description="Agora a primeira etapa já recebe os dados reais da conta, mantendo o restante do fluxo preparado para os próximos passos."
          />

          <UPageBody class="space-y-6">
            <UAlert
              v-if="finished"
              class="dashboard-note-alert"
              icon="i-lucide-circle-check"
              title="Fluxo inicial concluído"
              description="A shell do onboarding já está pronta. As próximas etapas vão preencher os outros passos com os campos reais."
              color="success"
              variant="outline"
            />

            <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div class="space-y-6">
                <div class="dashboard-card-shell rounded-2xl p-4 sm:p-5">
                  <div class="space-y-4">
                    <UStepper
                      v-model="activeStep"
                      :items="stepperItems"
                      value-key="value"
                      size="sm"
                      color="primary"
                      class="w-full"
                      @update:model-value="handleStepClick"
                    />

                    <UProgress
                      :model-value="progressValue"
                      status
                      size="sm"
                    />
                  </div>
                </div>

                <div class="dashboard-card-shell dashboard-form-surface-3 rounded-2xl p-4 sm:p-6">
                  <div class="space-y-6">
                    <div class="space-y-2">
                      <div class="flex flex-wrap items-center gap-2">
                        <UBadge color="primary" variant="subtle">
                          Etapa {{ currentIndex + 1 }} de {{ steps.length }}
                        </UBadge>

                        <UBadge
                          :color="currentStep.required ? 'warning' : 'neutral'"
                          variant="soft"
                        >
                          {{ currentStep.required ? 'Obrigatória' : 'Opcional' }}
                        </UBadge>
                      </div>

                      <p class="text-sm text-muted">
                        {{ currentStep.eyebrow }}
                      </p>

                      <h2 class="text-2xl font-semibold leading-tight">
                        {{ currentStep.headline }}
                      </h2>

                      <p class="text-sm text-muted">
                        {{ currentStep.body }}
                      </p>
                    </div>

                    <OnboardingStepAccount
                      v-if="isAccountStep"
                      :model="account"
                      :errors="accountErrors"
                      :is-valid="accountIsValid"
                    />

                    <template v-else>
                      <div class="grid gap-4 md:grid-cols-2">
                        <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-sm font-medium">Pode pular</p>
                          <p class="mt-1 text-sm text-muted">
                            {{ currentStep.canSkip ? 'Sim, esta etapa poderá ser completada depois no painel.' : 'Não, esta etapa precisa existir antes de avançar.' }}
                          </p>
                        </div>

                        <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-sm font-medium">Destino futuro</p>
                          <p class="mt-1 text-sm text-muted">
                            Esta shell prepara o fluxo entre autenticação, onboarding e dashboard.
                          </p>
                        </div>
                      </div>

                      <UAlert
                        class="dashboard-note-alert"
                        icon="i-lucide-layout-template"
                        title="Escopo desta etapa"
                        description="O conteúdo real desta etapa entra nas próximas partes do desenvolvimento."
                        color="neutral"
                        variant="outline"
                      />

                      <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-5">
                        <div class="space-y-2">
                          <p class="text-base font-semibold">{{ currentStep.title }}</p>
                          <p class="text-sm text-muted">
                            {{ currentStep.description }}
                          </p>
                        </div>

                        <div class="mt-4 rounded-xl border border-dashed border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
                          <p class="text-sm text-muted">
                            Conteúdo real desta etapa entra no próximo passo do desenvolvimento.
                          </p>
                        </div>
                      </div>
                    </template>

                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <div class="flex flex-wrap gap-3">
                        <UButton
                          color="neutral"
                          variant="outline"
                          :disabled="!canGoPrev"
                          @click="prevStep"
                        >
                          Voltar
                        </UButton>

                        <UButton
                          v-if="currentStep.canSkip"
                          color="neutral"
                          variant="ghost"
                          @click="handleSkip"
                        >
                          Pular por agora
                        </UButton>
                      </div>

                      <div class="flex flex-wrap gap-3">
                        <UButton
                          to="/dashboard"
                          color="neutral"
                          variant="ghost"
                          class="sm:hidden"
                        >
                          Continuar depois
                        </UButton>

                        <UButton
                          color="primary"
                          @click="handleNext"
                        >
                          {{ isLastStep ? 'Concluir onboarding' : 'Próxima etapa' }}
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="dashboard-card-shell rounded-2xl p-4 sm:p-5">
                  <div class="space-y-4">
                    <div class="space-y-1">
                      <h2 class="text-base font-semibold">Resumo do fluxo</h2>
                      <p class="text-sm text-muted">
                        Estrutura inicial das etapas antes de conectar autenticação, persistência e os dados finais do portfólio.
                      </p>
                    </div>

                    <div class="space-y-3">
                      <div
                        v-for="step in steps"
                        :key="step.id"
                        class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4"
                      >
                        <div class="flex items-start gap-3">
                          <div class="mt-0.5">
                            <UIcon
                              :name="isStepCompleted(step.id) ? 'i-lucide-circle-check' : step.icon"
                              class="size-5 text-primary"
                            />
                          </div>

                          <div class="min-w-0 space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                              <p class="font-medium">{{ step.title }}</p>

                              <UBadge
                                v-if="activeStep === step.id"
                                color="primary"
                                variant="subtle"
                              >
                                Atual
                              </UBadge>
                            </div>

                            <p class="text-sm text-muted">
                              {{ step.description }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="dashboard-card-shell rounded-2xl p-4 sm:p-5">
                  <div class="space-y-3">
                    <div class="space-y-1">
                      <h2 class="text-base font-semibold">Prévia da conta</h2>
                      <p class="text-sm text-muted">
                        Resumo rápido do primeiro passo real do onboarding.
                      </p>
                    </div>

                    <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                      <p class="text-xs uppercase tracking-wide text-muted">E-mail</p>
                      <p class="mt-1 break-all text-sm font-medium">
                        {{ account.email || 'Não informado' }}
                      </p>
                    </div>

                    <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                      <p class="text-xs uppercase tracking-wide text-muted">Usuário</p>
                      <p class="mt-1 text-sm font-medium">
                        {{ account.username || 'Não informado' }}
                      </p>
                    </div>

                    <UAlert
                      class="dashboard-note-alert"
                      :icon="accountIsValid ? 'i-lucide-circle-check' : 'i-lucide-info'"
                      :title="accountIsValid ? 'Conta pronta' : 'Conta pendente'"
                      :description="accountIsValid ? 'Os dados mínimos da conta já permitem seguir para a próxima etapa.' : 'Faltam dados obrigatórios para liberar o próximo passo.'"
                      :color="accountIsValid ? 'success' : 'warning'"
                      variant="outline"
                    />
                  </div>
                </div>

                <UAlert
                  class="dashboard-note-alert"
                  icon="i-lucide-info"
                  title="Completar depois"
                  description="O onboarding pode guiar a primeira configuração sem impedir que o usuário termine partes restantes depois no dashboard."
                  color="neutral"
                  variant="outline"
                />

                <div class="dashboard-card-shell rounded-2xl p-4 sm:p-5">
                  <UButton
                    block
                    color="neutral"
                    variant="outline"
                    @click="handleReset"
                  >
                    Reiniciar shell
                  </UButton>
                </div>
              </div>
            </div>
          </UPageBody>
        </UPage>
      </div>
    </main>
  </div>
</template>