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

  const { data, error } = await supabase
    .from('portfolio_settings')
    .select('template_id, public_slug, publication_status')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  const publicSlug = normalizeText(data?.public_slug)
  const publicationStatus = data?.publication_status === 'published' ? 'published' : 'draft'

  return {
    templateId: data?.template_id ?? null,
    publicSlug,
    publicationStatus,
    publicUrl: publicSlug ? `/p/${publicSlug}` : ''
  }
})