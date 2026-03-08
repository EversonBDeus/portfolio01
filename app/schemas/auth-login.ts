import { z } from 'zod'

export const authLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail ou usuário.'),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
})

export type AuthLoginInput = z.infer<typeof authLoginSchema>