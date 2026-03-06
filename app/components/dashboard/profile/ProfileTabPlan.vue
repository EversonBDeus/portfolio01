<script setup lang="ts">
import { computed } from 'vue'
import type { PlanData } from '~/composables/usePerfilState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

const props = defineProps<{ model: PlanData }>()
const emit = defineEmits<{ dirty: [] }>()

type PlanTier = PlanData['tier']

type PlanCard = {
  tier: PlanTier
  label: string
  oldPrice?: string
  price: string
  badge?: string
  description: string
  features: string[]
  highlight?: boolean
}

const planCards: PlanCard[] = [
  {
    tier: 'free',
    label: 'Free',
    price: 'R$ 0/mês',
    description: 'Entrada na plataforma com domínio padrão e recursos essenciais.',
    features: [
      '1 template liberado',
      'Domínio padrão da plataforma',
      'Sem analytics avançado',
      '1 botão flutuante no portfólio'
    ]
  },
  {
    tier: 'plus',
    label: 'Plus',
    oldPrice: 'R$ 49/mês',
    price: 'R$ 29/mês',
    badge: 'Promoção',
    description: 'Mais personalização, analytics e recursos extras para crescer.',
    features: [
      'Mais templates liberados',
      'Analytics do portfólio',
      'Domínio próprio',
      'Múltiplos botões flutuantes'
    ],
    highlight: true
  },
  {
    tier: 'pro',
    label: 'Pro',
    oldPrice: 'R$ 89/mês',
    price: 'R$ 59/mês',
    badge: 'Mais completo',
    description: 'Camada avançada para quem quer mais controle e presença profissional.',
    features: [
      'Todos os templates do plano atual',
      'Analytics avançado',
      'Domínio próprio',
      'Prioridade em recursos premium'
    ]
  }
]

const fallbackPlanCard: PlanCard = planCards[0]!

const currentPlanCard = computed<PlanCard>(() => {
  return planCards.find(card => card.tier === props.model.tier) ?? fallbackPlanCard
})

const statusLabel = computed(() => {
  if (props.model.status === 'trial') return 'Período de teste'
  if (props.model.status === 'cancelada') return 'Cancelada'
  return 'Ativa'
})

const statusColor = computed<'primary' | 'warning' | 'error'>(() => {
  if (props.model.status === 'trial') return 'warning'
  if (props.model.status === 'cancelada') return 'error'
  return 'primary'
})

const hasAnalytics = computed(() => {
  return props.model.tier === 'plus' || props.model.tier === 'pro'
})

const hasCustomDomain = computed(() => {
  return props.model.tier === 'plus' || props.model.tier === 'pro'
})

const canUseMultipleFloatingButtons = computed(() => {
  return props.model.tier === 'plus' || props.model.tier === 'pro'
})

function markDirty() {
  emit('dirty')
}

function selectPlan(tier: PlanTier) {
  if (props.model.tier === tier) return

  props.model.tier = tier
  props.model.status = 'ativa'
  props.model.cancelAt = undefined
  markDirty()
}

function requestCancellation() {
  if (props.model.status === 'cancelada') return

  props.model.status = 'cancelada'
  props.model.cancelAt = new Intl.DateTimeFormat('pt-BR').format(new Date())
  markDirty()
}

