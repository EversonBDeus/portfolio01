import { serverSupabaseClient } from '~/utils/supabase/server'
import type { Json } from '~/types/database.types'

type ProjectSeed = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

function asText(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function parseProjects(value: Json | null): ProjectSeed[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return []
    }

    const project = item as Record<string, unknown>

    return [
      {
        id: asText(project.id) || `remote-project-${index + 1}`,
        title: asText(project.title),
        category: asText(project.category),
        summary: asText(project.summary),
        link: asText(project.link),
        featured: typeof project.featured === 'boolean' ? project.featured : index === 0
      }
    ]
  })
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

  const [
    { data: account, error: accountError },
    { data: profile, error: profileError },
    { data: professional, error: professionalError },
    { data: editor, error: editorError }
  ] = await Promise.all([
    supabase
      .from('user_accounts')
      .select('onboarding_status')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('profiles')
      .select('public_name, headline, location, public_email, bio, linkedin, github, website, whatsapp')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('professional_data')
      .select('role_title, professional_summary, work_area, experience_level, main_skills')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('portfolio_editor')
      .select('projects')
      .eq('id', user.id)
      .maybeSingle()
  ])

  if (accountError || profileError || professionalError || editorError) {
    throw createError({
      statusCode: 500,
      statusMessage:
        accountError?.message ||
        profileError?.message ||
        professionalError?.message ||
        editorError?.message ||
        'Não foi possível carregar o onboarding.'
    })
  }

  return {
    account: {
      onboardingStatus: account?.onboarding_status ?? 'not_started'
    },

    profile: {
      publicName: profile?.public_name ?? '',
      headline: profile?.headline ?? '',
      location: profile?.location ?? '',
      publicEmail: profile?.public_email ?? user.email ?? '',
      bio: profile?.bio ?? '',
      linkedin: profile?.linkedin ?? '',
      github: profile?.github ?? '',
      website: profile?.website ?? '',
      whatsapp: profile?.whatsapp ?? ''
    },

    professional: {
      roleTitle: professional?.role_title ?? '',
      professionalSummary: professional?.professional_summary ?? '',
      workArea: professional?.work_area ?? '',
      experienceLevel: professional?.experience_level ?? '',
      mainSkills: Array.isArray(professional?.main_skills)
        ? professional.main_skills.map((item) => String(item ?? '').trim()).filter(Boolean)
        : []
    },

    projects: parseProjects(editor?.projects ?? null)
  }
})