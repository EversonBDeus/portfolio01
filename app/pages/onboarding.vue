<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { OnboardingStepId } from '~/composables/useOnboardingState'
import { useOnboardingPersistence } from '~/composables/useOnboardingPersistence'
import { useOnboardingState } from '~/composables/useOnboardingState'
const {
  loadOnboardingFromServer,
  loadingFromServer,
  saveOnboardingToServer,
  savingToServer
} = useOnboardingPersistence()

const isRemoteBusy = computed(() => loadingFromServer.value || savingToServer.value)
import OnboardingStepProfessional from '~/components/onboarding/OnboardingStepProfessional.vue'
import OnboardingStepProjects from '~/components/onboarding/OnboardingStepProjects.vue'
import OnboardingStepPublicProfile from '~/components/onboarding/OnboardingStepPublicProfile.vue'
import { useOnboardingAccess } from '~/composables/useOnboardingAccess'

//  =========== Configuração da Página ================
//  ----------- Meta do Onboarding --------------

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Onboarding'
})

//  =========== Acesso do Onboarding ================
//  ----------- Início do Fluxo --------------

const router = useRouter()

const { startOnboarding, keepOnboardingInProgress } = useOnboardingAccess()

onMounted(async () => {
  startOnboarding()

  const loaded = await loadOnboardingFromServer(true)

  if (!loaded) {
    toast.add({
      title: 'Modo local temporário',
      description: 'Não foi possível carregar os dados salvos agora. Você ainda pode continuar e tentar salvar novamente.',
      color: 'warning',
      icon: 'i-lucide-cloud-off'
    })
  }
})
//  =========== Estado da Página ================
//  ----------- Composable do Onboarding --------------

const toast = useToast()

const {
  activeStep,
  addProject,
  canGoPrev,
  clearProjectsDraft,
  currentIndex,
  currentStep,
  currentStepIsValid,
  featuredProjectCount,
  finishOnboarding,
  finished,
  isLastStep,
  isStepCompleted,
  professional,
  professionalErrors,
  professionalIsValid,
  progressValue,
  projectCount,
  projects,
  projectsCanAdd,
  projectsErrors,
  publicProfile,
  publicProfileErrors,
  publicProfileIsValid,
  removeProject,
  resetOnboarding,
  skipStep,
  stepperItems,
  steps,
  toggleProjectFeatured,
  prevStep,
  nextStep
} = useOnboardingState()

//  =========== Computeds das Etapas ================
//  ----------- Identificação da Etapa Atual --------------

const isProfileStep = computed(() => currentStep.value.id === 'profile')
const isProfessionalStep = computed(() => currentStep.value.id === 'professional')
const isProjectsStep = computed(() => currentStep.value.id === 'projects')
const isLaunchStep = computed(() => currentStep.value.id === 'launch')
const projectsPreviewItems = computed(() => {
  return projects.value.items.slice(0, 3)
})

const previewValueClass = 'mt-1 min-w-0 text-sm font-medium break-words [overflow-wrap:anywhere]'
const previewEmailClass = 'mt-1 min-w-0 text-sm font-medium break-all'

//  =========== Ações do Fluxo ================
//  ----------- Avançar Etapas --------------

