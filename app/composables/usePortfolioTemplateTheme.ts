import { computed } from 'vue'
import { DEFAULT_TEMPLATE_PRESET_ID, TEMPLATE_PRESETS } from '~/data/template-presets'
import { buildTemplateThemeVars } from '~/utils/template-theme-vars'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

export function usePortfolioTemplateTheme(presetId?: string | null) {
  const resolvedPresetId = computed<PortfolioTemplatePresetId>(() => {
    const candidate = String(presetId ?? '').trim() as PortfolioTemplatePresetId

    return TEMPLATE_PRESETS[candidate] ? candidate : DEFAULT_TEMPLATE_PRESET_ID
  })

  const preset = computed(() => TEMPLATE_PRESETS[resolvedPresetId.value])

  const themeVars = computed(() => {
    return buildTemplateThemeVars(preset.value)
  })

  return {
    preset,
    themeVars
  }
}