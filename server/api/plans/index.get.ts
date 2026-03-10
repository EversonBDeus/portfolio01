import { serverSupabaseClient } from '~/utils/supabase/server'

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
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
    { data: settings, error: settingsError }
  ] = await Promise.all([
    supabase
      .from('user_accounts')
      .select('username, plan, onboarding_status, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('portfolio_settings')
      .select('public_slug, publication_status, template_id')
      .eq('id', user.id)
      .maybeSingle()
  ])

  if (accountError || settingsError) {
    throw createError({
      statusCode: 500,
      statusMessage:
        accountError?.message ||
        settingsError?.message ||
        'Não foi possível carregar o plano atual.'
    })
  }

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
      publicSlug: settings?.public_slug ?? '',
      publicationStatus: settings?.publication_status === 'published' ? 'published' : 'draft',
      templateId: settings?.template_id ?? null
    },

    billing: {
      enabled: false
    },

    updatedAt: account?.updated_at ?? null
  }
})