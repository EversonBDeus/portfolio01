import { readBody } from 'h3'
import { serverSupabaseClient } from '~/utils/supabase/server'

type OnboardingSaveBody = {
  onboardingStatus: 'not_started' | 'in_progress' | 'completed'
  publicProfile: {
    publicName: string
    headline: string
    location: string
    publicEmail: string
    bio: string
    linkedin: string
    github: string
  }
  professional: {
    roleTitle: string
    professionalSummary: string
    workArea: string
    experienceLevel: string
    mainSkills: string[]
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

  const body = await readBody<OnboardingSaveBody>(event)

  const publicProfile = body?.publicProfile
  const professional = body?.professional
  const projects = Array.isArray(body?.projects) ? body.projects : []
  const onboardingStatus = body?.onboardingStatus ?? 'in_progress'

  const normalizedProjects = projects.map((item, index) => ({
    id: normalizeText(item.id) || `onboarding-project-${index + 1}`,
    title: normalizeText(item.title),
    category: normalizeText(item.category) || 'Projeto',
    summary: normalizeText(item.summary),
    link: normalizeOptionalUrl(item.link),
    featured: Boolean(item.featured)
  }))

  const [
    accountResult,
    profileResult,
    professionalResult,
    editorResult
  ] = await Promise.all([
    supabase
      .from('user_accounts')
      .upsert({
        id: user.id,
        onboarding_status: onboardingStatus
      }, { onConflict: 'id' }),

    supabase
      .from('profiles')
      .upsert({
        id: user.id,
        public_name: normalizeText(publicProfile?.publicName),
        headline: normalizeText(publicProfile?.headline),
        location: normalizeText(publicProfile?.location),
        public_email: normalizeText(publicProfile?.publicEmail || user.email).toLowerCase(),
        bio: normalizeText(publicProfile?.bio),
        linkedin: normalizeOptionalUrl(publicProfile?.linkedin),
        github: normalizeOptionalUrl(publicProfile?.github)
      }, { onConflict: 'id' }),

    supabase
      .from('professional_data')
      .upsert({
        id: user.id,
        role_title: normalizeText(professional?.roleTitle),
        professional_summary: normalizeText(professional?.professionalSummary),
        work_area: normalizeText(professional?.workArea),
        experience_level: normalizeText(professional?.experienceLevel),
        main_skills: (professional?.mainSkills ?? [])
          .map((item) => normalizeText(item))
          .filter(Boolean)
      }, { onConflict: 'id' }),

    supabase
      .from('portfolio_editor')
      .upsert({
        id: user.id,
        projects: normalizedProjects
      }, { onConflict: 'id' })
  ])

  const firstError =
    accountResult.error ||
    profileResult.error ||
    professionalResult.error ||
    editorResult.error

  if (firstError) {
    throw createError({
      statusCode: 500,
      statusMessage: firstError.message
    })
  }

  return {
    ok: true
  }
})