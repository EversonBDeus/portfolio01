import type { PortfolioPublicationStatus } from '~/types/portfolio'

export type UserProfile = {
  publicName: string
  headline: string
  bio: string
  location: string
  publicEmail: string
  linkedin: string
  github: string
  website: string
  whatsapp: string
  roleTitle: string
  professionalSummary: string
  workArea: string
  experienceLevel: string
  mainSkills: string[]
}

export type AccountPlan = 'free' | 'plus' | 'pro'
export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed'

export type AccountData = {
  email: string
  username: string
  accountId: string
  plan: AccountPlan
  onboardingStatus: OnboardingStatus
  createdAt: string
  updatedAt: string
  lastSignInAt: string
  publicSlug: string
  publicationStatus: PortfolioPublicationStatus
  templateId: string | null
}

export const initialUser: UserProfile = {
  publicName: '',
  headline: '',
  bio: '',
  location: '',
  publicEmail: '',
  linkedin: '',
  github: '',
  website: '',
  whatsapp: '',
  roleTitle: '',
  professionalSummary: '',
  workArea: '',
  experienceLevel: '',
  mainSkills: []
}

export const initialAccount: AccountData = {
  email: '',
  username: '',
  accountId: '',
  plan: 'free',
  onboardingStatus: 'not_started',
  createdAt: '',
  updatedAt: '',
  lastSignInAt: '',
  publicSlug: '',
  publicationStatus: 'draft',
  templateId: null
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