import { computed } from 'vue'
import { portfolio } from '~/data/portfolio'
import type { PortfolioSectionId } from '~/types/portfolio'

export function usePortfolioData() {
  // no futuro: aqui entra Pinia/Supabase e cache (sem mexer nos templates)
  const data = portfolio

  const counts = computed<Record<PortfolioSectionId, number>>(() => ({
    projects: data.projects.length,
    skills: data.skills.length,
    certificates: data.certificates.length,
    experience: data.experiences.length,
    education: data.education.length
  }))

  return {
    data,
    counts
  }
}