import { computed, reactive } from 'vue'
import type { PlanTier } from '~/composables/usePerfilState'

export type BillingCycle = 'monthly' | 'yearly'

export type PlanFeatureKey =
  | 'templates'
  | 'customDomain'
  | 'analytics'
  | 'floatingButtons'
  | 'prioritySupport'
  | 'editorSections'

export type PlanFeatureValue = string

export type PlanCard = {
  id: PlanTier
  label: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  badge?: string
  highlight?: boolean
  cta: string
  features: Array<{
    key: PlanFeatureKey
    label: string
    value: PlanFeatureValue
  }>
}

export function usePlansState() {
  const billing = reactive({
    cycle: 'monthly' as BillingCycle,
    currentPlan: 'free' as PlanTier
  })

  const plans: PlanCard[] = [
    {
      id: 'free',
      label: 'Free',
      description: 'Entrada na plataforma para começar com o domínio padrão.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      cta: 'Plano atual',
      features: [
        { key: 'templates', label: 'Templates liberados', value: '1 template' },
        { key: 'customDomain', label: 'Domínio próprio', value: 'Não incluso' },
        { key: 'analytics', label: 'Analytics', value: 'Não incluso' },
        { key: 'floatingButtons', label: 'Botões flutuantes', value: '1 botão' },
        { key: 'editorSections', label: 'Seções no editor', value: 'Base' },
        { key: 'prioritySupport', label: 'Prioridade no suporte', value: 'Não' }
      ]
    },
    {
      id: 'plus',
      label: 'Plus',
      description: 'Melhor equilíbrio entre personalização, domínio e analytics.',
      monthlyPrice: 29,
      yearlyPrice: 290,
      badge: 'Mais escolhido',
      highlight: true,
      cta: 'Fazer upgrade',
      features: [
        { key: 'templates', label: 'Templates liberados', value: 'Vários templates' },
        { key: 'customDomain', label: 'Domínio próprio', value: 'Incluso' },
        { key: 'analytics', label: 'Analytics', value: 'Incluso' },
        { key: 'floatingButtons', label: 'Botões flutuantes', value: 'Múltiplos' },
        { key: 'editorSections', label: 'Seções no editor', value: 'Expandido' },
        { key: 'prioritySupport', label: 'Prioridade no suporte', value: 'Padrão' }
      ]
    },
    {
      id: 'pro',
      label: 'Pro',
      description: 'Camada mais completa para portfólios e presença profissional avançada.',
      monthlyPrice: 59,
      yearlyPrice: 590,
      badge: 'Mais completo',
      cta: 'Ir para Pro',
      features: [
        { key: 'templates', label: 'Templates liberados', value: 'Todos do catálogo atual' },
        { key: 'customDomain', label: 'Domínio próprio', value: 'Incluso' },
        { key: 'analytics', label: 'Analytics', value: 'Avançado' },
        { key: 'floatingButtons', label: 'Botões flutuantes', value: 'Múltiplos' },
        { key: 'editorSections', label: 'Seções no editor', value: 'Completo' },
        { key: 'prioritySupport', label: 'Prioridade no suporte', value: 'Alta' }
      ]
    }
  ]

  const featureRows = computed(() => {
    const order: Array<{ key: PlanFeatureKey; label: string }> = [
      { key: 'templates', label: 'Templates liberados' },
      { key: 'customDomain', label: 'Domínio próprio' },
      { key: 'analytics', label: 'Analytics' },
      { key: 'floatingButtons', label: 'Botões flutuantes' },
      { key: 'editorSections', label: 'Seções no editor' },
      { key: 'prioritySupport', label: 'Prioridade no suporte' }
    ]

    return order.map((row) => ({
      ...row,
      values: plans.map((plan) => ({
        planId: plan.id,
        value: plan.features.find((feature) => feature.key === row.key)?.value ?? '—'
      }))
    }))
  })

  const yearlyDiscountLabel = computed(() => {
    return billing.cycle === 'yearly' ? 'Economia anual aplicada' : 'Troque para anual e economize'
  })

  function getDisplayPrice(plan: PlanCard) {
    const value = billing.cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice

    if (value === 0) return 'R$ 0'

    const suffix = billing.cycle === 'yearly' ? '/ano' : '/mês'
    return `R$ ${value}${suffix}`
  }

  function isCurrentPlan(planId: PlanTier) {
    return billing.currentPlan === planId
  }

  function selectPlan(planId: PlanTier) {
    billing.currentPlan = planId
  }

  function setBillingCycle(cycle: BillingCycle) {
    billing.cycle = cycle
  }

  return {
    billing,
    plans,
    featureRows,
    yearlyDiscountLabel,
    getDisplayPrice,
    isCurrentPlan,
    selectPlan,
    setBillingCycle
  }
}