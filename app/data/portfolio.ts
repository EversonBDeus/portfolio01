import { profile } from '~/data/profile'
import { projects } from '~/data/projects'
import { skills } from '~/data/skills'
import { certificates } from '~/data/certificates'
import { experiences } from '~/data/experience'
import { education } from '~/data/education'

/**
 * Fonte única de verdade (fase 1 - dados locais).
 * No futuro, usePortfolioData() pode trocar para Supabase sem mudar os templates.
 */
export const portfolio = {
  profile,
  projects,
  skills,
  certificates,
  experiences,
  education
} as const