import { computed } from 'vue'
import { sections as sectionConfigs } from '~/data/sections'

import { projects } from '~/data/projects'
import { skills } from '~/data/skills'
import { certificates } from '~/data/certificates'
import { experiences } from '~/data/experience'
import { education } from '~/data/education'

import type { PortfolioSectionConfig, PortfolioSectionId } from '~/types/portfolio'

type UsePortfolioSectionsOptions = {
  showEmpty?: boolean
}

export function usePortfolioSections(options: UsePortfolioSectionsOptions = {}) {
  const showEmpty = !!options.showEmpty

  const countBySection = computed<Record<PortfolioSectionId, number>>(() => ({
    projects: projects.length,
    skills: skills.length,
    certificates: certificates.length,
    experience: experiences.length,
    education: education.length
  }))

  const visibleSections = computed<PortfolioSectionConfig[]>(() => {
    return sectionConfigs.filter((s) => {
      if (!s.enabled) return false
      if (showEmpty) return true
      if (!s.hideWhenEmpty) return true
      return countBySection.value[s.id] > 0
    })
  })

  const visibleSet = computed(() => new Set(visibleSections.value.map((s) => s.id)))

  return {
    visibleSections,
    visibleSet,
    countBySection
  }
}