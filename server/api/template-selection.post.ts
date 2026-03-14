import { readBody } from 'h3'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'
import { serverSupabaseClient } from '~/utils/supabase/server'

type TemplateSelectionSaveBody = {
  templateId: string
}

type ServerSupabaseClient = ReturnType<typeof serverSupabaseClient>

const legacyFallbackSlugPattern = /^portfolio-[a-f0-9]{8}$/i

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function isLegacyFallbackSlug(value: unknown) {
  return legacyFallbackSlugPattern.test(normalizeText(value))
}

function createRandomSegment(length: number) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buffer = new Uint32Array(length)
    crypto.getRandomValues(buffer)

    return Array.from(buffer, (value) => alphabet[value % alphabet.length]).join('')
  }

  return Array.from({ length }, () => {
    return alphabet[Math.floor(Math.random() * alphabet.length)]
  }).join('')
}

function createFallbackSlug() {
  return `portfolio-${createRandomSegment(10)}`
}

async function createAvailableFallbackSlug(supabase: ServerSupabaseClient) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = createFallbackSlug()

    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('id')
      .eq('public_slug', candidate)
      .maybeSingle()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    if (!data) {
      return candidate
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Não foi possível gerar um slug interno seguro.'
  })
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

  const nextPublicSlug = (!currentSettings?.public_slug || isLegacyFallbackSlug(currentSettings.public_slug))
    ? await createAvailableFallbackSlug(supabase)
    : normalizeText(currentSettings.public_slug)

  const { error: saveError } = await supabase
    .from('portfolio_settings')
    .upsert({
      id: user.id,
      template_id: templateId,
      public_slug: nextPublicSlug,
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
