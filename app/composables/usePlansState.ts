import { computed } from 'vue'
import { useAuthState } from '~/composables/useAuthState'
import {
  initialAccount,
  type AccountData,
  type OnboardingStatus,
  type PlanTier
} from '~/composables/usePerfilState'
import type { PortfolioPublicationStatus } from '~/types/portfolio'

export type BillingCycle = 'monthly' | 'yearly'

export type PlanFeatureKey =
  | 'templates'
  | 'customDomain'
  | 'analytics'
  | 'floatingButtons'
  | 'prioritySupport'
  | 'editorSections'

export type PlanFeatureValue = string

export type PlanAction = {
  label: string
  description: string
  color: 'primary' | 'neutral'
  variant: 'solid' | 'outline'
  disabled: boolean
}

export type PlanCard = {
  id: PlanTier
  label: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  badge?: string
  highlight?: boolean
  features: Array<{
    key: PlanFeatureKey
    label: string
    value: PlanFeatureValue
  }>
}

export type PlansRemotePayload = {
  account: AccountData
  billing: {
    enabled: boolean
  }
  updatedAt: string | null
}

const PLAN_ORDER: Record<PlanTier, number> = {
  free: 0,
  plus: 1,
  pro: 2
}

const PLAN_CARDS: PlanCard[] = [
  {
    id: 'free',
    label: 'Free',
    description: 'Entrada na plataforma para começar com o domínio padrão.',
    monthlyPrice: 0,
    yearlyPrice: 0,
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

function cloneAccountData(account: AccountData): AccountData {
  return {
    ...account
  }
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function normalizePlan(value: unknown): PlanTier {
  return value === 'plus' || value === 'pro' ? value : 'free'
}

function normalizeOnboardingStatus(value: unknown): OnboardingStatus {
  return value === 'completed' || value === 'in_progress' ? value : 'not_started'
}

function normalizePublicationStatus(value: unknown): PortfolioPublicationStatus {
  return value === 'published' ? 'published' : 'draft'
}

function normalizeAccountData(value: unknown): AccountData {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    email: normalizeText(source.email).toLowerCase(),
    username: normalizeText(source.username),
    accountId: normalizeText(source.accountId),
    plan: normalizePlan(source.plan),
    onboardingStatus: normalizeOnboardingStatus(source.onboardingStatus),
    createdAt: normalizeText(source.createdAt),
    updatedAt: normalizeText(source.updatedAt),
    lastSignInAt: normalizeText(source.lastSignInAt),
    publicSlug: normalizeText(source.publicSlug),
    publicationStatus: normalizePublicationStatus(source.publicationStatus),
    templateId: normalizeText(source.templateId) || null
  }
}

function normalizePayload(value: unknown): PlansRemotePayload {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  const billingSource =
    source.billing && typeof source.billing === 'object' && !Array.isArray(source.billing)
      ? (source.billing as Record<string, unknown>)
      : {}

  return {
    account: normalizeAccountData(source.account),
    billing: {
      enabled: Boolean(billingSource.enabled)
    },
    updatedAt: normalizeText(source.updatedAt) || null
  }
}

function getCurrentAccountKey(email: string | null | undefined) {
  return normalizeText(email).toLowerCase() || null
}

function buildPlanAction(currentPlan: PlanTier, targetPlan: PlanTier): PlanAction {
  if (currentPlan === targetPlan) {
    return {
      label: 'Plano atual',
      description: 'Este é o plano salvo atualmente no backend da conta.',
      color: 'neutral',
      variant: 'outline',
      disabled: true
    }
  }

  if (PLAN_ORDER[targetPlan] > PLAN_ORDER[currentPlan]) {
    return {
      label: 'Upgrade em breve',
      description: 'A leitura do plano já é real. Checkout e assinatura entram na etapa de billing.',
      color: 'primary',
      variant: 'solid',
      disabled: true
    }
  }

  return {
    label: 'Mudança futura',
    description: 'Downgrade real será tratado depois, junto com billing e regras de assinatura.',
    color: 'neutral',
    variant: 'outline',
    disabled: true
  }
}

export function usePlansState() {
  const { session } = useAuthState()

  const billingCycle = useState<BillingCycle>('plans-billing-cycle', () => 'monthly')
  const loadingFromServer = useState<boolean>('plans-loading-from-server', () => false)
  const hydratedForAccount = useState<string | null>('plans-hydrated-for-account', () => null)
  const lastLoadedAt = useState<string | null>('plans-last-loaded-at', () => null)
  const account = useState<AccountData>('plans-account', () => cloneAccountData(initialAccount))
  const billingEnabled = useState<boolean>('plans-billing-enabled', () => false)

  const plans = PLAN_CARDS

  const currentPlan = computed<PlanTier>(() => account.value.plan)

  const currentPlanCard = computed(() => {
    return plans.find((plan) => plan.id === currentPlan.value) ?? plans[0]
  })

  const planActions = computed<Record<PlanTier, PlanAction>>(() => ({
    free: buildPlanAction(currentPlan.value, 'free'),
    plus: buildPlanAction(currentPlan.value, 'plus'),
    pro: buildPlanAction(currentPlan.value, 'pro')
  }))

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
    return billingCycle.value === 'yearly'
      ? 'Comparativo anual aplicado na tabela visual'
      : 'Troque para anual para ver a comparação de preço do roadmap'
  })

  function getDisplayPrice(plan: PlanCard) {
    const value = billingCycle.value === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice

    if (value === 0) {
      return 'R$ 0'
    }

    const suffix = billingCycle.value === 'yearly' ? '/ano' : '/mês'
    return `R$ ${value}${suffix}`
  }

  function isCurrentPlan(planId: PlanTier) {
    return currentPlan.value === planId
  }

  function setBillingCycle(cycle: BillingCycle) {
    billingCycle.value = cycle
  }

  function buildCachedPayload(): PlansRemotePayload {
    return {
      account: cloneAccountData(account.value),
      billing: {
        enabled: billingEnabled.value
      },
      updatedAt: lastLoadedAt.value
    }
  }

  function resetRemoteState() {
    hydratedForAccount.value = null
    lastLoadedAt.value = null
    account.value = cloneAccountData(initialAccount)
    billingEnabled.value = false
  }

  function applyRemotePayload(payload: PlansRemotePayload) {
    const normalized = normalizePayload(payload)

    account.value = cloneAccountData(normalized.account)
    billingEnabled.value = normalized.billing.enabled
    lastLoadedAt.value = normalized.updatedAt

    return normalized
  }

  async function loadPlansFromServer(force = false): Promise<PlansRemotePayload | null> {
    const accountKey = getCurrentAccountKey(session.value?.email)

    if (!session.value || !accountKey) {
      resetRemoteState()
      return null
    }

    if (!force && hydratedForAccount.value === accountKey) {
      return buildCachedPayload()
    }

    loadingFromServer.value = true

    try {
      const response = await $fetch<PlansRemotePayload>('/api/plans')
      const payload = applyRemotePayload(response)

      hydratedForAccount.value = accountKey

      return payload
    } catch {
      if (hydratedForAccount.value === accountKey) {
        return buildCachedPayload()
      }

      return null
    } finally {
      loadingFromServer.value = false
    }
  }

  return {
    account,
    billingCycle,
    billingEnabled,
    currentPlan,
    currentPlanCard,
    featureRows,
    getDisplayPrice,
    isCurrentPlan,
    lastLoadedAt,
    loadPlansFromServer,
    loadingFromServer,
    planActions,
    plans,
    resetRemoteState,
    setBillingCycle,
    yearlyDiscountLabel
  }
}