import type { Json } from '~/types/database.types'
import { serverSupabaseClient } from '~/utils/supabase/server'

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

  if (accountError || profileError || professionalError || settingsError) {
    throw createError({
      statusCode: 500,
      statusMessage:
        accountError?.message ||
        profileError?.message ||
        professionalError?.message ||
        settingsError?.message ||
        'Não foi possível carregar o perfil.'
    })
  }

  return {
    profile: {
      publicName: profile?.public_name ?? '',
      headline: profile?.headline ?? '',
      bio: profile?.bio ?? '',
      location: profile?.location ?? '',
      publicEmail: normalizeText(profile?.public_email || user.email).toLowerCase(),
      linkedin: normalizeOptionalUrl(profile?.linkedin),
      github: normalizeOptionalUrl(profile?.github),
      website: normalizeOptionalUrl(profile?.website),
      whatsapp: normalizeText(profile?.whatsapp),
      roleTitle: professional?.role_title ?? '',
      professionalSummary: professional?.professional_summary ?? '',
      workArea: professional?.work_area ?? '',
      experienceLevel: professional?.experience_level ?? '',
      mainSkills: parseMainSkills(professional?.main_skills ?? null)
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

    updatedAt: professional?.updated_at ?? profile?.updated_at ?? account?.updated_at ?? null
  }
})