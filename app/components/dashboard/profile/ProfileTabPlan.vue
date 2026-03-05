<script setup lang="ts">
import type { PlanData, PlanTier } from '~/composables/usePerfilState'

const props = defineProps<{ model: PlanData }>()
const emit = defineEmits<{ dirty: [] }>()

const toast = useToast()

function planLabel(tier: PlanTier) {
  if (tier === 'free') return 'Free'
  if (tier === 'plus') return 'Plus'
  return 'Pro'
}

const currentLabel = computed(() => planLabel(props.model.tier))

function upgrade() {
  toast.add({
    title: 'Upgrade (mock)',
    description: 'Na próxima fase vamos integrar Mercado Pago e planos reais.',
    color: 'info',
    icon: 'i-lucide-sparkles'
  })
}

function manage() {
  toast.add({
    title: 'Gerenciar assinatura (mock)',
    description: 'Na próxima fase isso abrirá o portal de cobrança.',
    color: 'info',
    icon: 'i-lucide-settings'
  })
}

function cancel() {
  emit('dirty')
  toast.add({
    title: 'Cancelar assinatura (mock)',
    description: 'Na próxima fase isso seguirá as regras de cancelamento/reembolso.',
    color: 'warning',
    icon: 'i-lucide-triangle-alert'
  })
}
</script>

<template>
  <div class="space-y-8">
    <div class="mx-auto w-full max-w-4xl space-y-6">
      <div class="space-y-1">
        <h2 class="text-base font-semibold">Plano</h2>
        <p class="text-sm text-muted">
          Gerencie seu plano, pagamentos e acesso a templates premium.
        </p>
      </div>

      <!-- Resumo -->
      <UCard :ui="{ body: 'p-5 space-y-4' }">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1 min-w-0">
            <p class="text-sm text-muted">Plano atual</p>
            <p class="text-xl font-semibold truncate">{{ currentLabel }}</p>
            <p class="text-sm text-muted">
              Status: <span class="font-medium text-default">{{ props.model.status }}</span>
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <UButton
              v-if="props.model.tier === 'free'"
              color="primary"
              icon="i-lucide-arrow-up-right"
              @click="upgrade"
            >
              Fazer upgrade
            </UButton>

            <UButton
              v-else
              color="neutral"
              variant="outline"
              icon="i-lucide-settings"
              @click="manage"
            >
              Gerenciar
            </UButton>

            <UButton
              v-if="props.model.tier !== 'free'"
              color="error"
              variant="soft"
              icon="i-lucide-ban"
              @click="cancel"
            >
              Cancelar
            </UButton>
          </div>
        </div>

        <USeparator />

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <p class="text-sm font-medium">Próxima renovação</p>
            <p class="text-sm text-muted">{{ props.model.renewAt || '—' }}</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium">Cupom</p>
            <p class="text-sm text-muted">{{ props.model.coupon || '—' }}</p>
          </div>
        </div>

        <UAlert
          icon="i-lucide-info"
          title="Templates premium"
          description="Plus/Pro desbloqueiam templates e recursos avançados (analytics, domínio, etc.)."
          color="neutral"
          variant="soft"
        />
      </UCard>

      <!-- Comparativo -->
      <div class="grid gap-4 lg:grid-cols-3">
        <UCard :ui="{ body: 'p-5 space-y-3' }">
          <p class="font-semibold">Free</p>
          <p class="text-sm text-muted">Para começar</p>
          <ul class="text-sm space-y-2">
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> 1 template grátis</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Página pública</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-x" class="size-4 text-muted" /> Analytics</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-x" class="size-4 text-muted" /> Domínio próprio</li>
          </ul>
        </UCard>

        <UCard :ui="{ body: 'p-5 space-y-3' }">
          <p class="font-semibold">Plus</p>
          <p class="text-sm text-muted">Mais templates e recursos</p>
          <ul class="text-sm space-y-2">
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Templates premium</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Analytics básico</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Suporte prioritário</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-x" class="size-4 text-muted" /> Domínio próprio</li>
          </ul>
        </UCard>

        <UCard :ui="{ body: 'p-5 space-y-3' }">
          <p class="font-semibold">Pro</p>
          <p class="text-sm text-muted">Completo</p>
          <ul class="text-sm space-y-2">
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Tudo do Plus</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Domínio próprio</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Analytics avançado</li>
            <li class="flex items-center gap-2"><UIcon name="i-lucide-check" class="size-4 text-success" /> Mais templates</li>
          </ul>
        </UCard>
      </div>
    </div>
  </div>
</template>