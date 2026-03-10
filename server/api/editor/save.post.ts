import { readBody } from 'h3'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'
import {
  buildAboutRecord,
  buildContactRecord,
  buildEditorBaseContent,
  buildHeroRecord,
  normalizeOptionalUrl,
  normalizeText
} from '~/utils/editor-content'
import { serverSupabaseClient } from '~/utils/supabase/server'

type EditorSaveBody = {
  templateId: string | null
  device: 'desktop' | 'mobile'
  activeSection: 'hero' | 'about' | 'projects' | 'contact'
  activeProjectId: string | null
  visibility: {
    hero: boolean
    about: boolean
    projects: boolean
    contact: boolean
  }
  hero: {
    publicName: string
    headline: string
    roleTitle: string
    location: string
    skillsText: string
  }
  about: {
    summary: string
  }
  contact: {
    publicEmail: string
    whatsapp: string
    website: string
    linkedin: string
    github: string
  }
  projects: Array<{
    id: string
    title: string
    category: string
    summary: string
    link: string
    featured: boolean
  }>
}

function normalizeDevice(value: unknown) {
  return value === 'mobile' ? 'mobile' : 'desktop'
}

function normalizeSection(value: unknown) {
  return value === 'about' || value === 'projects' || value === 'contact'
    ? value
    : 'hero'
}

function normalizeVisibility(value: EditorSaveBody['visibility'] | undefined) {
  return {
    hero: Boolean(value?.hero ?? true),
    about: Boolean(value?.about ?? true),
    projects: Boolean(value?.projects ?? true),
    contact: Boolean(value?.contact ?? true)
  }
}

function normalizeProjects(items: EditorSaveBody['projects'] | undefined) {
  const projects = Array.isArray(items) ? items : []

  const normalized: EditorSaveBody['projects'] = projects.slice(0, 3).map((item, index) => ({
    id: normalizeText(item.id) || `editor-project-${index + 1}`,
    title: normalizeText(item.title),
    category: normalizeText(item.category),
    summary: normalizeText(item.summary),
    link: normalizeOptionalUrl(item.link),
    featured: Boolean(item.featured)
  }))

  const uniqueProjects: EditorSaveBody['projects'] = normalized.filter((project, index, all) => {
    return all.findIndex((item) => item.id === project.id) === index
  })

  if (uniqueProjects.length > 0 && !uniqueProjects.some((project) => project.featured)) {
    const firstProject = uniqueProjects[0]

    if (firstProject) {
      uniqueProjects[0] = {
        id: firstProject.id,
        title: firstProject.title,
        category: firstProject.category,
        summary: firstProject.summary,
        link: firstProject.link,
        featured: true
      }
    }
  }

  return uniqueProjects
}

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseClient(event)

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: authError?.message ?? 'Usuário não autenticado.'
    })
  }

  const body = await readBody<EditorSaveBody>(event)
  const templateId = normalizeText(body?.templateId) || null

  if (!templateId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Selecione um template válido antes de salvar o editor.'
    })
  }

  const templateExists = PORTFOLIO_TEMPLATES.some((template) => template.id === templateId)

  if (!templateExists) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Template não encontrado.'
    })
  }

  const [
    { data: profile, error: profileError },
    { data: professional, error: professionalError }
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('public_name, headline, bio, location, public_email, linkedin, github, website, whatsapp')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('professional_data')
      .select('role_title, professional_summary, main_skills')
      .eq('id', user.id)
      .maybeSingle()
  ])

  if (profileError || professionalError) {
    throw createError({
      statusCode: 500,
      statusMessage:
        profileError?.message ||
        professionalError?.message ||
        'Não foi possível carregar a base atual do editor.'
    })
  }

  const baseContent = buildEditorBaseContent({
    publicName: profile?.public_name,
    headline: profile?.headline,
    roleTitle: professional?.role_title,
    professionalSummary: professional?.professional_summary,
    bio: profile?.bio,
    location: profile?.location,
    publicEmail: profile?.public_email || user.email,
    linkedin: profile?.linkedin,
    github: profile?.github,
    website: profile?.website,
    whatsapp: profile?.whatsapp,
    mainSkills: professional?.main_skills ?? null
  })

  const normalizedProjects = normalizeProjects(body?.projects)

  const { error: saveError } = await supabase
    .from('portfolio_editor')
    .upsert(
      {
        id: user.id,
        template_id: templateId,
        device: normalizeDevice(body?.device),
        active_section: normalizeSection(body?.activeSection),
        active_project_id:
          typeof body?.activeProjectId === 'string' &&
          normalizedProjects.some((project) => project.id === body.activeProjectId)
            ? body.activeProjectId
            : normalizedProjects[0]?.id ?? null,
        visibility: normalizeVisibility(body?.visibility),
        hero: buildHeroRecord(body?.hero, baseContent.hero),
        about: buildAboutRecord(body?.about, baseContent.about),
        contact: buildContactRecord(body?.contact, baseContent.contact),
        projects: normalizedProjects
      },
      { onConflict: 'id' }
    )

  if (saveError) {
    throw createError({
      statusCode: 500,
      statusMessage: saveError.message
    })
  }

  const { data: updatedRow, error: updatedRowError } = await supabase
    .from('portfolio_editor')
    .select('updated_at')
    .eq('id', user.id)
    .maybeSingle()

  if (updatedRowError) {
    throw createError({
      statusCode: 500,
      statusMessage: updatedRowError.message
    })
  }

  return {
    ok: true,
    updatedAt: updatedRow?.updated_at ?? null
  }
})