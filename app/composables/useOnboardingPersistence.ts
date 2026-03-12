import { useAuthState } from '~/composables/useAuthState'
import {
  useOnboardingState,
  type OnboardingProjectItem
} from '~/composables/useOnboardingState'
import {
  useOnboardingAccess,
  type OnboardingAccessStatus
} from '~/composables/useOnboardingAccess'
function normalizeSessionScope(value: string | undefined | null) {
  return String(value ?? '').trim().toLowerCase() || 'guest'
}

type OnboardingRemotePayload = {
  account: {
    onboardingStatus: OnboardingAccessStatus
  }
  profile: {
    publicName: string
    headline: string
    location: string
    publicEmail: string
    bio: string
    linkedin: string
    github: string
    website: string
    whatsapp: string
  }
  professional: {
    roleTitle: string
    professionalSummary: string
    workArea: string
    experienceLevel: string
    mainSkills: string[]
  }
  projects: OnboardingProjectItem[]
}

export function useOnboardingPersistence() {
  //  =========== Dependências ================
  //  ----------- Estado Compartilhado --------------

  const { session } = useAuthState()
  const { syncOnboardingAccess } = useOnboardingAccess()
  const {
    finished,
    professional,
    projects,
    publicProfile
  } = useOnboardingState()

  //  =========== Estado Remoto ================
  //  ----------- Loading e Saving --------------

  const loadingFromServer = useState<boolean>('onboarding-loading-from-server', () => false)
  const savingToServer = useState<boolean>('onboarding-saving-to-server', () => false)
  const hydratedFromServer = useState<boolean>('onboarding-hydrated-from-server', () => false)
  const hydratedScope = useState<string>('onboarding-hydrated-scope', () =>
    normalizeSessionScope(session.value?.email)
  )

  const currentScope = () => normalizeSessionScope(session.value?.email)

  if (hydratedScope.value !== currentScope()) {
    hydratedScope.value = currentScope()
    hydratedFromServer.value = false
  }

  function applyRemotePayload(payload: OnboardingRemotePayload) {
    publicProfile.value = {
      publicName: payload.profile.publicName || session.value?.username || '',
      headline: payload.profile.headline,
      location: payload.profile.location,
      publicEmail: payload.profile.publicEmail || session.value?.email || '',
      bio: payload.profile.bio,
      linkedin: payload.profile.linkedin,
      github: payload.profile.github,
      website: payload.profile.website,
      whatsapp: payload.profile.whatsapp
    }

    professional.value = {
      roleTitle: payload.professional.roleTitle,
      professionalSummary: payload.professional.professionalSummary,
      workArea: payload.professional.workArea,
      experienceLevel: payload.professional.experienceLevel,
      mainSkills: payload.professional.mainSkills
    }

    projects.value = {
      draft: {
        title: '',
        category: '',
        summary: '',
        link: ''
      },
      items: payload.projects
    }

    syncOnboardingAccess(payload.account.onboardingStatus)
    finished.value = payload.account.onboardingStatus === 'completed'
  }

async function loadOnboardingFromServer(force = false) {
  if (!session.value) {
    hydratedFromServer.value = false
    hydratedScope.value = 'guest'
    return false
  }

  const scope = currentScope()

  if (hydratedFromServer.value && hydratedScope.value === scope && !force) {
    return true
  }

  loadingFromServer.value = true

  try {
    const payload = await $fetch<OnboardingRemotePayload>('/api/onboarding')
    applyRemotePayload(payload)
    hydratedFromServer.value = true
    hydratedScope.value = scope

    return true
  } catch {
    return false
  } finally {
    loadingFromServer.value = false
  }
}

  async function saveOnboardingToServer(status: OnboardingAccessStatus) {
    if (!session.value) {
      return false
    }

    savingToServer.value = true

    try {
      await $fetch('/api/onboarding/save', {
        method: 'POST',
        body: {
          onboardingStatus: status,
          publicProfile: publicProfile.value,
          professional: professional.value,
          projects: projects.value.items
        }
      })
      hydratedFromServer.value = true
      hydratedScope.value = currentScope()

      syncOnboardingAccess(status)
      finished.value = status === 'completed'

      return true
    } catch {
      return false
    } finally {
      savingToServer.value = false
    }
  }

  return {
    hydratedFromServer,
    loadOnboardingFromServer,
    loadingFromServer,
    saveOnboardingToServer,
    savingToServer
  }
}