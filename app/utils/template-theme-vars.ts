import type { PortfolioTemplatePreset } from '~/types/template-preset'

export function buildTemplateThemeVars(preset: PortfolioTemplatePreset) {
  return {
    '--template-color-primary': preset.colors.primary,
    '--template-color-secondary': preset.colors.secondary,
    '--template-color-tertiary': preset.colors.tertiary,
    '--template-surface': preset.colors.surface,
    '--template-surface-elevated': preset.colors.surfaceElevated,
    '--template-border': preset.colors.border,
    '--template-text': preset.colors.text,
    '--template-text-muted': preset.colors.textMuted,
    '--template-hero-text': preset.colors.heroText,
    '--template-font-heading': `'${preset.fonts.heading}', system-ui, sans-serif`,
    '--template-font-body': `'${preset.fonts.body}', system-ui, sans-serif`
  } satisfies Record<string, string>
}