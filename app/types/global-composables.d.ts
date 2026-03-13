import type { usePortfolioTemplateTheme as _usePortfolioTemplateTheme } from '~/composables/usePortfolioTemplateTheme'
import type { useScopedThemePreset as _useScopedThemePreset } from '~/composables/useScopedThemePreset'

declare global {
  const usePortfolioTemplateTheme: typeof _usePortfolioTemplateTheme
  const useScopedThemePreset: typeof _useScopedThemePreset
}

export {}