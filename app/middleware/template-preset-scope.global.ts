import { THEME_PRESETS } from '~/composables/useThemePresets'
import type { ThemePresetId } from '~/composables/useThemePresets'

const DEFAULT_THEME_PRESET_ID: ThemePresetId = 'cyber-lime'
const STORAGE_KEY = 'lumio:template-scope:previous-theme'
const SCOPED_ROUTE_PREFIXES = ['/designer-preview', '/p/']

const validThemePresetIds = new Set<ThemePresetId>(
  THEME_PRESETS.map((item) => item.id)
)

function isScopedTemplateRoute(path: string) {
  return SCOPED_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))
}

function isThemePresetId(value: string): value is ThemePresetId {
  return validThemePresetIds.has(value as ThemePresetId)
}

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) {
    return
  }

  const theme = useCookie<ThemePresetId>('theme', {
    default: () => DEFAULT_THEME_PRESET_ID
  })

  const toIsScoped = isScopedTemplateRoute(to.path)
  const fromIsScoped = isScopedTemplateRoute(from.path)
  const enteringScope = toIsScoped && !fromIsScoped
  const leavingScope = !toIsScoped && fromIsScoped

  if (enteringScope && !sessionStorage.getItem(STORAGE_KEY)) {
    sessionStorage.setItem(
      STORAGE_KEY,
      theme.value ?? DEFAULT_THEME_PRESET_ID
    )
  }

  const queryPreset = String(to.query.preset ?? '').trim()

  if (
    toIsScoped &&
    queryPreset &&
    isThemePresetId(queryPreset) &&
    theme.value !== queryPreset
  ) {
    theme.value = queryPreset
  }

  if (leavingScope) {
    const previousPresetId = sessionStorage.getItem(STORAGE_KEY)

    if (
      previousPresetId &&
      isThemePresetId(previousPresetId) &&
      theme.value !== previousPresetId
    ) {
      theme.value = previousPresetId
    }

    sessionStorage.removeItem(STORAGE_KEY)
  }
})