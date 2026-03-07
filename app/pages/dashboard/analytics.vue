<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Analytics' })

import type { AnalyticsRange } from '~/composables/useAnalyticsState'
import type { PlanTier } from '~/composables/usePerfilState'
import { useAnalyticsState } from '~/composables/useAnalyticsState'

const {
  state,
  hasAnalyticsAccess,
  metrics,
  channels,
  topPages,
  activity,
  activityMax,
  setRange,
  setPlanTier
} = useAnalyticsState()

const rangeOptions: Array<{ label: string; value: AnalyticsRange }> = [
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' }
]

const planOptions: Array<{ label: string; value: PlanTier }> = [
  { label: 'Free', value: 'free' },
  { label: 'Plus', value: 'plus' },
  { label: 'Pro', value: 'pro' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Analytics</h1>
      <p class="text-sm text-muted">
        Acompanhe visualizações, visitantes, contatos e desempenho geral do portfólio.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-bar-chart-3"
      title="Escopo desta tela"
      description="Esta etapa fecha a visão de analytics do dashboard com dados visuais mockados, pronta para integração futura com métricas reais."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-1">
            <p class="font-medium">Período analisado</p>
            <p class="text-sm text-muted">
              Troque o recorte temporal para comparar o comportamento do portfólio.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="option in rangeOptions"
              :key="option.value"
              size="sm"
              :variant="state.range === option.value ? 'solid' : 'outline'"
              :color="state.range === option.value ? 'primary' : 'neutral'"
              @click="setRange(option.value)"
            >
              {{ option.label }}
            </UButton>
          </div>
        </div>
      </div>

      <div
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
      >
        <div class="space-y-1">
          <p class="font-medium">Cenário de plano</p>
          <p class="text-sm text-muted">
            Controle visual temporário para testar o bloqueio de analytics.
          </p>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <UButton
            v-for="plan in planOptions"
            :key="plan.value"
            size="sm"
            :variant="state.planTier === plan.value ? 'solid' : 'outline'"
            :color="state.planTier === plan.value ? 'primary' : 'neutral'"
            @click="setPlanTier(plan.value)"
          >
            {{ plan.label }}
          </UButton>
        </div>
      </div>
    </div>

    <UAlert
      v-if="!hasAnalyticsAccess"
      class="dashboard-note-alert"
      icon="i-lucide-lock"
      title="Analytics bloqueado no plano atual"
      description="No modo visual desta etapa, analytics fica liberado apenas nos planos pagos. Use os botões acima para testar os estados do painel."
      color="warning"
      variant="outline"
    />

    <template v-else>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="metric in metrics"
          :key="metric.id"
          class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <p class="text-sm text-muted">{{ metric.label }}</p>
              <p class="text-2xl font-semibold">{{ metric.value.toLocaleString('pt-BR') }}</p>
              <p class="text-xs text-muted">{{ metric.helper }}</p>
            </div>

            <UBadge :color="metric.color" variant="subtle" class="shrink-0">
              <UIcon :name="metric.icon" class="mr-1" />
              {{ metric.delta }}
            </UBadge>
          </div>
        </article>
      </div>

     <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <section
          class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
        >
          <div class="space-y-1">
            <h2 class="text-lg font-semibold">Atividade do período</h2>
            <p class="text-sm text-muted">
              Distribuição visual do volume de acessos ao longo do recorte selecionado.
            </p>
          </div>

          <div class="mt-5 flex min-h-[240px] items-end gap-3">
            <div
              v-for="item in activity"
              :key="item.label"
              class="flex min-w-0 flex-1 flex-col items-center gap-3"
            >
              <div class="flex h-56 w-full items-end">
                <div
                  class="w-full rounded-t-xl border border-b-0 border-(--dashboard-border-soft) bg-(--dashboard-surface-3)"
                  :style="{ height: `${(item.value / activityMax) * 100}%` }"
                />
              </div>

              <div class="text-center">
                <p class="text-sm font-medium">{{ item.label }}</p>
                <p class="text-xs text-muted">{{ item.value.toLocaleString('pt-BR') }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div
            class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
          >
            <div class="space-y-1">
              <h2 class="text-lg font-semibold">Origem do tráfego</h2>
              <p class="text-sm text-muted">
                Principais canais que levam usuários para o portfólio.
              </p>
            </div>

            <div class="mt-5 space-y-4">
              <div
                v-for="channel in channels"
                :key="channel.label"
                class="space-y-2"
              >
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="font-medium">{{ channel.label }}</span>
                  <span class="text-muted">{{ channel.value }}%</span>
                </div>

                <div class="h-2 rounded-full bg-(--dashboard-surface-3)">
                  <div
                    class="h-2 rounded-full bg-primary"
                    :style="{ width: `${channel.value}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
          >
            <div class="space-y-1">
              <h2 class="text-lg font-semibold">Páginas mais vistas</h2>
              <p class="text-sm text-muted">
                Distribuição das áreas com maior atenção dentro do portfólio.
              </p>
            </div>

            <div class="mt-5 space-y-3">
              <div
                v-for="page in topPages"
                :key="page.label"
                class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1">
                    <p class="font-medium">{{ page.label }}</p>
                    <p class="text-sm text-muted">
                      {{ page.views.toLocaleString('pt-BR') }} visualizações
                    </p>
                  </div>

                  <UBadge color="neutral" variant="soft">
                    {{ page.share }}%
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <UAlert
          class="dashboard-note-alert"
          icon="i-lucide-info"
          title="Dados desta etapa"
          description="As métricas desta tela são mockadas para fechar o front-end do painel. A integração real com eventos, tráfego e cliques entra depois."
          color="neutral"
          variant="outline"
        />

        <UAlert
          class="dashboard-note-alert"
          icon="i-lucide-shield-check"
          title="Regra arquitetural"
          description="Quando algum ajuste visual for específico desta tela, ele deve ficar local, sem alterar componentes globais que já estejam corretos no restante do dashboard."
          color="neutral"
          variant="outline"
        />
      </div>
    </template>
  </div>
</template>