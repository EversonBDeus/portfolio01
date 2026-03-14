import { serverSupabaseClient } from '~/utils/supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseClient(event)
  const config = useRuntimeConfig(event)

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError) {
    throw createError({
      statusCode: 401,
      statusMessage: authError.message
    })
  }

  if (!user) {
    return {
      user: null,
      account: null,
      isAdmin: false
    }
  }

  const { data: account, error: accountError } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (accountError) {
    throw createError({
      statusCode: 500,
      statusMessage: accountError.message
    })
  }

  const adminEmail = String(config.adminEmail ?? '').trim().toLowerCase()
  const currentEmail = String(user.email ?? '').trim().toLowerCase()
  const isAdmin = Boolean(adminEmail && currentEmail && adminEmail === currentEmail)

  return {
    user: {
      id: user.id,
      email: user.email ?? '',
      username:
        typeof user.user_metadata?.username === 'string'
          ? user.user_metadata.username
          : '',
      verified: Boolean(user.email_confirmed_at)
    },
    account,
    isAdmin
  }
})
