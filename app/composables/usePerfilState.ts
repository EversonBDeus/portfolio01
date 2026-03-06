export type UserProfile = {
  nome: string
  headline: string
  bio: string
  location: string
  publicEmail: string
  linkedin: string
  github: string
  instagram: string
  whatsapp: string
  messenger: string
  externalPortfolio: string
  allowResumeDownload: boolean
  allowContactButtons: boolean
}

export type AccountData = {
  email: string
  username: string
  accountId: string
  createdAt: string
  lastLogin: string
}

export const initialUser: UserProfile = {
  nome: '',
  headline: '',
  bio: '',
  location: '',
  publicEmail: '',
  linkedin: '',
  github: '',
  instagram: '',
  whatsapp: '',
  messenger: '',
  externalPortfolio: '',
  allowResumeDownload: true,
  allowContactButtons: true
}

export const initialAccount: AccountData = {
  email: '',
  username: '',
  accountId: '—',
  createdAt: '—',
  lastLogin: '—'
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
  renewAt: string
  cancelAt?: string
  coupon?: string
}