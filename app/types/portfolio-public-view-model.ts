import type { PortfolioTemplatePresetId } from '~/types/template-preset'

export type PortfolioPublicationStatus = 'draft' | 'published'
export type PortfolioTemplateMode = 'light' | 'dark'

export type PortfolioPublicSettings = {
  templateId: string | null
  templatePresetId?: PortfolioTemplatePresetId | null
  publicSlug: string
  publicationStatus: PortfolioPublicationStatus
}

export type PortfolioHeroBlock = {
  publicName: string
  headline: string
  roleTitle: string
  location: string
  skills: string[]
}

export type PortfolioAboutBlock = {
  summary: string
}

export type PortfolioProjectItem = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

export type PortfolioContactBlock = {
  publicEmail: string
  linkedin: string
  github: string
  website: string
  whatsapp: string
}

export type PortfolioPublicViewModel = {
  settings: PortfolioPublicSettings
  hero: PortfolioHeroBlock
  about: PortfolioAboutBlock
  projects: PortfolioProjectItem[]
  contact: PortfolioContactBlock
}