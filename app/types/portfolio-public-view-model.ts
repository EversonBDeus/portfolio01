import type { PortfolioPublicationStatus } from '~/types/portfolio'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

export type PortfolioTemplateMode = 'light' | 'dark'

export type PortfolioPublicPublicationStatus = PortfolioPublicationStatus

export type PortfolioPublicProjectViewModel = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

export type PortfolioPublicContactViewModel = {
  publicEmail: string
  linkedin: string
  github: string
  website: string
  whatsapp: string
}

export type PortfolioPublicViewModel = {
  settings: {
    templateId: string | null
    templatePresetId?: PortfolioTemplatePresetId | null
    publicSlug: string
    publicationStatus: PortfolioPublicPublicationStatus
  }
  hero: {
    publicName: string
    headline: string
    roleTitle: string
    location: string
    skills: string[]
  }
  about: {
    summary: string
  }
  projects: PortfolioPublicProjectViewModel[]
  contact: PortfolioPublicContactViewModel
}