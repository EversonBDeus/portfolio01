export type UserProfile = {
  nome: string
  headline: string
  bio: string
  location: string
  linkedin?: string
  github?: string
  instagram?: string
}

export type AccountData = {
  email: string
  username: string
  plan: 'free' | 'plus' | 'pro'
}

export const initialUser: UserProfile = {
  nome: 'Seu Nome',
  headline: 'Seu título profissional',
  bio: 'Texto de bio (no futuro vem do onboarding e pode ter “Melhorar com IA”).',
  location: 'Brasil',
  linkedin: '',
  github: '',
  instagram: ''
}

export const initialAccount: AccountData = {
  email: 'voce@exemplo.com',
  username: 'seu-username',
  plan: 'free'
}

export type SecurityData = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactorEnabled: boolean
  twoFactorMethod: 'app' | 'sms' | 'email'
}

export type NotificationsData = {
  emailUpdates: boolean
  emailSecurity: boolean
  emailBilling: boolean
  emailProduct: boolean
  whatsappUpdates: boolean
  whatsappBilling: boolean
  whatsappSecurity: boolean
}

export type PlanTier = 'free' | 'plus' | 'pro'

export type PlanData = {
  tier: PlanTier
  status: 'ativa' | 'cancelada' | 'trial'
  renewAt: string // ISO ou string formatada por enquanto
  cancelAt?: string
  coupon?: string
}