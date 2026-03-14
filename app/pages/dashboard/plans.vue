<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePlansState } from '~/composables/usePlansState'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Plans' })

const toast = useToast()

const {
  account,
  billingCycle,
  billingEnabled,
  currentPlanCard,
  featureRows,
  getDisplayPrice,
  lastLoadedAt,
  loadPlansFromServer,
  loadingFromServer,
  planActions,
  plans,
  setBillingCycle,
  yearlyDiscountLabel
} = usePlansState()

const currentPlanLabel = computed(() => {
  return currentPlanCard.value?.label ?? 'Free'
})

const currentPlanDescription = computed(() => {
  return currentPlanCard.value?.description ?? 'Plano atual da conta.'
})

const syncDescription = computed(() => {
  if (!lastLoadedAt.value) {
    return 'Consulte aqui as informações disponíveis do seu plano.'
  }

  return `Última sincronização do plano: ${formatDateTime(lastLoadedAt.value)}.`
})

const publicationLabel = computed(() => {
  return account.value.publicationStatus === 'published' ? 'Publicado' : 'Rascunho'
})

const publicationColor = computed(() => {
  return account.value.publicationStatus === 'published' ? 'success' : 'warning'
})

const onboardingLabel = computed(() => {
  if (account.value.onboardingStatus === 'completed') {
    return 'Concluído'
  }

  if (account.value.onboardingStatus === 'in_progress') {
    return 'Em andamento'
  }

  return 'Não iniciado'
})

const onboardingColor = computed(() => {
  if (account.value.onboardingStatus === 'completed') {
    return 'success'
  }

  if (account.value.onboardingStatus === 'in_progress') {
    return 'warning'
  }

  return 'neutral'
})

const billingLabel = computed(() => {
  return billingEnabled.value ? 'Ativo' : 'Planejado'
})

const accountPublicRoute = computed(() => {
  return account.value.publicSlug ? `/p/${account.value.publicSlug}` : 'Nenhum slug salvo ainda'
})

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'data indisponível'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

