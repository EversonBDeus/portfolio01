import { readBody } from 'h3'
import type { Json } from '~/types/database.types'
import { serverSupabaseClient } from '~/utils/supabase/server'

type ProfileSaveBody = {
  profile?: {
    publicName?: string
    headline?: string
    bio?: string
    location?: string
    publicEmail?: string
    linkedin?: string
    github?: string
    website?: string
    whatsapp?: string
    roleTitle?: string
    professionalSummary?: string
    workArea?: string
    experienceLevel?: string
    mainSkills?: string[]
  }
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

function parseMainSkills(value: Json | null) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 12)
}

function normalizeMainSkills(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 12)
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

  const body = await readBody<ProfileSaveBody>(event)
  const profile = body?.profile

  const [profileResult, professionalResult] = await Promise.all([
    supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          public_name: normalizeText(profile?.publicName),
          headline: normalizeText(profile?.headline),
          bio: normalizeText(profile?.bio),
          location: normalizeText(profile?.location),
          public_email: normalizeText(profile?.publicEmail || user.email).toLowerCase(),
          linkedin: normalizeOptionalUrl(profile?.linkedin),
          github: normalizeOptionalUrl(profile?.github),
          website: normalizeOptionalUrl(profile?.website),
          whatsapp: normalizeText(profile?.whatsapp)
        },
        { onConflict: 'id' }
      ),

    supabase
      .from('professional_data')
      .upsert(
        {
          id: user.id,
          role_title: normalizeText(profile?.roleTitle),
          professional_summary: normalizeText(profile?.professionalSummary),
          work_area: normalizeText(profile?.workArea),
          experience_level: normalizeText(profile?.experienceLevel),
          main_skills: normalizeMainSkills(profile?.mainSkills)
        },
        { onConflict: 'id' }
      )
  ])

  const firstError = profileResult.error || professionalResult.error

  if (firstError) {
    throw createError({
      statusCode: 500,
      statusMessage: firstError.message
    })
  }

  const [
    { data: account, error: accountError },
    { data: freshProfile, error: freshProfileError },
    { data: freshProfessional, error: freshProfessionalError },
    { data: settings, error: settingsError }
  ] = await Promise.all([
    supabase
      .from('user_accounts')
      .select('username, plan, onboarding_status, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('profiles')
      .select('public_name, headline, bio, location, public_email, linkedin, github, website, whatsapp, updated_at')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('professional_data')
      .select('role_title, professional_summary, work_area, experience_level, main_skills, updated_at')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('portfolio_settings')
      .select('public_slug, publication_status, template_id')
      .eq('id', user.id)
      .maybeSingle()
  ])

  if (accountError || freshProfileError || freshProfessionalError || settingsError) {
    throw createError({
      statusCode: 500,
      statusMessage:
        accountError?.message ||
        freshProfileError?.message ||
        freshProfessionalError?.message ||
        settingsError?.message ||
        'Não foi possível confirmar o salvamento do perfil.'
    })
  }

  return {
    profile: {
      publicName: freshProfile?.public_name ?? '',
      headline: freshProfile?.headline ?? '',
      bio: freshProfile?.bio ?? '',
      location: freshProfile?.location ?? '',
      publicEmail: normalizeText(freshProfile?.public_email || user.email).toLowerCase(),
      linkedin: normalizeOptionalUrl(freshProfile?.linkedin),
      github: normalizeOptionalUrl(freshProfile?.github),
      website: normalizeOptionalUrl(freshProfile?.website),
      whatsapp: normalizeText(freshProfile?.whatsapp),
      roleTitle: freshProfessional?.role_title ?? '',
      professionalSummary: freshProfessional?.professional_summary ?? '',
      workArea: freshProfessional?.work_area ?? '',
      experienceLevel: freshProfessional?.experience_level ?? '',
      mainSkills: parseMainSkills(freshProfessional?.main_skills ?? null)
    },

    account: {
      email: user.email ?? '',
      username:
        normalizeText(account?.username) ||
        (typeof user.user_metadata?.username === 'string' ? user.user_metadata.username.trim() : ''),
      accountId: user.id,
      plan: account?.plan === 'plus' || account?.plan === 'pro' ? account.plan : 'free',
      onboardingStatus:
        account?.onboarding_status === 'completed' || account?.onboarding_status === 'in_progress'
          ? account.onboarding_status
          : 'not_started',
      createdAt: account?.created_at ?? user.created_at ?? '',
      updatedAt: account?.updated_at ?? '',
      lastSignInAt: typeof user.last_sign_in_at === 'string' ? user.last_sign_in_at : '',
      publicSlug: settings?.public_slug ?? '',
      publicationStatus: settings?.publication_status === 'published' ? 'published' : 'draft',
      templateId: settings?.template_id ?? null
    },

    updatedAt: freshProfessional?.updated_at ?? freshProfile?.updated_at ?? account?.updated_at ?? null
  }
})