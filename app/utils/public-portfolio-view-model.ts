import type {
  PublicPortfolioLink,
  PublicPortfolioPayload
} from '~/types/public-portfolio'
import type { PortfolioPublicViewModel } from '~/types/portfolio-public-view-model'

function normalizeText(value: string | null | undefined) {
  return String(value ?? '').trim()
}

function normalizeLabel(value: string | null | undefined) {
  return normalizeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function findLink(
  items: PublicPortfolioLink[],
  labels: string[]
): PublicPortfolioLink | null {
  const normalizedLabels = labels.map((label) => normalizeLabel(label))

  return items.find((item) => normalizedLabels.includes(normalizeLabel(item.label))) ?? null
}

function resolveExternalLink(
  items: PublicPortfolioLink[],
  labels: string[]
) {
  const item = findLink(items, labels)

  if (!item) {
    return ''
  }

  return normalizeText(item.href) || normalizeText(item.value)
}

function resolveEmail(items: PublicPortfolioLink[]) {
  const item = findLink(items, ['E-mail', 'Email'])

  if (!item) {
    return ''
  }

  return normalizeText(item.value).replace(/^mailto:/i, '')
}

function resolveWhatsapp(items: PublicPortfolioLink[]) {
  const item = findLink(items, ['WhatsApp'])

  if (!item) {
    return ''
  }

  return normalizeText(item.value) || normalizeText(item.href)
}

export function buildPortfolioPublicViewModel(
  payload: PublicPortfolioPayload
): PortfolioPublicViewModel {
  return {
    settings: {
      templateId: normalizeText(payload.templateId) || null,
      templatePresetId: null,
      publicSlug: normalizeText(payload.publicSlug),
      publicationStatus: payload.publicationStatus
    },

    hero: {
      publicName: normalizeText(payload.publicName),
      headline: normalizeText(payload.headline),
      roleTitle: normalizeText(payload.roleTitle),
      location: normalizeText(payload.location),
      skills: payload.skills
        .map((skill) => normalizeText(skill))
        .filter(Boolean)
    },

    about: {
      summary: normalizeText(payload.summary)
    },

    projects: payload.projects.map((project, index) => ({
      id: normalizeText(project.id) || `project-${index + 1}`,
      title: normalizeText(project.title),
      category: normalizeText(project.category),
      summary: normalizeText(project.summary),
      link: normalizeText(project.link),
      featured: Boolean(project.featured)
    })),

    contact: {
      publicEmail: resolveEmail(payload.links),
      linkedin: resolveExternalLink(payload.links, ['LinkedIn']),
      github: resolveExternalLink(payload.links, ['GitHub']),
      website: resolveExternalLink(payload.links, ['Website']),
      whatsapp: resolveWhatsapp(payload.links)
    }
  }
}