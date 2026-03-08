import { z } from 'zod'

function isValidOptionalUrl(value: string) {
  if (!value) {
    return true
  }

  const normalized = value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://${value}`

  try {
    const url = new URL(normalized)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export const editorContactSchema = z.object({
  publicEmail: z
    .string()
    .trim()
    .max(120, 'Use no máximo 120 caracteres.')
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: 'Digite um e-mail público válido.'
    }),

  whatsapp: z
    .string()
    .trim()
    .max(24, 'Use no máximo 24 caracteres.'),

  website: z
    .string()
    .trim()
    .max(120, 'Use no máximo 120 caracteres.')
    .refine(isValidOptionalUrl, {
      message: 'Digite uma URL válida.'
    }),

  linkedin: z
    .string()
    .trim()
    .max(120, 'Use no máximo 120 caracteres.')
    .refine(isValidOptionalUrl, {
      message: 'Digite uma URL válida.'
    }),

  github: z
    .string()
    .trim()
    .max(120, 'Use no máximo 120 caracteres.')
    .refine(isValidOptionalUrl, {
      message: 'Digite uma URL válida.'
    })
})

export type EditorContactForm = z.infer<typeof editorContactSchema>
export type EditorContactErrors = Partial<Record<keyof EditorContactForm, string>>

export function isEditorContactErrorField(
  field: unknown
): field is keyof EditorContactForm {
  return (
    field === 'publicEmail' ||
    field === 'whatsapp' ||
    field === 'website' ||
    field === 'linkedin' ||
    field === 'github'
  )
}