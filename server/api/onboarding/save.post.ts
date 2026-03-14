import { readBody } from 'h3'
import { z } from 'zod'
import { serverSupabaseClient } from '~/utils/supabase/server'

const onboardingSaveSchema = z.object({
  onboardingStatus: z.enum(['not_started', 'in_progress', 'completed']).default('in_progress'),
  publicProfile: z.object({
    publicName: z.string().optional().default(''),
    headline: z.string().optional().default(''),
    location: z.string().optional().default(''),
    publicEmail: z.string().optional().default(''),
    bio: z.string().optional().default(''),
    linkedin: z.string().optional().default(''),
    github: z.string().optional().default(''),
    website: z.string().optional().default(''),
    whatsapp: z.string().optional().default('')
  }),
  professional: z.object({
    roleTitle: z.string().optional().default(''),
    professionalSummary: z.string().optional().default(''),
    workArea: z.string().optional().default(''),
    experienceLevel: z.string().optional().default(''),
    mainSkills: z.array(z.string()).optional().default([])
  }),
  projects: z.array(z.object({
    id: z.string().optional().default(''),
    title: z.string().optional().default(''),
    category: z.string().optional().default(''),
    summary: z.string().optional().default(''),
    link: z.string().optional().default(''),
    featured: z.boolean().optional().default(false)
  })).default([])
})

type OnboardingSaveBody = z.infer<typeof onboardingSaveSchema>

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
  const parsedBody = onboardingSaveSchema.safeParse(body)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload de onboarding inválido.'
    })
  }

  const {
    onboardingStatus,
    publicProfile,
    professional,
    projects
  } = parsedBody.data

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
        public_name: normalizeText(publicProfile.publicName),
        headline: normalizeText(publicProfile.headline),
        location: normalizeText(publicProfile.location),
        public_email: normalizeText(publicProfile.publicEmail || user.email).toLowerCase(),
        bio: normalizeText(publicProfile.bio),
        linkedin: normalizeOptionalUrl(publicProfile.linkedin),
        github: normalizeOptionalUrl(publicProfile.github),
        website: normalizeOptionalUrl(publicProfile.website),
        whatsapp: normalizeText(publicProfile.whatsapp)
      }, { onConflict: 'id' }),

    supabase
      .from('professional_data')
      .upsert({
        id: user.id,
        role_title: normalizeText(professional.roleTitle),
        professional_summary: normalizeText(professional.professionalSummary),
        work_area: normalizeText(professional.workArea),
        experience_level: normalizeText(professional.experienceLevel),
        main_skills: professional.mainSkills
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
