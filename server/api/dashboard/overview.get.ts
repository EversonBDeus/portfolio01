import type { Json } from '~/types/database.types'
import { getEditorSectionMode } from '~/utils/editor-content'
import { serverSupabaseClient } from '~/utils/supabase/server'

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseSkillCount(value: Json | null) {
  if (!Array.isArray(value)) {
    return 0
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 12).length
}

function countProjects(value: Json | null) {
  if (!Array.isArray(value)) {
    return 0
  }

  return value.filter((item) => isRecord(item)).slice(0, 3).length
}

function latestTimestamp(values: Array<unknown>) {
  const timestamps = values
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value))

  if (timestamps.length === 0) {
    return null
  }

  return new Date(Math.max(...timestamps)).toISOString()
}

function hasCustomEditorData(editor: {
  device: string
  active_section: string
  visibility: unknown
  hero: unknown
  about: unknown
  contact: unknown
}) {
  const visibility = isRecord(editor.visibility)
    ? editor.visibility
    : {}

  const hasVisibilityChange = ['hero', 'about', 'projects', 'contact'].some((key) => {
    return visibility[key] === false
  })

  return (
    editor.device !== 'desktop' ||
    editor.active_section !== 'hero' ||
    hasVisibilityChange ||
    getEditorSectionMode(editor.hero) === 'custom' ||
    getEditorSectionMode(editor.about) === 'custom' ||
    getEditorSectionMode(editor.contact) === 'custom'
  )
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
    { data: settings, error: settingsError },
    { data: editor, error: editorError }
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
      .select('template_id, public_slug, publication_status, updated_at')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('portfolio_editor')
      .select('device, active_section, visibility, hero, about, contact, projects, updated_at')
      .eq('id', user.id)
      .maybeSingle()
  ])

  if (accountError || profileError || professionalError || settingsError || editorError) {
    throw createError({
      statusCode: 500,
      statusMessage:
        accountError?.message ||
        profileError?.message ||
        professionalError?.message ||
        settingsError?.message ||
        editorError?.message ||
        'Não foi possível carregar o overview do dashboard.'
    })
  }

  const publicSlug = normalizeText(settings?.public_slug)
  const publicationStatus = settings?.publication_status === 'published' ? 'published' : 'draft'
  const hasPublicProfile = [
    profile?.public_name,
    profile?.headline,
    profile?.bio,
    profile?.location
  ].some((value) => Boolean(normalizeText(value)))

  const hasContactData = [
    profile?.public_email,
    profile?.linkedin,
    profile?.github,
    profile?.website,
    profile?.whatsapp
  ].some((value) => Boolean(normalizeText(value)))

  const skillCount = parseSkillCount((professional?.main_skills ?? null) as Json | null)

  const hasProfessionalData =
    [
      professional?.role_title,
      professional?.professional_summary,
      professional?.work_area,
      professional?.experience_level
    ].some((value) => Boolean(normalizeText(value))) || skillCount > 0

  const hasProfileBase = hasPublicProfile || hasProfessionalData || hasContactData
  const hasTemplate = Boolean(settings?.template_id)
  const hasPublishedPortfolio = publicationStatus === 'published' && Boolean(publicSlug)
  const hasEditor = Boolean(editor)
  const projectCount = countProjects((editor?.projects ?? null) as Json | null)

  const completionTotal = 5
  const completionCount = [
    account?.onboarding_status === 'completed',
    hasProfileBase,
    hasTemplate,
    hasEditor,
    hasPublishedPortfolio
  ].filter(Boolean).length

  const lastActivityAt = latestTimestamp([
    account?.updated_at,
    profile?.updated_at,
    professional?.updated_at,
    settings?.updated_at,
    editor?.updated_at,
    user.last_sign_in_at,
    user.created_at
  ])

  return {
    account: {
      email: user.email ?? '',
      username:
        normalizeText(account?.username) ||
        (typeof user.user_metadata?.username === 'string'
          ? user.user_metadata.username.trim()
          : ''),
      accountId: user.id,
      plan: account?.plan === 'plus' || account?.plan === 'pro' ? account.plan : 'free',
      onboardingStatus:
        account?.onboarding_status === 'completed' || account?.onboarding_status === 'in_progress'
          ? account.onboarding_status
          : 'not_started',
      createdAt: account?.created_at ?? user.created_at ?? '',
      updatedAt: account?.updated_at ?? '',
      lastSignInAt: typeof user.last_sign_in_at === 'string' ? user.last_sign_in_at : '',
      publicSlug,
      publicationStatus,
      templateId: settings?.template_id ?? null
    },

    profile: {
      publicName: normalizeText(profile?.public_name),
      headline: normalizeText(profile?.headline),
      hasPublicProfile,
      hasProfessionalData,
      hasContactData,
      skillsCount: skillCount,
      updatedAt: professional?.updated_at ?? profile?.updated_at ?? null
    },

    editor: {
      hasEditor,
      hasCustomEditor: editor ? hasCustomEditorData(editor) : false,
      projectCount,
      updatedAt: editor?.updated_at ?? null
    },

    publication: {
      templateId: settings?.template_id ?? null,
      publicSlug,
      publicationStatus,
      publicUrl: publicSlug ? `/p/${publicSlug}` : '',
      updatedAt: settings?.updated_at ?? null
    },

    summary: {
      hasProfileBase,
      hasTemplate,
      hasPublishedPortfolio,
      completionCount,
      completionTotal,
      lastActivityAt
    },

    updatedAt: lastActivityAt
  }
})