<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Analytics' })

import { useAnalyticsState } from '~/composables/useAnalyticsState'

const {
  unavailableReason
} = useAnalyticsState()
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold">Analytics</h1>
      <p class="text-sm text-muted">
        Esta área ficará disponível quando a coleta de métricas reais estiver pronta.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-lock"
      title="Analytics temporariamente desativado"
      :description="unavailableReason"
      color="warning"
      variant="outline"
    />

    <div class="grid gap-6 xl:grid-cols-2">
      <div
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
      >
        <div class="space-y-3">
          <h2 class="text-lg font-semibold">Motivo do bloqueio</h2>
          <p class="text-sm text-muted">
            O dashboard anterior estava alimentando gráficos com presets fixos e cenário de plano simulado.
            Para evitar dados falsos no deploy, a visualização foi removida até a integração server-side existir.
          </p>
        </div>
      </div>

      <div
        class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-5 shadow-(--dashboard-shadow-xs)"
      >
        <div class="space-y-3">
          <h2 class="text-lg font-semibold">Próxima etapa segura</h2>
          <p class="text-sm text-muted">
            Criar uma rota autenticada de analytics, validar o plano real no servidor e só então reabrir os cards,
            gráficos e comparativos do portfólio.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
