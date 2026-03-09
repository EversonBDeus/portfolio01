import type { EditorSectionId } from '~/data/editor-sections'
import type { AuthSession } from '~/composables/useAuthState'
import type {
  OnboardingProfessionalData,
  OnboardingPublicProfileData
} from '~/composables/useOnboardingState'
import type {
  EditorAboutForm,
  EditorDevice,
  EditorHeroForm
} from '~/composables/useEditorState'
import type { EditorContactForm } from '~/schemas/editor-contact'
import type { EditorProjectForm } from '~/schemas/editor-project'
import type {
  PortfolioAggregatePayload,
  PortfolioEditorSectionId,
  PortfolioPlanId,
  PortfolioProjectPayload,
  PortfolioPublicationStatus
} from '~/types/portfolio'

export type BuildPortfolioAggregatePayloadInput = {
  authUserId: string
  session: AuthSession | null
  publicProfile: OnboardingPublicProfileData
  professional: OnboardingProfessionalData
  selectedTemplateId: string | null
  editor: {
    device: EditorDevice
    activeSection: EditorSectionId
    activeProjectId: string | null
    visibility: Record<EditorSectionId, boolean>
    hero: EditorHeroForm
    about: EditorAboutForm
    contact: EditorContactForm
    projects: EditorProjectForm[]
  }
  plan?: PortfolioPlanId
  publicSlug?: string
  publicationStatus?: PortfolioPublicationStatus
}

function normalizeText(value: string | null | undefined) {
  return String(value ?? '').trim()
}

function normalizeOptionalUrl(value: string | null | undefined) {
  const trimmed = normalizeText(value)

  if (!trimmed) {
    return ''
  }

  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`
}

export function normalizePortfolioSlug(value: string) {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized || 'meu-portfolio'
}

function normalizeProjects(items: EditorProjectForm[]): PortfolioProjectPayload[] {
  return items.map((item) => ({
    id: normalizeText(item.id),
    title: normalizeText(item.title),
    category: normalizeText(item.category),
    summary: normalizeText(item.summary),
    link: normalizeOptionalUrl(item.link),
    featured: Boolean(item.featured)
  }))
}

function normalizeEditorSectionId(value: EditorSectionId): PortfolioEditorSectionId {
  if (value === 'hero' || value === 'about' || value === 'projects' || value === 'contact') {
    return value
  }

  return 'hero'
}

function buildDefaultSlug(
  publicProfile: OnboardingPublicProfileData,
  session: AuthSession
) {
  return normalizePortfolioSlug(
    normalizeText(publicProfile.publicName) || normalizeText(session.username)
  )
}

export function buildPortfolioAggregatePayload(
  input: BuildPortfolioAggregatePayloadInput
): PortfolioAggregatePayload | null {
  if (!input.session) {
    return null
  }

  const publicSlug =
    normalizePortfolioSlug(input.publicSlug ?? '') ||
    buildDefaultSlug(input.publicProfile, input.session)

  return {
    account: {
      authUserId: input.authUserId,
      email: normalizeText(input.session.email).toLowerCase(),
      username: normalizeText(input.session.username),
      verified: Boolean(input.session.verified),
      plan: input.plan ?? 'free'
    },

    profile: {
      authUserId: input.authUserId,
      publicName: normalizeText(input.publicProfile.publicName),
      headline: normalizeText(input.publicProfile.headline),
      bio: normalizeText(input.publicProfile.bio),
      location: normalizeText(input.publicProfile.location),
      publicEmail: normalizeText(input.publicProfile.publicEmail).toLowerCase(),
      linkedin: normalizeOptionalUrl(input.publicProfile.linkedin),
      github: normalizeOptionalUrl(input.publicProfile.github),
      website: normalizeOptionalUrl(input.editor.contact.website),
      whatsapp: normalizeText(input.editor.contact.whatsapp)
    },

    professional: {
      authUserId: input.authUserId,
      roleTitle: normalizeText(input.professional.roleTitle),
      professionalSummary: normalizeText(input.professional.professionalSummary),
      workArea: normalizeText(input.professional.workArea),
      experienceLevel: normalizeText(input.professional.experienceLevel),
      mainSkills: input.professional.mainSkills
        .map((item) => normalizeText(item))
        .filter(Boolean)
    },

    settings: {
      authUserId: input.authUserId,
      templateId: input.selectedTemplateId,
      publicSlug,
      publicationStatus: input.publicationStatus ?? 'draft'
    },

    editor: {
      authUserId: input.authUserId,
      templateId: input.selectedTemplateId,
      device: input.editor.device,
      activeSection: normalizeEditorSectionId(input.editor.activeSection),
      activeProjectId: input.editor.activeProjectId,
      visibility: {
        hero: Boolean(input.editor.visibility.hero),
        about: Boolean(input.editor.visibility.about),
        projects: Boolean(input.editor.visibility.projects),
        contact: Boolean(input.editor.visibility.contact)
      },
      hero: {
        publicName: normalizeText(input.editor.hero.publicName),
        headline: normalizeText(input.editor.hero.headline),
        roleTitle: normalizeText(input.editor.hero.roleTitle),
        location: normalizeText(input.editor.hero.location),
        skillsText: normalizeText(input.editor.hero.skillsText)
      },
      about: {
        summary: normalizeText(input.editor.about.summary)
      },
      contact: {
        publicEmail: normalizeText(input.editor.contact.publicEmail).toLowerCase(),
        whatsapp: normalizeText(input.editor.contact.whatsapp),
        website: normalizeOptionalUrl(input.editor.contact.website),
        linkedin: normalizeOptionalUrl(input.editor.contact.linkedin),
        github: normalizeOptionalUrl(input.editor.contact.github)
      },
      projects: normalizeProjects(input.editor.projects)
    }
  }
}