onMounted(async () => {
  const payload = await loadPlansFromServer()

  if (!payload) {
    toast.add({
      title: 'Não foi possível carregar o plano atual',
      description: 'Tente recarregar a página quando a sessão estiver estável.',
      color: 'warning',
      icon: 'i-lucide-cloud-off'
    })
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Plans</h1>
      <p class="text-sm text-muted">
        Compare os planos da plataforma e acompanhe o plano real salvo atualmente na sua conta.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-database"
      title="Plano atual"
      description="Consulte aqui as informações do seu plano atual."
      color="neutral"
      variant="outline"
    />

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-refresh-cw"
      title="Sincronização da tela"
      :description="syncDescription"
      color="neutral"
      variant="outline"
    />

    <UAlert
      v-if="loadingFromServer"
      class="dashboard-note-alert"
      icon="i-lucide-loader-circle"
      title="Sincronizando plano"
      description="Carregando o plano atual e o resumo real desta conta."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div
        class="dashboard-form-surface-2 space-y-5 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-base font-semibold">Plano atual da conta</h2>

            <UBadge
              color="primary"
              variant="subtle"
            >
              {{ currentPlanLabel }}
            </UBadge>
          </div>

          <p class="text-sm text-muted">
            {{ currentPlanDescription }}
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">E-mail da conta</p>
            <p class="font-medium break-words">
              {{ account.email || '—' }}
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">Usuário</p>
            <p class="font-medium break-words">
              {{ account.username || '—' }}
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-2">
            <p class="text-sm text-muted">Onboarding</p>

            <UBadge
              :color="onboardingColor"
              variant="subtle"
            >
              {{ onboardingLabel }}
            </UBadge>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-2">
            <p class="text-sm text-muted">Publicação</p>

            <UBadge
              :color="publicationColor"
              variant="subtle"
            >
              {{ publicationLabel }}
            </UBadge>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">Template conectado</p>
            <p class="font-medium break-words">
              {{ account.templateId || 'Nenhum template salvo ainda' }}
            </p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-1">
            <p class="text-sm text-muted">Rota pública</p>
            <p class="font-medium break-words">
              {{ accountPublicRoute }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="dashboard-form-surface-2 space-y-4 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
          <h2 class="text-base font-semibold">Plano atual</h2>
          <p class="text-sm text-muted">
            Consulte aqui as informações disponíveis do seu plano.
          </p>
        </div>

        <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-muted">Status do Plano</p>

            <UBadge
              color="neutral"
              variant="subtle"
            >
              {{ billingLabel }}
            </UBadge>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted">Ciclo visual</p>
            <p class="font-medium">
              {{ billingCycle === 'yearly' ? 'Anual' : 'Mensal' }}
            </p>
          </div>

          <div class="space-y-1">
          <p class="text-sm text-muted">Plano atual</p>
          <p class="text-sm text-muted">
            Consulte aqui as informações disponíveis do seu plano. Recursos de assinatura e alteração de plano serão disponibilizados em breve.
          </p>
        </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">Ciclo de comparação</p>
          <p class="text-sm text-muted">
            {{ yearlyDiscountLabel }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            size="sm"
            :variant="billingCycle === 'monthly' ? 'solid' : 'outline'"
            :color="billingCycle === 'monthly' ? 'primary' : 'neutral'"
            @click="setBillingCycle('monthly')"
          >
            Mensal
          </UButton>

          <UButton
            size="sm"
            :variant="billingCycle === 'yearly' ? 'solid' : 'outline'"
            :color="billingCycle === 'yearly' ? 'primary' : 'neutral'"
            @click="setBillingCycle('yearly')"
          >
            Anual
          </UButton>
        </div>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-3">
      <article
        v-for="plan in plans"
        :key="plan.id"
        class="dashboard-form-surface-2 rounded-2xl border p-5 transition"
        :class="[
          plan.highlight
            ? 'border-(--dashboard-border-strong) bg-(--dashboard-surface-3) shadow-(--dashboard-shadow-md)'
            : 'border-(--dashboard-border-soft) bg-(--dashboard-surface-2) shadow-(--dashboard-shadow-xs)'
        ]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold">{{ plan.label }}</h2>

              <UBadge
                v-if="plan.badge"
                color="primary"
                variant="subtle"
              >
                {{ plan.badge }}
              </UBadge>

              <UBadge
                v-if="planActions[plan.id].label === 'Plano atual'"
                color="neutral"
                variant="soft"
              >
                Atual
              </UBadge>
            </div>

            <p class="text-sm text-muted">
              {{ plan.description }}
            </p>
          </div>
        </div>

        <div class="mt-5 space-y-1">
          <p class="text-2xl font-semibold">{{ getDisplayPrice(plan) }}</p>
          <p class="text-xs text-muted">
            Compare os recursos disponíveis em cada plano.
          </p>
        </div>

        <ul class="mt-5 space-y-2">
          <li
            v-for="feature in plan.features"
            :key="`${plan.id}-${feature.key}`"
            class="flex items-start gap-2 text-sm text-muted"
          >
            <UIcon
              name="i-lucide-check"
              class="mt-0.5 shrink-0"
            />
            <span>
              <strong class="text-default">{{ feature.label }}:</strong>
              {{ feature.value }}
            </span>
          </li>
        </ul>

        <div class="mt-5 space-y-2">
          <UButton
            block
            :color="planActions[plan.id].color"
            :variant="planActions[plan.id].variant"
            :disabled="planActions[plan.id].disabled"
          >
            {{ planActions[plan.id].label }}
          </UButton>

          <p class="text-xs text-muted">
            {{ planActions[plan.id].description }}
          </p>
        </div>
      </article>
    </div>

    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
    >
      <div class="space-y-1">
        <h2 class="text-lg font-semibold">Comparação detalhada</h2>
        <p class="text-sm text-muted">
          Visão resumida para comparar os recursos principais entre os planos.
        </p>
      </div>

      <div class="mt-5 overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr class="text-left text-sm text-muted">
              <th class="min-w-[220px] px-3 py-2 font-medium">Recurso</th>
              <th class="min-w-[180px] px-3 py-2 font-medium">Free</th>
              <th class="min-w-[180px] px-3 py-2 font-medium">Plus</th>
              <th class="min-w-[180px] px-3 py-2 font-medium">Pro</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="row in featureRows"
              :key="row.key"
              class="rounded-xl"
            >
              <td class="rounded-l-xl border border-r-0 border-(--dashboard-border-soft) bg-(--dashboard-surface-3) px-3 py-3 text-sm font-medium">
                {{ row.label }}
              </td>

              <td
                v-for="cell in row.values"
                :key="`${row.key}-${cell.planId}`"
                class="border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) px-3 py-3 text-sm text-muted last:rounded-r-xl"
              >
                {{ cell.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <UAlert
        class="dashboard-note-alert"
        icon="i-lucide-bar-chart-3"
        title="Recursos disponíveis por plano"
        description="Alguns recursos variam de acordo com o plano disponível na conta."
        color="neutral"
        variant="outline"
      />

      <UAlert
        class="dashboard-note-alert"
        icon="i-lucide-credit-card"
        title="Cobrança ainda fora do escopo"
        description="Mais opções de assinatura serão disponibilizadas em breve."
        color="neutral"
        variant="outline"
      />
    </div>
  </div>
</template>