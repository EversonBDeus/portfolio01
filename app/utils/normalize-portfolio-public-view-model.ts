import {
  isPortfolioTemplatePresetId,
} from '~/data/portfolio-template-registry'
import type {
  PortfolioPublicProjectViewModel,
  PortfolioPublicViewModel,
} from '~/types/portfolio-public-view-model'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

type LooseRecord = Record<string, unknown>

function asRecord(value: unknown): LooseRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as LooseRecord
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function readNullableString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()
  return normalized ? normalized : null
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function readPublicationStatus(
  value: unknown,
): PortfolioPublicViewModel['settings']['publicationStatus'] {
  return value === 'draft' ? 'draft' : 'published'
}

function readTemplatePresetId(value: unknown): PortfolioTemplatePresetId | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  if (!normalized || !isPortfolioTemplatePresetId(normalized)) {
    return null
  }

  return normalized
}

function normalizeProject(
  value: unknown,
  index: number,
): PortfolioPublicProjectViewModel {
  const source = asRecord(value)

  return {
    id: readNullableString(source?.id) ?? `project-${index + 1}`,
    title: readString(source?.title),
    category: readString(source?.category),
    summary: readString(source?.summary),
    link: readString(source?.link),
    featured: Boolean(source?.featured),
  }
}

export function normalizePortfolioPublicViewModel(
  input: unknown,
): PortfolioPublicViewModel | null {
  const source = asRecord(input)

  if (!source) {
    return null
  }

  const settings = asRecord(source.settings)
  const hero = asRecord(source.hero)
  const about = asRecord(source.about)
  const contact = asRecord(source.contact)
  const links = asRecord(source.links)
  const profile = asRecord(source.profile)

  const projectsSource = Array.isArray(source.projects) ? source.projects : []
  const aboutSummary
    = readString(about?.summary)
      || readString(source.summary)
      || readString(profile?.bio)

  return {
    settings: {
      templateId: readNullableString(settings?.templateId ?? source.templateId),
      templatePresetId: readTemplatePresetId(
        settings?.templatePresetId ?? source.templatePresetId,
      ),
      publicSlug: readString(settings?.publicSlug ?? source.publicSlug),
      publicationStatus: readPublicationStatus(
        settings?.publicationStatus ?? source.publicationStatus,
      ),
    },
    hero: {
      publicName: readString(hero?.publicName ?? source.publicName),
      headline: readString(hero?.headline ?? source.headline),
      roleTitle: readString(hero?.roleTitle ?? source.roleTitle),
      location: readString(hero?.location ?? source.location),
      skills: readStringArray(hero?.skills ?? source.skills),
    },
    about: {
      summary: aboutSummary,
    },
    projects: projectsSource.map(normalizeProject),
    contact: {
      publicEmail: readString(contact?.publicEmail ?? links?.publicEmail ?? source.publicEmail),
      linkedin: readString(
        contact?.linkedin
        ?? contact?.linkedIn
        ?? links?.linkedin
        ?? links?.linkedIn
        ?? source.linkedin,
      ),
      github: readString(contact?.github ?? links?.github ?? source.github),
      website: readString(contact?.website ?? links?.website ?? source.website),
      whatsapp: readString(contact?.whatsapp ?? links?.whatsapp ?? source.whatsapp),
    },
  }
}