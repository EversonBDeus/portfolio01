import { computed, reactive } from 'vue'
import type { PlanTier } from '~/composables/usePerfilState'

export type AnalyticsRange = '7d' | '30d' | '90d'
export type Trend = 'up' | 'down' | 'neutral'

type Metric = {
  id: 'views' | 'visitors' | 'contacts' | 'resume'
  label: string
  value: number
  delta: string
  trend: Trend
  helper: string
}

type Channel = {
  label: string
  value: number
}

type TopPage = {
  label: string
  views: number
  share: number
}

type ActivityDay = {
  label: string
  value: number
}

type AnalyticsPreset = {
  metrics: Metric[]
  channels: Channel[]
  topPages: TopPage[]
  activity: ActivityDay[]
}

const PRESETS: Record<AnalyticsRange, AnalyticsPreset> = {
  '7d': {
    metrics: [
      { id: 'views', label: 'Visualizações', value: 1248, delta: '+12%', trend: 'up', helper: 'Últimos 7 dias' },
      { id: 'visitors', label: 'Visitantes únicos', value: 382, delta: '+8%', trend: 'up', helper: 'Usuários distintos' },
      { id: 'contacts', label: 'Cliques em contato', value: 41, delta: '+5%', trend: 'up', helper: 'WhatsApp, e-mail e links' },
      { id: 'resume', label: 'Downloads de currículo', value: 19, delta: '-2%', trend: 'down', helper: 'Ação de currículo' }
    ],
    channels: [
      { label: 'Google', value: 46 },
      { label: 'LinkedIn', value: 24 },
      { label: 'Direct', value: 18 },
      { label: 'Instagram', value: 12 }
    ],
    topPages: [
      { label: 'Home', views: 620, share: 49 },
      { label: 'Projetos', views: 318, share: 25 },
      { label: 'Sobre', views: 210, share: 17 },
      { label: 'Contato', views: 100, share: 9 }
    ],
    activity: [
      { label: 'Seg', value: 120 },
      { label: 'Ter', value: 164 },
      { label: 'Qua', value: 142 },
      { label: 'Qui', value: 188 },
      { label: 'Sex', value: 201 },
      { label: 'Sáb', value: 126 },
      { label: 'Dom', value: 98 }
    ]
  },
  '30d': {
    metrics: [
      { id: 'views', label: 'Visualizações', value: 4820, delta: '+21%', trend: 'up', helper: 'Últimos 30 dias' },
      { id: 'visitors', label: 'Visitantes únicos', value: 1612, delta: '+17%', trend: 'up', helper: 'Usuários distintos' },
      { id: 'contacts', label: 'Cliques em contato', value: 138, delta: '+11%', trend: 'up', helper: 'WhatsApp, e-mail e links' },
      { id: 'resume', label: 'Downloads de currículo', value: 74, delta: '+3%', trend: 'up', helper: 'Ação de currículo' }
    ],
    channels: [
      { label: 'Google', value: 43 },
      { label: 'LinkedIn', value: 27 },
      { label: 'Direct', value: 16 },
      { label: 'Instagram', value: 14 }
    ],
    topPages: [
      { label: 'Home', views: 2310, share: 48 },
      { label: 'Projetos', views: 1228, share: 25 },
      { label: 'Sobre', views: 856, share: 18 },
      { label: 'Contato', views: 426, share: 9 }
    ],
    activity: [
      { label: 'S1', value: 780 },
      { label: 'S2', value: 960 },
      { label: 'S3', value: 1040 },
      { label: 'S4', value: 1120 },
      { label: 'S5', value: 920 }
    ]
  },
  '90d': {
    metrics: [
      { id: 'views', label: 'Visualizações', value: 13840, delta: '+34%', trend: 'up', helper: 'Últimos 90 dias' },
      { id: 'visitors', label: 'Visitantes únicos', value: 4690, delta: '+28%', trend: 'up', helper: 'Usuários distintos' },
      { id: 'contacts', label: 'Cliques em contato', value: 402, delta: '+15%', trend: 'up', helper: 'WhatsApp, e-mail e links' },
      { id: 'resume', label: 'Downloads de currículo', value: 196, delta: '+9%', trend: 'up', helper: 'Ação de currículo' }
    ],
    channels: [
      { label: 'Google', value: 44 },
      { label: 'LinkedIn', value: 26 },
      { label: 'Direct', value: 17 },
      { label: 'Instagram', value: 13 }
    ],
    topPages: [
      { label: 'Home', views: 6580, share: 47 },
      { label: 'Projetos', views: 3580, share: 26 },
      { label: 'Sobre', views: 2380, share: 17 },
      { label: 'Contato', views: 1300, share: 10 }
    ],
    activity: [
      { label: 'M1', value: 3920 },
      { label: 'M2', value: 4680 },
      { label: 'M3', value: 5240 }
    ]
  }
}

function trendMeta(trend: Trend) {
  if (trend === 'up') {
    return {
      color: 'success' as const,
      icon: 'i-lucide-trending-up'
    }
  }

  if (trend === 'down') {
    return {
      color: 'error' as const,
      icon: 'i-lucide-trending-down'
    }
  }

  return {
    color: 'neutral' as const,
    icon: 'i-lucide-minus'
  }
}

export function useAnalyticsState() {
  const state = reactive({
    range: '30d' as AnalyticsRange,
    planTier: 'plus' as PlanTier
  })

  const hasAnalyticsAccess = computed(() => {
    return state.planTier === 'plus' || state.planTier === 'pro'
  })

  const currentPreset = computed(() => PRESETS[state.range])

  const metrics = computed(() =>
    currentPreset.value.metrics.map((metric) => ({
      ...metric,
      ...trendMeta(metric.trend)
    }))
  )

  const channels = computed(() => currentPreset.value.channels)
  const topPages = computed(() => currentPreset.value.topPages)
  const activity = computed(() => currentPreset.value.activity)

  const activityMax = computed(() => {
    return Math.max(...activity.value.map(item => item.value), 1)
  })

  function setRange(range: AnalyticsRange) {
    state.range = range
  }

  function setPlanTier(plan: PlanTier) {
    state.planTier = plan
  }

  return {
    state,
    hasAnalyticsAccess,
    metrics,
    channels,
    topPages,
    activity,
    activityMax,
    setRange,
    setPlanTier
  }
}