import { useAuthState } from '~/composables/useAuthState'
import { useOnboardingState } from '~/composables/useOnboardingState'
import {
  initialAccount,
  initialUser,
  type AccountData,
  type OnboardingStatus,
  type UserProfile
} from '~/composables/usePerfilState'
import type { PortfolioPublicationStatus } from '~/types/portfolio'

export type ProfileRemotePayload = {
  profile: UserProfile
  account: AccountData
  updatedAt: string | null
}

type ProfileRemoteSaveResult =
  | {
      ok: true
      payload: ProfileRemotePayload
    }
  | {
      ok: false
      error: string
    }

function cloneUserProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    mainSkills: [...profile.mainSkills]
  }
}

function cloneAccountData(account: AccountData): AccountData {
  return {
    ...account
  }
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function normalizeOptionalUrl(value: unknown) {
  const trimmed = normalizeText(value)

  if (!trimmed) {
    return ''
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function normalizeMainSkills(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 12)
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

function normalizeUserProfile(value: unknown): UserProfile {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    publicName: normalizeText(source.publicName),
    headline: normalizeText(source.headline),
    bio: normalizeText(source.bio),
    location: normalizeText(source.location),
    publicEmail: normalizeText(source.publicEmail).toLowerCase(),
    linkedin: normalizeOptionalUrl(source.linkedin),
    github: normalizeOptionalUrl(source.github),
    website: normalizeOptionalUrl(source.website),
    whatsapp: normalizeText(source.whatsapp),
    roleTitle: normalizeText(source.roleTitle),
    professionalSummary: normalizeText(source.professionalSummary),
    workArea: normalizeText(source.workArea),
    experienceLevel: normalizeText(source.experienceLevel),
    mainSkills: normalizeMainSkills(source.mainSkills)
  }
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

function normalizePayload(value: unknown): ProfileRemotePayload {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    profile: normalizeUserProfile(source.profile),
    account: normalizeAccountData(source.account),
    updatedAt: normalizeText(source.updatedAt) || null
  }
}

function getCurrentAccountKey(email: string | null | undefined) {
  return normalizeText(email).toLowerCase() || null
}

export function useProfilePersistence() {
  const { session } = useAuthState()
  const { publicProfile, professional } = useOnboardingState()

  const loadingFromServer = useState<boolean>('profile-loading-from-server', () => false)
  const savingToServer = useState<boolean>('profile-saving-to-server', () => false)
  const hydratedForAccount = useState<string | null>('profile-hydrated-for-account', () => null)
  const lastSavedAt = useState<string | null>('profile-last-saved-at', () => null)

  const cachedProfile = useState<UserProfile>('profile-cached-profile', () =>
    cloneUserProfile(initialUser)
  )

  const cachedAccount = useState<AccountData>('profile-cached-account', () =>
    cloneAccountData(initialAccount)
  )

  function buildCachedPayload(): ProfileRemotePayload {
    return {
      profile: cloneUserProfile(cachedProfile.value),
      account: cloneAccountData(cachedAccount.value),
      updatedAt: lastSavedAt.value
    }
  }

  function resetRemoteState() {
    hydratedForAccount.value = null
    lastSavedAt.value = null
    cachedProfile.value = cloneUserProfile(initialUser)
    cachedAccount.value = cloneAccountData(initialAccount)
  }

  function applyRemotePayload(payload: ProfileRemotePayload) {
    const normalized = normalizePayload(payload)

    cachedProfile.value = cloneUserProfile(normalized.profile)
    cachedAccount.value = cloneAccountData(normalized.account)

    publicProfile.value = {
      publicName: normalized.profile.publicName || session.value?.username || '',
      headline: normalized.profile.headline,
      location: normalized.profile.location,
      publicEmail: normalized.profile.publicEmail || session.value?.email || '',
      bio: normalized.profile.bio,
      linkedin: normalized.profile.linkedin,
      github: normalized.profile.github,
      website: normalized.profile.website,
      whatsapp: normalized.profile.whatsapp
    }

    professional.value = {
      roleTitle: normalized.profile.roleTitle,
      professionalSummary: normalized.profile.professionalSummary,
      workArea: normalized.profile.workArea,
      experienceLevel: normalized.profile.experienceLevel,
      mainSkills: [...normalized.profile.mainSkills]
    }

    if (session.value) {
      session.value = {
        ...session.value,
        email: normalized.account.email || session.value.email,
        username: normalized.account.username || session.value.username
      }
    }

    lastSavedAt.value = normalized.updatedAt

    return normalized
  }

  async function loadProfileFromServer(force = false): Promise<ProfileRemotePayload | null> {
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
      const response = await $fetch<ProfileRemotePayload>('/api/profile')
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

  async function saveProfileToServer(payload: UserProfile): Promise<ProfileRemoteSaveResult> {
    const accountKey = getCurrentAccountKey(session.value?.email)

    if (!session.value || !accountKey) {
      return {
        ok: false,
        error: 'Sua sessão expirou. Faça login novamente para salvar o perfil.'
      }
    }

    savingToServer.value = true

    try {
      const response = await $fetch<ProfileRemotePayload>('/api/profile/save', {
        method: 'POST',
        body: {
          profile: normalizeUserProfile(payload)
        }
      })

      const normalized = applyRemotePayload(response)

      hydratedForAccount.value = accountKey

      return {
        ok: true,
        payload: normalized
      }
    } catch (error: any) {
      return {
        ok: false,
        error:
          error?.data?.statusMessage ||
          error?.statusMessage ||
          error?.message ||
          'Não foi possível salvar o perfil agora.'
      }
    } finally {
      savingToServer.value = false
    }
  }

  return {
    lastSavedAt,
    loadProfileFromServer,
    loadingFromServer,
    resetRemoteState,
    saveProfileToServer,
    savingToServer
  }
}