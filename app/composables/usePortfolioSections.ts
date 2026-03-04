import { computed } from 'vue'
import { sections as sectionConfigs } from '~/data/sections'
import { usePortfolioData } from '~/composables/usePortfolioData'

import type { PortfolioSectionConfig } from '~/types/portfolio'

type UsePortfolioSectionsOptions = {
  showEmpty?: boolean
}

export function usePortfolioSections(options: UsePortfolioSectionsOptions = {}) {
  const showEmpty = !!options.showEmpty

  const { counts } = usePortfolioData()

  const visibleSections = computed<PortfolioSectionConfig[]>(() => {
    return sectionConfigs.filter((s) => {
      if (!s.enabled) return false
      if (showEmpty) return true
      if (!s.hideWhenEmpty) return true
      return counts.value[s.id] > 0
    })
  })

  const visibleSet = computed(() => new Set(visibleSections.value.map((s) => s.id)))

  return {
    visibleSections,
    visibleSet,
    countBySection: counts
  }
}