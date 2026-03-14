import { computed, reactive } from 'vue'
import type { PlanTier } from '~/composables/usePerfilState'

export type DomainConnectionStatus = 'locked' | 'draft' | 'pending_dns' | 'active' | 'error'

export type DomainStatusMeta = {
  label: string
  description: string
  color: 'neutral' | 'warning' | 'success' | 'error'
  icon: string
}

export type DnsRecord = {
  type: 'CNAME' | 'TXT'
  host: string
  value: string
  ttl: string
  isValid: boolean
}

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')
}

function nowLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date())
}

function randomSegment() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()
  }

  return Math.random().toString(36).slice(2, 12).toUpperCase()
}

function createVerificationToken() {
  return `lumio-verify=${randomSegment()}`
}

function resolvePlatformUrl() {
  const runtimeConfig = useRuntimeConfig()
  const configuredHost = String(runtimeConfig.public.platformUrl ?? '').trim()

  if (configuredHost) {
    return configuredHost
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '')
  }

  if (import.meta.client && window.location.host) {
    return window.location.host.replace(/^www\./, '')
  }

  return 'lumio.app'
}

function resolveDomainTarget(platformUrl: string) {
  const cleanHost = platformUrl
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')

  return cleanHost.startsWith('domains.') ? cleanHost : `domains.${cleanHost}`
}

export function useDomainState() {
  const domain = reactive({
    planTier: 'plus' as PlanTier,
    platformUrl: resolvePlatformUrl(),
    customDomain: '',
    verificationToken: '',
    status: 'draft' as DomainConnectionStatus,
    lastCheckedAt: '—'
  })

  const isPaidPlan = computed(() => {
    return domain.planTier === 'plus' || domain.planTier === 'pro'
  })

  const normalizedDomain = computed(() => normalizeDomain(domain.customDomain))

  const effectiveStatus = computed<DomainConnectionStatus>(() => {
    if (!isPaidPlan.value) return 'locked'
    return domain.status
  })

  const activationUrl = computed(() => {
    return normalizedDomain.value
      ? `https://${normalizedDomain.value}`
      : `https://${domain.platformUrl}`
  })

  const dnsRecords = computed<DnsRecord[]>(() => {
    if (!normalizedDomain.value || !domain.verificationToken) return []

    const isValid = effectiveStatus.value === 'active'

    return [
      {
        type: 'CNAME',
        host: 'www',
        value: resolveDomainTarget(domain.platformUrl),
        ttl: 'Auto',
        isValid
      },
      {
        type: 'TXT',
        host: '@',
        value: domain.verificationToken,
        ttl: 'Auto',
        isValid
      }
    ]
  })

  const statusMeta = computed<DomainStatusMeta>(() => {
    switch (effectiveStatus.value) {
      case 'locked':
        return {
          label: 'Bloqueado pelo plano',
          description: 'Domínio próprio fica disponível apenas em planos pagos.',
          color: 'neutral',
          icon: 'i-lucide-lock'
        }

      case 'pending_dns':
        return {
          label: 'Aguardando DNS',
          description: 'Configure os registros e depois valide a conexão do domínio.',
          color: 'warning',
          icon: 'i-lucide-refresh-cw'
        }

      case 'active':
        return {
          label: 'Ativo',
          description: 'Seu domínio personalizado já está pronto para publicação.',
          color: 'success',
          icon: 'i-lucide-badge-check'
        }

      case 'error':
        return {
          label: 'Erro na verificação',
          description: 'Os registros ainda não batem com o esperado.',
          color: 'error',
          icon: 'i-lucide-octagon-alert'
        }

      default:
        return {
          label: 'Não configurado',
          description: 'Informe um domínio e salve para gerar as instruções de DNS.',
          color: 'neutral',
          icon: 'i-lucide-globe'
        }
    }
  })

  function ensureVerificationToken() {
    if (!domain.verificationToken) {
      domain.verificationToken = createVerificationToken()
    }
  }

  function setPlanTier(tier: PlanTier) {
    domain.planTier = tier

    if (!isPaidPlan.value) {
      domain.status = 'locked'
      return
    }

    if (!normalizedDomain.value) {
      domain.status = 'draft'
      return
    }

    ensureVerificationToken()
    domain.status = domain.status === 'active' ? 'active' : 'pending_dns'
  }

  function saveDomain() {
    if (!isPaidPlan.value) return false

    domain.customDomain = normalizedDomain.value
    domain.lastCheckedAt = nowLabel()

    if (!domain.customDomain) {
      domain.verificationToken = ''
      domain.status = 'draft'
      return true
    }

    domain.verificationToken = createVerificationToken()
    domain.status = 'pending_dns'

    return true
  }

  function validateDns() {
    if (!isPaidPlan.value || !normalizedDomain.value) return false

    ensureVerificationToken()
    domain.status = 'active'
    domain.lastCheckedAt = nowLabel()

    return true
  }

  function simulateDnsError() {
    if (!isPaidPlan.value || !normalizedDomain.value) return false

    ensureVerificationToken()
    domain.status = 'error'
    domain.lastCheckedAt = nowLabel()

    return true
  }

  function removeDomain() {
    domain.customDomain = ''
    domain.verificationToken = ''
    domain.lastCheckedAt = '—'
    domain.status = isPaidPlan.value ? 'draft' : 'locked'
  }

  return {
    domain,
    isPaidPlan,
    normalizedDomain,
    activationUrl,
    dnsRecords,
    statusMeta,
    setPlanTier,
    saveDomain,
    validateDns,
    simulateDnsError,
    removeDomain
  }
}
