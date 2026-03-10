import { readBody } from 'h3'
import type { PortfolioPublicationStatus } from '~/types/portfolio'
import { serverSupabaseClient } from '~/utils/supabase/server'

type PublicationSaveBody = {
  publicSlug?: string
  publicationStatus?: PortfolioPublicationStatus
}

function sanitizePortfolioSlug(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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

  const body = await readBody<PublicationSaveBody>(event)
  const publicSlug = sanitizePortfolioSlug(body?.publicSlug)
  const publicationStatus = body?.publicationStatus === 'published' ? 'published' : 'draft'

  if (!publicSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Informe um slug público válido.'
    })
  }

  const { data: currentSettings, error: currentSettingsError } = await supabase
    .from('portfolio_settings')
    .select('template_id')
    .eq('id', user.id)
    .maybeSingle()

  if (currentSettingsError) {
    throw createError({
      statusCode: 500,
      statusMessage: currentSettingsError.message
    })
  }

  if (publicationStatus === 'published' && !currentSettings?.template_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Selecione e salve um template antes de publicar.'
    })
  }

  const { error: saveError } = await supabase
    .from('portfolio_settings')
    .upsert(
      {
        id: user.id,
        template_id: currentSettings?.template_id ?? null,
        public_slug: publicSlug,
        publication_status: publicationStatus
      },
      { onConflict: 'id' }
    )

  if (saveError) {
    if (saveError.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Este slug já está em uso por outro portfólio.'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: saveError.message
    })
  }

  return {
    ok: true,
    templateId: currentSettings?.template_id ?? null,
    publicSlug,
    publicationStatus,
    publicUrl: `/p/${publicSlug}`
  }
})