async function handleNext() {
  if (!currentStepIsValid.value) {
    toast.add({
      title: 'Complete a etapa atual',
      description: 'Preencha os campos obrigatórios antes de seguir no onboarding.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })

    return
  }

  const nextStatus = isLastStep.value ? 'completed' : 'in_progress'
  const saved = await saveOnboardingToServer(nextStatus)

  if (!saved) {
    toast.add({
      title: 'Não foi possível salvar',
      description: isLastStep.value
        ? 'Tente novamente antes de concluir o onboarding.'
        : 'Tente novamente antes de avançar para a próxima etapa.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })

    return
  }

  if (isLastStep.value) {
    const done = finishOnboarding()

    if (!done) return

    toast.add({
      title: 'Onboarding concluído',
      description: 'Base inicial salva na sua conta. Abrindo o dashboard.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    await router.push('/dashboard')
    return
  }

  keepOnboardingInProgress()
  nextStep()
}

async function handleSkip() {
  const saved = await saveOnboardingToServer('in_progress')

  if (!saved) {
    toast.add({
      title: 'Não foi possível salvar',
      description: 'Tente novamente antes de pular esta etapa.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })

    return
  }

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
    description: 'O fluxo voltou para a primeira etapa.',
    color: 'neutral',
    icon: 'i-lucide-rotate-ccw'
  })
}
async function handleContinueLater() {
  const saved = await saveOnboardingToServer('in_progress')

  if (!saved) {
    toast.add({
      title: 'Não foi possível salvar',
      description: 'Tente novamente antes de sair do onboarding.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })

    return
  }

  toast.add({
    title: 'Você pode continuar depois',
    description: 'Abrindo o dashboard para concluir o restante no painel.',
    color: 'neutral',
    icon: 'i-lucide-layout-dashboard'
  })

  if (import.meta.client) {
   window.location.assign('/dashboard')
  }
}

function handleStepClick(stepId: string | number | undefined) {
  if (!stepId || typeof stepId !== 'string') return

  activeStep.value = stepId as OnboardingStepId
}
</script>

<template>
  <div class="min-h-screen bg-(--dashboard-app-bg)">
    <!--  =========== Header do Onboarding ================ -->
    <!--  ----------- Navegação Superior -------------- -->

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
                type="button"
                color="neutral"
                variant="ghost"
                class="hidden sm:inline-flex"
                :loading="savingToServer"
                :disabled="isRemoteBusy"
                @click="handleContinueLater"
              >
                Continuar depois
              </UButton>

          <UColorModeButton />
        </div>
      </div>
    </header>

    <!--  =========== Conteúdo do Onboarding ================ -->
    <!--  ----------- Estrutura Principal -------------- -->

    <main class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto w-full max-w-7xl">
        <UPage>
          <UPageHeader
            headline="Onboarding"
            title="Vamos montar a base inicial do seu espaço"
            description="Seu acesso já foi confirmado no cadastro e na verificação. Agora entram apenas os dados complementares do portfólio."
          />

          <UPageBody class="space-y-6">
            <UAlert
              v-if="finished"
              class="dashboard-note-alert"
              icon="i-lucide-circle-check"
              title="Fluxo inicial concluído"
              description="As etapas iniciais do onboarding já estão prontas e você pode continuar refinando tudo depois no painel."
              color="success"
              variant="outline"
            />

            <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <!--  =========== Coluna Principal ================ -->
              <!--  ----------- Stepper e Conteúdo -------------- -->

              <div class="space-y-6">
                <div class="dashboard-card-shell rounded-2xl p-4 sm:p-5">
                  <div class="space-y-4">
                    <UStepper
                      :items="stepperItems"
                      :model-value="activeStep"
                      orientation="horizontal"
                      disabled
                      @update:model-value="handleStepClick"
                    />

                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-sm text-muted">
                        <span>Progresso</span>
                        <span>{{ progressValue }}%</span>
                      </div>

                      <UProgress
                        :model-value="progressValue"
                        status
                        size="sm"
                      />
                    </div>
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

                    <!--  =========== Conteúdo das Etapas ================ -->
                    <!--  ----------- Perfil, Profissional e Projetos -------------- -->

                    <OnboardingStepPublicProfile
                      v-if="isProfileStep"
                      :model="publicProfile"
                      :errors="publicProfileErrors"
                      :is-valid="publicProfileIsValid"
                    />

                    <OnboardingStepProfessional
                      v-else-if="isProfessionalStep"
                      :model="professional"
                      :errors="professionalErrors"
                      :is-valid="professionalIsValid"
                    />

                    <OnboardingStepProjects
                      v-else-if="isProjectsStep"
                      :model="projects"
                      :errors="projectsErrors"
                      :can-add-project="projectsCanAdd"
                      :project-count="projectCount"
                      :featured-project-count="featuredProjectCount"
                      @add-project="addProject"
                      @clear-draft="clearProjectsDraft"
                      @remove-project="removeProject"
                      @toggle-featured="toggleProjectFeatured"
                    />

                    <!--  =========== Etapa Final ================ -->
                    <!--  ----------- Revisão do Onboarding -------------- -->

                    <template v-else-if="isLaunchStep">
                      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-sm font-medium">Perfil público</p>
                          <p class="mt-1 text-sm text-muted">
                            {{ publicProfileIsValid ? 'Apresentação pública pronta.' : 'Ainda existe algo pendente no perfil público.' }}
                          </p>
                        </div>

                        <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-sm font-medium">Profissional</p>
                          <p class="mt-1 text-sm text-muted">
                            {{ professionalIsValid ? 'Base profissional pronta.' : 'Ainda existe algo pendente na base profissional.' }}
                          </p>
                        </div>

                        <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-sm font-medium">Projetos</p>
                          <p class="mt-1 text-sm text-muted">
                            {{ projectCount ? `${projectCount} item(ns) já foram adicionados.` : 'Nenhum projeto foi adicionado nesta etapa.' }}
                          </p>
                        </div>
                      </div>

                      <UAlert
                        class="dashboard-note-alert"
                        icon="i-lucide-rocket"
                        title="Pronto para entrar no painel"
                        description="Você já tem uma base inicial suficiente para continuar dentro do dashboard e refinar tudo depois."
                        color="success"
                        variant="outline"
                      />
                    </template>

                    <!--  =========== Ações do Onboarding ================ -->
                    <!--  ----------- Navegação Inferior -------------- -->

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
                          :disabled="isRemoteBusy"
                          @click="handleSkip"
                        >
                          Pular por agora
                        </UButton>
                      </div>

                      <div class="flex flex-wrap gap-3">
                        <UButton
                          type="button"
                          color="neutral"
                          variant="ghost"
                          :loading="savingToServer"
                          :disabled="isRemoteBusy"
                          @click="handleContinueLater"
                        >
                          Continuar depois
                        </UButton>

                      <UButton
                        color="primary"
                        :loading="savingToServer"
                        :disabled="isRemoteBusy"
                        @click="handleNext"
                      >
                        {{ isLastStep ? 'Concluir e abrir dashboard' : 'Próxima etapa' }}
                      </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--  =========== Coluna Lateral ================ -->
              <!--  ----------- Resumo e Prévia -------------- -->

              <div class="space-y-6">
                <div class="dashboard-card-shell rounded-2xl p-4 sm:p-5">
                  <div class="space-y-4">
                    <div class="space-y-1">
                      <h2 class="text-base font-semibold">Resumo do fluxo</h2>
                      <p class="text-sm text-muted">
                        Estrutura inicial das etapas complementares antes de conectar persistência, autenticação real e os dados finais do portfólio.
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
                  <div class="space-y-3 min-w-0">
                    <div class="space-y-1">
                      <h2 class="text-base font-semibold">Prévia da etapa</h2>
                      <p class="text-sm text-muted">
                        Resumo rápido do passo atual do onboarding.
                      </p>
                    </div>

                    <!--  =========== Prévia do Perfil Público ================ -->
                    <!--  ----------- Resumo da Etapa Perfil Público -------------- -->

                      <template v-if="isProfileStep">
                        <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-xs uppercase tracking-wide text-muted">Nome público</p>
                          <p :class="previewValueClass">
                            {{ publicProfile.publicName || 'Não informado' }}
                          </p>
                        </div>

                        <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-xs uppercase tracking-wide text-muted">Headline</p>
                          <p :class="previewValueClass">
                            {{ publicProfile.headline || 'Não informada' }}
                          </p>
                        </div>

                        <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-xs uppercase tracking-wide text-muted">E-mail público</p>
                          <p :class="previewEmailClass">
                            {{ publicProfile.publicEmail || 'Não informado' }}
                          </p>
                        </div>

                        <UAlert
                          class="dashboard-note-alert"
                          :icon="publicProfileIsValid ? 'i-lucide-circle-check' : 'i-lucide-info'"
                          :title="publicProfileIsValid ? 'Perfil público pronto' : 'Perfil público pendente'"
                          :description="publicProfileIsValid ? 'Os dados públicos mínimos já permitem seguir para a próxima etapa.' : 'Faltam dados públicos obrigatórios para liberar o próximo passo.'"
                          :color="publicProfileIsValid ? 'success' : 'warning'"
                          variant="outline"
                        />
                      </template>

                    <!--  =========== Prévia Profissional ================ -->
                    <!--  ----------- Resumo da Etapa Profissional -------------- -->
                    <template v-else-if="isProfessionalStep">
                      <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                        <p class="text-xs uppercase tracking-wide text-muted">Título / cargo</p>
                        <p :class="previewValueClass">
                          {{ professional.roleTitle || 'Não informado' }}
                        </p>
                      </div>

                      <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                        <p class="text-xs uppercase tracking-wide text-muted">Área de atuação</p>
                        <p :class="previewValueClass">
                          {{ professional.workArea || 'Não informada' }}
                        </p>
                      </div>

                      <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                        <p class="text-xs uppercase tracking-wide text-muted">Nível de experiência</p>
                        <p :class="previewValueClass">
                          {{ professional.experienceLevel || 'Não informado' }}
                        </p>
                      </div>

                      <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                        <p class="text-xs uppercase tracking-wide text-muted">Competências principais</p>

                        <div
                          v-if="professional.mainSkills.length"
                          class="mt-2 flex flex-wrap gap-2"
                        >
                          <UBadge
                            v-for="skill in professional.mainSkills"
                            :key="skill"
                            color="primary"
                            variant="soft"
                            class="max-w-full"
                          >
                            <span class="break-words [overflow-wrap:anywhere]">
                              {{ skill }}
                            </span>
                          </UBadge>
                        </div>

                        <p
                          v-else
                          class="mt-1 text-sm text-muted"
                        >
                          Nenhuma competência selecionada.
                        </p>
                      </div>

                      <UAlert
                        class="dashboard-note-alert"
                        :icon="professionalIsValid ? 'i-lucide-circle-check' : 'i-lucide-info'"
                        :title="professionalIsValid ? 'Base profissional pronta' : 'Base profissional pendente'"
                        :description="professionalIsValid ? 'Os dados profissionais mínimos já permitem seguir para a próxima etapa.' : 'Faltam cargo, resumo, área, senioridade e habilidades para liberar o próximo passo.'"
                        :color="professionalIsValid ? 'success' : 'warning'"
                        variant="outline"
                      />
                    </template>

                    <!--  =========== Prévia dos Projetos ================ -->
                    <!--  ----------- Resumo da Etapa Projetos -------------- -->

                      <template v-else-if="isProjectsStep">
                        <div class="grid gap-3 sm:grid-cols-2">
                          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                            <p class="text-xs uppercase tracking-wide text-muted">Projetos</p>
                            <p class="mt-2 text-2xl font-semibold">{{ projectCount }}</p>
                          </div>

                          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                            <p class="text-xs uppercase tracking-wide text-muted">Em destaque</p>
                            <p class="mt-2 text-2xl font-semibold">{{ featuredProjectCount }}</p>
                          </div>
                        </div>

                        <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                          <p class="text-xs uppercase tracking-wide text-muted">Primeiros itens</p>

                          <div
                            v-if="projectsPreviewItems.length"
                            class="mt-3 space-y-3"
                          >
                            <div
                              v-for="item in projectsPreviewItems"
                              :key="item.id"
                              class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-3"
                            >
                              <div class="flex items-start justify-between gap-2">
                                <div class="min-w-0">
                                  <p class="break-words text-sm font-medium [overflow-wrap:anywhere]">
                                    {{ item.title }}
                                  </p>

                                  <p class="mt-1 break-words text-xs text-muted [overflow-wrap:anywhere]">
                                    {{ item.category }}
                                  </p>
                                </div>

                                <UBadge
                                  v-if="item.featured"
                                  color="success"
                                  variant="soft"
                                >
                                  Destaque
                                </UBadge>
                              </div>

                              <p class="mt-3 whitespace-pre-line break-words text-xs text-muted [overflow-wrap:anywhere]">
                                {{ item.summary }}
                              </p>
                            </div>
                          </div>

                          <p
                            v-else
                            class="mt-2 text-sm text-muted"
                          >
                            Nenhum projeto foi adicionado ainda.
                          </p>
                        </div>

                        <UAlert
                          class="dashboard-note-alert"
                          :icon="projectCount ? 'i-lucide-circle-check' : 'i-lucide-info'"
                          :title="projectCount ? 'Vitrine inicial criada' : 'Etapa ainda vazia'"
                          :description="projectCount ? 'Os primeiros itens do portfólio já estão registrados nesta etapa.' : 'Você pode seguir sem projetos agora e completar isso depois no painel.'"
                          :color="projectCount ? 'success' : 'neutral'"
                          variant="outline"
                        />
                      </template>

                    <!--  =========== Prévia da Finalização ================ -->
                    <!--  ----------- Resumo da Etapa Final -------------- -->

                    <template v-else>
                      <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                        <p class="text-xs uppercase tracking-wide text-muted">Perfil público</p>
                        <p class="mt-1 text-sm font-medium">
                          {{ publicProfileIsValid ? 'Pronto' : 'Pendente' }}
                        </p>
                      </div>

                      <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                        <p class="text-xs uppercase tracking-wide text-muted">Profissional</p>
                        <p class="mt-1 text-sm font-medium">
                          {{ professionalIsValid ? 'Pronto' : 'Pendente' }}
                        </p>
                      </div>

                      <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
                        <p class="text-xs uppercase tracking-wide text-muted">Projetos</p>
                        <p class="mt-1 text-sm font-medium">
                          {{ projectCount ? `${projectCount} item(ns)` : 'Nenhum item' }}
                        </p>
                      </div>
                    </template>
                  </div>
                </div>

                <UAlert
                  class="dashboard-note-alert"
                  icon="i-lucide-info"
                  title="Completar depois"
                  description="O onboarding guia a primeira configuração sem impedir que o usuário termine partes restantes depois no dashboard."
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