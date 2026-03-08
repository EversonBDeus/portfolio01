import { z } from 'zod'

const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/
const hasUppercaseRegex = /[A-Z]/
const hasLowercaseRegex = /[a-z]/
const hasNumberRegex = /\d/
const hasSpecialRegex = /[^A-Za-z0-9]/

export const authRegisterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Informe seu e-mail.')
      .email('Digite um e-mail válido.'),
    username: z
      .string()
      .trim()
      .min(1, 'Informe um nome de usuário.')
      .regex(usernameRegex, 'Use de 3 a 20 caracteres sem espaços.'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .regex(hasUppercaseRegex, 'A senha deve incluir pelo menos 1 letra maiúscula.')
      .regex(hasLowercaseRegex, 'A senha deve incluir pelo menos 1 letra minúscula.')
      .regex(hasNumberRegex, 'A senha deve incluir pelo menos 1 número.')
      .regex(hasSpecialRegex, 'A senha deve incluir pelo menos 1 caractere especial.'),
    confirmPassword: z
      .string()
      .min(1, 'Confirme sua senha.'),
    acceptTerms: z
      .boolean()
      .refine((value) => value, 'Você precisa aceitar os termos da plataforma.'),
    acceptUpdates: z.boolean()
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'A confirmação precisa ser igual à senha.'
      })
    }
  })

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>