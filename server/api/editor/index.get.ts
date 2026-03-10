import { getEditorSectionMode } from '~/utils/editor-content'
import { serverSupabaseClient } from '~/utils/supabase/server'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
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
        skillsText: '',
        __mode: 'base'
      },
      about: data.about ?? {
        summary: '',
        __mode: 'base'
      },
      contact: data.contact ?? {
        publicEmail: '',
        whatsapp: '',
        website: '',
        linkedin: '',
        github: '',
        __mode: 'base'
      },
      projects: Array.isArray(data.projects) ? data.projects : []
    }
  }
})