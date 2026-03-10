import { getRouterParam } from 'h3'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'
import type { Json } from '~/types/database.types'
import type {
  PublicPortfolioLink,
  PublicPortfolioPayload,
  PublicPortfolioProject,
  PublicPortfolioVisibility
} from '~/types/public-portfolio'
import { serverSupabaseAdmin } from '~/utils/supabase/admin'

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

function sanitizePortfolioSlug(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseVisibility(value: Json | null): PublicPortfolioVisibility {
  const source = isRecord(value) ? value : {}

  return {
    hero: source.hero !== false,
    about: source.about !== false,
    projects: source.projects !== false,
    contact: source.contact !== false
  }
}

function parseMainSkills(value: Json | null) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 6)
}

function parseSkillsText(value: unknown) {
  return normalizeText(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6)
}

function mergeSkills(skillsText: unknown, mainSkills: Json | null) {
  return Array.from(
    new Set([
      ...parseSkillsText(skillsText),
      ...parseMainSkills(mainSkills)
    ])
  ).slice(0, 6)
}

function parseProjects(value: Json | null): PublicPortfolioProject[] {
  if (!Array.isArray(value)) {
    return []
  }

  const mapped = value.flatMap((item, index) => {
    if (!isRecord(item)) {
      return []
    }

    return [
      {
        id: normalizeText(item.id) || `project-${index + 1}`,
        title: normalizeText(item.title) || `Projeto ${index + 1}`,
        category: normalizeText(item.category) || 'Projeto',
        summary: normalizeText(item.summary) || 'Sem resumo informado ainda.',
        link: normalizeOptionalUrl(item.link),
        featured: Boolean(item.featured)
      }
    ]
  }).slice(0, 3)

  if (mapped.length > 0 && !mapped.some((project) => project.featured)) {
    const firstProject = mapped[0]

    if (firstProject) {
      mapped[0] = {
        ...firstProject,
        featured: true
      }
    }
  }

  return mapped
}

function buildLinks(
  contact: Record<string, unknown>,
  profile: {
    publicEmail: string
    linkedin: string
    github: string
    website: string
    whatsapp: string
  }
): PublicPortfolioLink[] {
  const items: PublicPortfolioLink[] = []

  const linkedin = normalizeOptionalUrl(contact.linkedin ?? profile.linkedin)
  const github = normalizeOptionalUrl(contact.github ?? profile.github)
  const website = normalizeOptionalUrl(contact.website ?? profile.website)
  const publicEmail = normalizeText(contact.publicEmail ?? profile.publicEmail).toLowerCase()
  const whatsapp = normalizeText(contact.whatsapp ?? profile.whatsapp)

  if (linkedin) {
    items.push({
      label: 'LinkedIn',
      value: linkedin,
      href: linkedin
    })
  }

  if (github) {
    items.push({
      label: 'GitHub',
      value: github,
      href: github
    })
  }

  if (website) {
    items.push({
      label: 'Website',
      value: website,
      href: website
    })
  }

  if (publicEmail) {
    items.push({
      label: 'E-mail',
      value: publicEmail,
      href: `mailto:${publicEmail}`
    })
  }

  if (whatsapp) {
    const digits = whatsapp.replace(/\D/g, '')

    if (digits) {
      items.push({
        label: 'WhatsApp',
        value: whatsapp,
        href: `https://wa.me/${digits}`
      })
    }
  }

  return items
}

export default defineEventHandler(async (event) => {
  const slug = sanitizePortfolioSlug(getRouterParam(event, 'slug'))

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug público inválido.'
    })
  }

  const supabase = serverSupabaseAdmin()

  const { data: settings, error: settingsError } = await supabase
    .from('portfolio_settings')
    .select('id, template_id, public_slug, publication_status')
    .eq('public_slug', slug)
    .eq('publication_status', 'published')
    .maybeSingle()

  if (settingsError) {
    throw createError({
      statusCode: 500,
      statusMessage: settingsError.message
    })
  }

  if (!settings || !settings.template_id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Este portfólio não está publicado ou não foi encontrado.'
    })
  }

  const templateExists = PORTFOLIO_TEMPLATES.some((template) => template.id === settings.template_id)

  if (!templateExists) {
    throw createError({
      statusCode: 500,
      statusMessage: 'O template publicado não foi encontrado.'
    })
  }

  const [
    { data: profile, error: profileError },
    { data: professional, error: professionalError },
    { data: editor, error: editorError }
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('public_name, headline, bio, location, public_email, linkedin, github, website, whatsapp')
      .eq('id', settings.id)
      .maybeSingle(),

    supabase
      .from('professional_data')
      .select('role_title, professional_summary, main_skills')
      .eq('id', settings.id)
      .maybeSingle(),

    supabase
      .from('portfolio_editor')
      .select('visibility, hero, about, contact, projects')
      .eq('id', settings.id)
      .maybeSingle()
  ])

  if (profileError || professionalError || editorError) {
    throw createError({
      statusCode: 500,
      statusMessage:
        profileError?.message ||
        professionalError?.message ||
        editorError?.message ||
        'Não foi possível carregar o portfólio público.'
    })
  }

  const hero = isRecord(editor?.hero) ? editor.hero : {}
  const about = isRecord(editor?.about) ? editor.about : {}
  const contact = isRecord(editor?.contact) ? editor.contact : {}

  const payload: PublicPortfolioPayload = {
    templateId: settings.template_id,
    publicSlug: settings.public_slug,
    publicationStatus: 'published',
    visibility: parseVisibility((editor?.visibility ?? null) as Json | null),
    publicName:
      normalizeText(hero.publicName) ||
      normalizeText(profile?.public_name) ||
      'Portfólio',
    headline:
      normalizeText(hero.headline) ||
      normalizeText(profile?.headline),
    roleTitle:
      normalizeText(hero.roleTitle) ||
      normalizeText(professional?.role_title),
    summary:
      normalizeText(about.summary) ||
      normalizeText(professional?.professional_summary) ||
      normalizeText(profile?.bio),
    location:
      normalizeText(hero.location) ||
      normalizeText(profile?.location),
    skills: mergeSkills(
      hero.skillsText,
      (professional?.main_skills ?? null) as Json | null
    ),
    links: buildLinks(contact, {
      publicEmail: normalizeText(contact.publicEmail) || normalizeText(profile?.public_email),
      linkedin: normalizeText(contact.linkedin) || normalizeText(profile?.linkedin),
      github: normalizeText(contact.github) || normalizeText(profile?.github),
      website: normalizeText(contact.website) || normalizeText(profile?.website),
      whatsapp: normalizeText(contact.whatsapp) || normalizeText(profile?.whatsapp)
    }),
    projects: parseProjects((editor?.projects ?? null) as Json | null)
  }

  return payload
})