function reactivatePlan() {
  props.model.status = 'ativa'
  props.model.cancelAt = undefined
  markDirty()
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h2 class="text-base font-semibold">Plano e assinatura</h2>
      <p class="text-sm text-muted">
        Veja seu plano atual, benefícios liberados, cupom de desconto e status da assinatura.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-badge-dollar-sign"
      title="Estrutura da assinatura"
      description="Esta tela já segue as regras do produto para plano, cupom, cancelamento e benefícios, ficando pronta para integração futura com pagamento real."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <div
        class="dashboard-form-surface-2 space-y-5 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-[var(--dashboard-shadow-xs)] sm:p-5"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm text-muted">Plano atual</p>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold">{{ currentPlanCard.label }}</h3>
              <UBadge :color="statusColor" variant="subtle">
                {{ statusLabel }}
              </UBadge>
            </div>
            <p class="text-sm text-muted">
              {{ currentPlanCard.description }}
            </p>
          </div>

          <div class="text-right">
            <p v-if="currentPlanCard.oldPrice" class="text-sm text-muted line-through">
              {{ currentPlanCard.oldPrice }}
            </p>
            <p class="text-xl font-semibold">{{ currentPlanCard.price }}</p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
            <p class="text-xs uppercase tracking-wide text-muted">Próxima renovação</p>
            <p class="mt-1 text-sm font-medium">{{ props.model.renewAt || '—' }}</p>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
            <p class="text-xs uppercase tracking-wide text-muted">Cancelamento agendado</p>
            <p class="mt-1 text-sm font-medium">{{ props.model.cancelAt || '—' }}</p>
          </div>
        </div>

        <DashboardFloatingInput
          v-model="props.model.coupon"
          label="Cupom de desconto"
          icon="i-lucide-ticket-percent"
          autocomplete="off"
          @update:model-value="markDirty"
        />

        <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
          <p class="font-medium">Benefícios liberados no plano atual</p>

          <ul class="mt-3 space-y-2 text-sm text-muted">
            <li class="flex items-center gap-2">
              <UIcon
                :name="hasAnalytics ? 'i-lucide-circle-check' : 'i-lucide-lock'"
                class="shrink-0"
              />
              <span>
                Analytics:
                <strong class="text-default">{{ hasAnalytics ? 'liberado' : 'bloqueado no plano atual' }}</strong>
              </span>
            </li>

            <li class="flex items-center gap-2">
              <UIcon
                :name="hasCustomDomain ? 'i-lucide-circle-check' : 'i-lucide-lock'"
                class="shrink-0"
              />
              <span>
                Domínio próprio:
                <strong class="text-default">{{ hasCustomDomain ? 'liberado' : 'disponível apenas em plano pago' }}</strong>
              </span>
            </li>

            <li class="flex items-center gap-2">
              <UIcon
                :name="canUseMultipleFloatingButtons ? 'i-lucide-circle-check' : 'i-lucide-lock'"
                class="shrink-0"
              />
              <span>
                Botões flutuantes:
                <strong class="text-default">{{ canUseMultipleFloatingButtons ? 'múltiplos botões' : '1 botão no plano atual' }}</strong>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="dashboard-form-surface-2 space-y-5 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-[var(--dashboard-shadow-xs)] sm:p-5"
      >
        <div class="space-y-1">
          <h3 class="font-medium">Alterar plano</h3>
          <p class="text-sm text-muted">
            Compare os planos disponíveis e simule a troca direto no painel.
          </p>
        </div>

        <div class="space-y-3">
          <button
            v-for="plan in planCards"
            :key="plan.tier"
            type="button"
            class="w-full rounded-2xl border p-4 text-left transition"
            :class="[
              props.model.tier === plan.tier
                ? 'border-(--dashboard-border-strong) bg-(--dashboard-surface-3) shadow-[var(--dashboard-shadow-xs)]'
                : 'border-(--dashboard-border-soft) bg-(--dashboard-surface-2)',
              plan.highlight ? 'ring-1 ring-primary/30' : ''
            ]"
            @click="selectPlan(plan.tier)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <p class="font-medium">{{ plan.label }}</p>
                  <UBadge v-if="plan.badge" color="primary" variant="subtle">
                    {{ plan.badge }}
                  </UBadge>
                  <UBadge
                    v-if="props.model.tier === plan.tier"
                    color="neutral"
                    variant="soft"
                  >
                    Atual
                  </UBadge>
                </div>

                <p class="text-sm text-muted">{{ plan.description }}</p>
              </div>

              <div class="text-right">
                <p v-if="plan.oldPrice" class="text-xs text-muted line-through">
                  {{ plan.oldPrice }}
                </p>
                <p class="font-semibold">{{ plan.price }}</p>
              </div>
            </div>

            <ul class="mt-3 space-y-1.5 text-sm text-muted">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
                <UIcon name="i-lucide-check" class="shrink-0" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </button>
        </div>

        <UAlert
          class="dashboard-note-alert"
          icon="i-lucide-bar-chart-3"
          title="Analytics por plano"
          :description="hasAnalytics ? 'Seu plano atual já libera analytics do portfólio.' : 'Analytics ficam disponíveis apenas em planos superiores, como Plus ou Pro.'"
          :color="hasAnalytics ? 'primary' : 'warning'"
          variant="outline"
        />

        <UAlert
          class="dashboard-note-alert"
          icon="i-lucide-undo-2"
          title="Cancelamento e reembolso"
          description="Se o cancelamento ocorrer dentro de 7 dias, a assinatura deve gerar reembolso conforme a regra do produto."
          color="neutral"
          variant="outline"
        />

        <div class="flex flex-wrap gap-3">
          <UButton
            v-if="props.model.status !== 'cancelada'"
            color="error"
            variant="outline"
            icon="i-lucide-ban"
            @click="requestCancellation"
          >
            Solicitar cancelamento
          </UButton>

          <UButton
            v-else
            color="primary"
            variant="outline"
            icon="i-lucide-refresh-ccw"
            @click="reactivatePlan"
          >
            Reativar plano
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>