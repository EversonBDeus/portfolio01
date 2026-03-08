import { z } from 'zod'

export const authVerifySchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, 'Digite o código de 6 dígitos.')
})

export type AuthVerifyInput = z.infer<typeof authVerifySchema>