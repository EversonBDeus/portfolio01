<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Plans' })

import { usePlansState } from '~/composables/usePlansState'

const toast = useToast()

const {
  billing,
  plans,
  featureRows,
  yearlyDiscountLabel,
  getDisplayPrice,
  isCurrentPlan,
  selectPlan,
  setBillingCycle
} = usePlansState()

function handleSelectPlan(planId: 'free' | 'plus' | 'pro') {
  selectPlan(planId)

  toast.add({
    title: 'Plano selecionado',
    description: `O plano ${planId.toUpperCase()} foi marcado como atual no modo visual desta etapa.`,
    color: 'success',
    icon: 'i-lucide-circle-check'
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Plans</h1>
      <p class="text-sm text-muted">
        Compare os planos da plataforma e simule upgrade ou downgrade no painel.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-badge-dollar-sign"
      title="Escopo desta tela"
      description="Esta etapa fecha a visão comparativa dos planos. A cobrança real, cupom, reembolso e assinatura continuam preparados para integração futura."
      color="neutral"
      variant="outline"
    />

    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="font-medium">Ciclo de cobrança</p>
          <p class="text-sm text-muted">{{ yearlyDiscountLabel }}</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            size="sm"
            :variant="billing.cycle === 'monthly' ? 'solid' : 'outline'"
            :color="billing.cycle === 'monthly' ? 'primary' : 'neutral'"
            @click="setBillingCycle('monthly')"
          >
            Mensal
          </UButton>

          <UButton
            size="sm"
            :variant="billing.cycle === 'yearly' ? 'solid' : 'outline'"
            :color="billing.cycle === 'yearly' ? 'primary' : 'neutral'"
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
                v-if="isCurrentPlan(plan.id)"
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
            Valores visuais desta etapa. Integração real entra depois.
          </p>
        </div>

        <ul class="mt-5 space-y-2">
          <li
            v-for="feature in plan.features"
            :key="`${plan.id}-${feature.key}`"
            class="flex items-start gap-2 text-sm text-muted"
          >
            <UIcon name="i-lucide-check" class="mt-0.5 shrink-0" />
            <span>
              <strong class="text-default">{{ feature.label }}:</strong>
              {{ feature.value }}
            </span>
          </li>
        </ul>

        <div class="mt-5">
          <UButton
            block
            :color="isCurrentPlan(plan.id) ? 'neutral' : 'primary'"
            :variant="isCurrentPlan(plan.id) ? 'outline' : 'solid'"
            @click="handleSelectPlan(plan.id)"
          >
            {{ isCurrentPlan(plan.id) ? 'Plano atual' : plan.cta }}
          </UButton>
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
        title="Analytics e recursos avançados"
        description="A tela já deixa clara a progressão entre planos e prepara a interface para a futura regra real de liberação por assinatura."
        color="neutral"
        variant="outline"
      />

      <UAlert
        class="dashboard-note-alert"
        icon="i-lucide-undo-2"
        title="Cobrança e reembolso"
        description="Cupom, pagamento real, cancelamento e reembolso continuam fora desta etapa visual e entram depois na integração de assinatura."
        color="neutral"
        variant="outline"
      />
    </div>
  </div>
</template>