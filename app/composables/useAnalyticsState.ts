import { computed, reactive } from 'vue'

export type AnalyticsRange = '7d' | '30d' | '90d'
export type Trend = 'up' | 'down' | 'neutral'
export type AnalyticsStatus = 'unavailable'

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

export function useAnalyticsState() {
  const state = reactive({
    range: '30d' as AnalyticsRange,
    status: 'unavailable' as AnalyticsStatus
  })

  const hasAnalyticsAccess = computed(() => false)
  const metrics = computed<Metric[]>(() => [])
  const channels = computed<Channel[]>(() => [])
  const topPages = computed<TopPage[]>(() => [])
  const activity = computed<ActivityDay[]>(() => [])
  const activityMax = computed(() => 0)
  const unavailableReason = computed(() => {
    return 'Analytics ainda não está conectado a dados reais. A tela foi mantida bloqueada para não exibir métricas falsas em produção.'
  })

  function setRange(range: AnalyticsRange) {
    state.range = range
  }

  return {
    state,
    hasAnalyticsAccess,
    metrics,
    channels,
    topPages,
    activity,
    activityMax,
    unavailableReason,
    setRange
  }
}
