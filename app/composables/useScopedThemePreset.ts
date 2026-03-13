import { onBeforeUnmount, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { THEME_PRESETS } from '~/composables/useThemePresets'
import type { ThemePresetId } from '~/composables/useThemePresets'

const DEFAULT_THEME_PRESET_ID: ThemePresetId = 'cyber-lime'

const validThemePresetIds = new Set<ThemePresetId>(
  THEME_PRESETS.map((item) => item.id)
)

function isThemePresetId(value: string): value is ThemePresetId {
  return validThemePresetIds.has(value as ThemePresetId)
}

export function useScopedThemePreset(
  presetId: MaybeRefOrGetter<ThemePresetId | string | null | undefined>
) {
  const theme = useCookie<ThemePresetId>('theme', {
    default: () => DEFAULT_THEME_PRESET_ID
  })

  const previousPresetId = theme.value ?? DEFAULT_THEME_PRESET_ID

  watch(
    () => toValue(presetId),
    (value) => {
      const candidate = String(value ?? '').trim()

      if (candidate && isThemePresetId(candidate) && theme.value !== candidate) {
        theme.value = candidate
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (theme.value !== previousPresetId) {
      theme.value = previousPresetId
    }
  })
}