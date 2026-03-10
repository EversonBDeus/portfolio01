import { serverSupabaseClient } from '~/utils/supabase/server'

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasMeaningfulValues(value: unknown) {
  if (!isRecord(value)) {
    return false
  }

  return Object.values(value).some((item) => normalizeText(item).length > 0)
}

function hasCustomEditorData(editor: {
  template_id: string | null
  device: string
  active_section: string
  active_project_id: string | null
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
    Boolean(editor.template_id) ||
    editor.device !== 'desktop' ||
    editor.active_section !== 'hero' ||
    Boolean(editor.active_project_id) ||
    hasVisibilityChange ||
    hasMeaningfulValues(editor.hero) ||
    hasMeaningfulValues(editor.about) ||
    hasMeaningfulValues(editor.contact)
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

  const { data, error } = await supabase
    .from('portfolio_editor')
    .select(
      'template_id, device, active_section, active_project_id, visibility, hero, about, contact, projects, updated_at'
    )
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  if (!data) {
    return {
      hasEditor: false,
      hasCustomEditor: false,
      updatedAt: null,
      editor: null
    }
  }

  return {
    hasEditor: true,
    hasCustomEditor: hasCustomEditorData(data),
    updatedAt: data.updated_at ?? null,
    editor: {
      templateId: data.template_id ?? null,
      device: data.device ?? 'desktop',
      activeSection: data.active_section ?? 'hero',
      activeProjectId: data.active_project_id ?? null,
      visibility: data.visibility ?? {
        hero: true,
        about: true,
        projects: true,
        contact: true
      },
      hero: data.hero ?? {
        publicName: '',
        headline: '',
        roleTitle: '',
        location: '',
        skillsText: ''
      },
      about: data.about ?? {
        summary: ''
      },
      contact: data.contact ?? {
        publicEmail: '',
        whatsapp: '',
        website: '',
        linkedin: '',
        github: ''
      },
      projects: Array.isArray(data.projects) ? data.projects : []
    }
  }
})