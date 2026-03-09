export type PortfolioSectionId =
  | 'projects'
  | 'skills'
  | 'certificates'
  | 'experience'
  | 'education'

export type PortfolioSectionConfig = {
  id: PortfolioSectionId
  label: string
  icon: string
  enabled: boolean
  hideWhenEmpty: boolean
}

export type PortfolioPlanId = 'free' | 'plus' | 'pro'

export type PortfolioPublicationStatus = 'draft' | 'published'

export type PortfolioEditorSectionId =
  | 'hero'
  | 'about'
  | 'projects'
  | 'contact'

export type PortfolioEditorVisibility = Record<PortfolioEditorSectionId, boolean>

export type PortfolioProjectPayload = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

export type PortfolioAccountPayload = {
  authUserId: string
  email: string
  username: string
  verified: boolean
  plan: PortfolioPlanId
}

export type PortfolioProfilePayload = {
  authUserId: string
  publicName: string
  headline: string
  bio: string
  location: string
  publicEmail: string
  linkedin: string
  github: string
  website: string
  whatsapp: string
}

export type PortfolioProfessionalPayload = {
  authUserId: string
  roleTitle: string
  professionalSummary: string
  workArea: string
  experienceLevel: string
  mainSkills: string[]
}

export type PortfolioSettingsPayload = {
  authUserId: string
  templateId: string | null
  publicSlug: string
  publicationStatus: PortfolioPublicationStatus
}

export type PortfolioEditorHeroPayload = {
  publicName: string
  headline: string
  roleTitle: string
  location: string
  skillsText: string
}

export type PortfolioEditorAboutPayload = {
  summary: string
}

export type PortfolioEditorContactPayload = {
  publicEmail: string
  whatsapp: string
  website: string
  linkedin: string
  github: string
}

export type PortfolioEditorPayload = {
  authUserId: string
  templateId: string | null
  device: 'desktop' | 'mobile'
  activeSection: PortfolioEditorSectionId
  activeProjectId: string | null
  visibility: PortfolioEditorVisibility
  hero: PortfolioEditorHeroPayload
  about: PortfolioEditorAboutPayload
  contact: PortfolioEditorContactPayload
  projects: PortfolioProjectPayload[]
}

export type PortfolioAggregatePayload = {
  account: PortfolioAccountPayload
  profile: PortfolioProfilePayload
  professional: PortfolioProfessionalPayload
  settings: PortfolioSettingsPayload
  editor: PortfolioEditorPayload
}

export type PortfolioTimestampedRecord = {
  createdAt: string
  updatedAt: string
}

export type PortfolioAccountRecord =
  PortfolioAccountPayload & PortfolioTimestampedRecord

export type PortfolioProfileRecord =
  PortfolioProfilePayload & PortfolioTimestampedRecord

export type PortfolioProfessionalRecord =
  PortfolioProfessionalPayload & PortfolioTimestampedRecord

export type PortfolioSettingsRecord =
  PortfolioSettingsPayload & PortfolioTimestampedRecord

export type PortfolioEditorRecord =
  PortfolioEditorPayload & PortfolioTimestampedRecord

export type PortfolioAggregateRecord = {
  account: PortfolioAccountRecord
  profile: PortfolioProfileRecord
  professional: PortfolioProfessionalRecord
  settings: PortfolioSettingsRecord
  editor: PortfolioEditorRecord
}