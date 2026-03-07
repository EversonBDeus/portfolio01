import { z } from 'zod'

export const editorProjectErrorFields = ['title', 'category', 'summary', 'link'] as const

export type EditorProjectErrorField = (typeof editorProjectErrorFields)[number]

export function isEditorProjectErrorField(value: unknown): value is EditorProjectErrorField {
  return (
    typeof value === 'string' &&
    (editorProjectErrorFields as readonly string[]).includes(value)
  )
}

export const editorProjectSchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(2, 'Informe um nome com pelo menos 2 caracteres.')
    .max(80, 'Use no máximo 80 caracteres no nome do projeto.'),
  category: z
    .string()
    .trim()
    .min(2, 'Informe uma categoria com pelo menos 2 caracteres.')
    .max(40, 'Use no máximo 40 caracteres na categoria.'),
  summary: z
    .string()
    .trim()
    .min(20, 'O resumo precisa ter pelo menos 20 caracteres.')
    .max(280, 'Use no máximo 280 caracteres no resumo.'),
  link: z.union([
    z.literal(''),
    z
      .string()
      .trim()
      .url('Informe uma URL válida começando com http:// ou https://')
  ]),
  featured: z.boolean()
})

export type EditorProjectForm = z.infer<typeof editorProjectSchema>

export type EditorProjectErrors = Partial<Record<EditorProjectErrorField, string>>