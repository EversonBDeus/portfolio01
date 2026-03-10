import type { PortfolioPublicationStatus } from '~/types/portfolio'

export type PublicPortfolioVisibility = {
  hero: boolean
  about: boolean
  projects: boolean
  contact: boolean
}

export type PublicPortfolioProject = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

export type PublicPortfolioLink = {
  label: string
  value: string
  href: string
}

export type PublicPortfolioPayload = {
  templateId: string
  publicSlug: string
  publicationStatus: PortfolioPublicationStatus
  visibility: PublicPortfolioVisibility
  publicName: string
  headline: string
  roleTitle: string
  summary: string
  location: string
  skills: string[]
  links: PublicPortfolioLink[]
  projects: PublicPortfolioProject[]
}