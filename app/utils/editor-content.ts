import type {
  PortfolioEditorAboutPayload,
  PortfolioEditorAboutRecord,
  PortfolioEditorBaseContentPayload,
  PortfolioEditorContactPayload,
  PortfolioEditorContactRecord,
  PortfolioEditorHeroPayload,
  PortfolioEditorHeroRecord,
  PortfolioEditorSectionMode
} from '~/types/portfolio'

type BuildEditorBaseContentInput = {
  publicName: unknown
  headline: unknown
  roleTitle: unknown
  professionalSummary: unknown
  bio: unknown
  location: unknown
  publicEmail: unknown
  linkedin: unknown
  github: unknown
  website: unknown
  whatsapp: unknown
  mainSkills: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

export function normalizeOptionalUrl(value: unknown) {
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
    .slice(0, 6)
}

export function buildEditorBaseContent(
  input: BuildEditorBaseContentInput
): PortfolioEditorBaseContentPayload {
  const mainSkills = normalizeMainSkills(input.mainSkills)

  return {
    hero: {
      publicName: normalizeText(input.publicName),
      headline: normalizeText(input.headline),
      roleTitle: normalizeText(input.roleTitle),
      location: normalizeText(input.location),
      skillsText: mainSkills.join(', ')
    },
    about: {
      summary: normalizeText(input.professionalSummary) || normalizeText(input.bio)
    },
    contact: {
      publicEmail: normalizeText(input.publicEmail).toLowerCase(),
      whatsapp: normalizeText(input.whatsapp),
      website: normalizeOptionalUrl(input.website),
      linkedin: normalizeOptionalUrl(input.linkedin),
      github: normalizeOptionalUrl(input.github)
    }
  }
}

export function getEditorSectionMode(value: unknown): PortfolioEditorSectionMode | null {
  if (!isRecord(value)) {
    return null
  }

  return value.__mode === 'base' || value.__mode === 'custom' ? value.__mode : null
}

export function normalizeHeroPayload(value: unknown): PortfolioEditorHeroPayload {
  const source = isRecord(value) ? value : {}

  return {
    publicName: normalizeText(source.publicName),
    headline: normalizeText(source.headline),
    roleTitle: normalizeText(source.roleTitle),
    location: normalizeText(source.location),
    skillsText: normalizeText(source.skillsText)
  }
}

export function normalizeAboutPayload(value: unknown): PortfolioEditorAboutPayload {
  const source = isRecord(value) ? value : {}

  return {
    summary: normalizeText(source.summary)
  }
}

export function normalizeContactPayload(value: unknown): PortfolioEditorContactPayload {
  const source = isRecord(value) ? value : {}

  return {
    publicEmail: normalizeText(source.publicEmail).toLowerCase(),
    whatsapp: normalizeText(source.whatsapp),
    website: normalizeOptionalUrl(source.website),
    linkedin: normalizeOptionalUrl(source.linkedin),
    github: normalizeOptionalUrl(source.github)
  }
}

function isSameHero(
  current: PortfolioEditorHeroPayload,
  base: PortfolioEditorHeroPayload
) {
  return (
    current.publicName === base.publicName &&
    current.headline === base.headline &&
    current.roleTitle === base.roleTitle &&
    current.location === base.location &&
    current.skillsText === base.skillsText
  )
}

function isSameAbout(
  current: PortfolioEditorAboutPayload,
  base: PortfolioEditorAboutPayload
) {
  return current.summary === base.summary
}

function isSameContact(
  current: PortfolioEditorContactPayload,
  base: PortfolioEditorContactPayload
) {
  return (
    current.publicEmail === base.publicEmail &&
    current.whatsapp === base.whatsapp &&
    current.website === base.website &&
    current.linkedin === base.linkedin &&
    current.github === base.github
  )
}

function mergeHero(
  base: PortfolioEditorHeroPayload,
  current: PortfolioEditorHeroPayload
): PortfolioEditorHeroPayload {
  return {
    publicName: current.publicName || base.publicName,
    headline: current.headline || base.headline,
    roleTitle: current.roleTitle || base.roleTitle,
    location: current.location || base.location,
    skillsText: current.skillsText || base.skillsText
  }
}

function mergeAbout(
  base: PortfolioEditorAboutPayload,
  current: PortfolioEditorAboutPayload
): PortfolioEditorAboutPayload {
  return {
    summary: current.summary || base.summary
  }
}

function mergeContact(
  base: PortfolioEditorContactPayload,
  current: PortfolioEditorContactPayload
): PortfolioEditorContactPayload {
  return {
    publicEmail: current.publicEmail || base.publicEmail,
    whatsapp: current.whatsapp || base.whatsapp,
    website: current.website || base.website,
    linkedin: current.linkedin || base.linkedin,
    github: current.github || base.github
  }
}

export function buildHeroRecord(
  current: unknown,
  base: PortfolioEditorHeroPayload
): PortfolioEditorHeroRecord {
  const normalizedCurrent = normalizeHeroPayload(current)

  return {
    ...normalizedCurrent,
    __mode: isSameHero(normalizedCurrent, base) ? 'base' : 'custom'
  }
}

export function buildAboutRecord(
  current: unknown,
  base: PortfolioEditorAboutPayload
): PortfolioEditorAboutRecord {
  const normalizedCurrent = normalizeAboutPayload(current)

  return {
    ...normalizedCurrent,
    __mode: isSameAbout(normalizedCurrent, base) ? 'base' : 'custom'
  }
}

export function buildContactRecord(
  current: unknown,
  base: PortfolioEditorContactPayload
): PortfolioEditorContactRecord {
  const normalizedCurrent = normalizeContactPayload(current)

  return {
    ...normalizedCurrent,
    __mode: isSameContact(normalizedCurrent, base) ? 'base' : 'custom'
  }
}

export function resolveHeroRecord(
  base: PortfolioEditorHeroPayload,
  value: unknown
): PortfolioEditorHeroPayload {
  const normalizedCurrent = normalizeHeroPayload(value)
  const mode = getEditorSectionMode(value)

  if (mode === 'base') {
    return {
      ...base
    }
  }

  if (mode === 'custom') {
    return mergeHero(base, normalizedCurrent)
  }

  return isSameHero(normalizedCurrent, base)
    ? { ...base }
    : mergeHero(base, normalizedCurrent)
}

export function resolveAboutRecord(
  base: PortfolioEditorAboutPayload,
  value: unknown
): PortfolioEditorAboutPayload {
  const normalizedCurrent = normalizeAboutPayload(value)
  const mode = getEditorSectionMode(value)

  if (mode === 'base') {
    return {
      ...base
    }
  }

  if (mode === 'custom') {
    return mergeAbout(base, normalizedCurrent)
  }

  return isSameAbout(normalizedCurrent, base)
    ? { ...base }
    : mergeAbout(base, normalizedCurrent)
}

export function resolveContactRecord(
  base: PortfolioEditorContactPayload,
  value: unknown
): PortfolioEditorContactPayload {
  const normalizedCurrent = normalizeContactPayload(value)
  const mode = getEditorSectionMode(value)

  if (mode === 'base') {
    return {
      ...base
    }
  }

  if (mode === 'custom') {
    return mergeContact(base, normalizedCurrent)
  }

  return isSameContact(normalizedCurrent, base)
    ? { ...base }
    : mergeContact(base, normalizedCurrent)
}