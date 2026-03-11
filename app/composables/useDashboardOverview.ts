import { computed } from 'vue'
import { useAuthState } from '~/composables/useAuthState'
import {
  initialAccount,
  type AccountData,
  type OnboardingStatus
} from '~/composables/usePerfilState'
import type { PortfolioPublicationStatus } from '~/types/portfolio'

export type DashboardOverviewProfile = {
  publicName: string
  headline: string
  hasPublicProfile: boolean
  hasProfessionalData: boolean
  hasContactData: boolean
  skillsCount: number
  updatedAt: string | null
}

export type DashboardOverviewEditor = {
  hasEditor: boolean
  hasCustomEditor: boolean
  projectCount: number
  updatedAt: string | null
}

export type DashboardOverviewPublication = {
  templateId: string | null
  publicSlug: string
  publicationStatus: PortfolioPublicationStatus
  publicUrl: string
  updatedAt: string | null
}

export type DashboardOverviewSummary = {
  hasProfileBase: boolean
  hasTemplate: boolean
  hasPublishedPortfolio: boolean
  completionCount: number
  completionTotal: number
  lastActivityAt: string | null
}

export type DashboardOverviewPayload = {
  account: AccountData
  profile: DashboardOverviewProfile
  editor: DashboardOverviewEditor
  publication: DashboardOverviewPublication
  summary: DashboardOverviewSummary
  updatedAt: string | null
}

function cloneAccountData(account: AccountData): AccountData {
  return {
    ...account
  }
}

function createInitialOverview(): DashboardOverviewPayload {
  return {
    account: cloneAccountData(initialAccount),
    profile: {
      publicName: '',
      headline: '',
      hasPublicProfile: false,
      hasProfessionalData: false,
      hasContactData: false,
      skillsCount: 0,
      updatedAt: null
    },
    editor: {
      hasEditor: false,
      hasCustomEditor: false,
      projectCount: 0,
      updatedAt: null
    },
    publication: {
      templateId: null,
      publicSlug: '',
      publicationStatus: 'draft',
      publicUrl: '',
      updatedAt: null
    },
    summary: {
      hasProfileBase: false,
      hasTemplate: false,
      hasPublishedPortfolio: false,
      completionCount: 0,
      completionTotal: 5,
      lastActivityAt: null
    },
    updatedAt: null
  }
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function normalizeBoolean(value: unknown) {
  return Boolean(value)
}

function normalizeOnboardingStatus(value: unknown): OnboardingStatus {
  return value === 'completed' || value === 'in_progress' ? value : 'not_started'
}

function normalizePublicationStatus(value: unknown): PortfolioPublicationStatus {
  return value === 'published' ? 'published' : 'draft'
}

function normalizePlan(value: unknown): AccountData['plan'] {
  return value === 'plus' || value === 'pro' ? value : 'free'
}

function normalizeCount(value: unknown, fallback = 0) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback
  }

  return Math.floor(parsed)
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

function normalizeProfileData(value: unknown): DashboardOverviewProfile {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    publicName: normalizeText(source.publicName),
    headline: normalizeText(source.headline),
    hasPublicProfile: normalizeBoolean(source.hasPublicProfile),
    hasProfessionalData: normalizeBoolean(source.hasProfessionalData),
    hasContactData: normalizeBoolean(source.hasContactData),
    skillsCount: normalizeCount(source.skillsCount),
    updatedAt: normalizeText(source.updatedAt) || null
  }
}

function normalizeEditorData(value: unknown): DashboardOverviewEditor {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    hasEditor: normalizeBoolean(source.hasEditor),
    hasCustomEditor: normalizeBoolean(source.hasCustomEditor),
    projectCount: normalizeCount(source.projectCount),
    updatedAt: normalizeText(source.updatedAt) || null
  }
}

function normalizePublicationData(value: unknown): DashboardOverviewPublication {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    templateId: normalizeText(source.templateId) || null,
    publicSlug: normalizeText(source.publicSlug),
    publicationStatus: normalizePublicationStatus(source.publicationStatus),
    publicUrl: normalizeText(source.publicUrl),
    updatedAt: normalizeText(source.updatedAt) || null
  }
}

function normalizeSummaryData(value: unknown): DashboardOverviewSummary {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    hasProfileBase: normalizeBoolean(source.hasProfileBase),
    hasTemplate: normalizeBoolean(source.hasTemplate),
    hasPublishedPortfolio: normalizeBoolean(source.hasPublishedPortfolio),
    completionCount: normalizeCount(source.completionCount),
    completionTotal: normalizeCount(source.completionTotal, 5) || 5,
    lastActivityAt: normalizeText(source.lastActivityAt) || null
  }
}

function normalizePayload(value: unknown): DashboardOverviewPayload {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    account: normalizeAccountData(source.account),
    profile: normalizeProfileData(source.profile),
    editor: normalizeEditorData(source.editor),
    publication: normalizePublicationData(source.publication),
    summary: normalizeSummaryData(source.summary),
    updatedAt: normalizeText(source.updatedAt) || null
  }
}

function getCurrentAccountKey(email: string | null | undefined) {
  return normalizeText(email).toLowerCase() || null
}

export function useDashboardOverview() {
  const { session } = useAuthState()

  const loadingFromServer = useState<boolean>('dashboard-overview-loading', () => false)
  const hydratedForAccount = useState<string | null>('dashboard-overview-hydrated-for-account', () => null)
  const lastLoadedAt = useState<string | null>('dashboard-overview-last-loaded-at', () => null)
  const overview = useState<DashboardOverviewPayload>('dashboard-overview-payload', createInitialOverview)

  const completionPercent = computed(() => {
    const total = overview.value.summary.completionTotal || 1
    return Math.round((overview.value.summary.completionCount / total) * 100)
  })

  function resetRemoteState() {
    hydratedForAccount.value = null
    lastLoadedAt.value = null
    overview.value = createInitialOverview()
  }

  function applyRemotePayload(payload: DashboardOverviewPayload) {
    const normalized = normalizePayload(payload)

    overview.value = normalized
    lastLoadedAt.value = normalized.updatedAt

    return normalized
  }

  async function loadOverviewFromServer(force = false): Promise<DashboardOverviewPayload | null> {
    const accountKey = getCurrentAccountKey(session.value?.email)

    if (!session.value || !accountKey) {
      resetRemoteState()
      return null
    }

    if (!force && hydratedForAccount.value === accountKey) {
      return overview.value
    }

    loadingFromServer.value = true

    try {
      const response = await $fetch<DashboardOverviewPayload>('/api/dashboard/overview')
      const payload = applyRemotePayload(response)

      hydratedForAccount.value = accountKey

      return payload
    } catch {
      if (hydratedForAccount.value === accountKey) {
        return overview.value
      }

      return null
    } finally {
      loadingFromServer.value = false
    }
  }

  return {
    completionPercent,
    lastLoadedAt,
    loadOverviewFromServer,
    loadingFromServer,
    overview,
    resetRemoteState
  }
}