import { readBody } from 'h3'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'
import { serverSupabaseClient } from '~/utils/supabase/server'

type TemplateSelectionSaveBody = {
  templateId: string
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function createFallbackSlug(userId: string) {
  return `portfolio-${userId.slice(0, 8)}`
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

  const body = await readBody<TemplateSelectionSaveBody>(event)
  const templateId = normalizeText(body?.templateId)

  if (!templateId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Selecione um template válido.'
    })
  }

  const templateExists = PORTFOLIO_TEMPLATES.some((template) => template.id === templateId)

  if (!templateExists) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Template não encontrado.'
    })
  }

  const { data: currentSettings, error: currentSettingsError } = await supabase
    .from('portfolio_settings')
    .select('public_slug, publication_status')
    .eq('id', user.id)
    .maybeSingle()

  if (currentSettingsError) {
    throw createError({
      statusCode: 500,
      statusMessage: currentSettingsError.message
    })
  }

  const { error: saveError } = await supabase
    .from('portfolio_settings')
    .upsert({
      id: user.id,
      template_id: templateId,
      public_slug: currentSettings?.public_slug ?? createFallbackSlug(user.id),
      publication_status: currentSettings?.publication_status ?? 'draft'
    }, { onConflict: 'id' })

  if (saveError) {
    throw createError({
      statusCode: 500,
      statusMessage: saveError.message
    })
  }

  return {
    ok: true,
    templateId
  }
})