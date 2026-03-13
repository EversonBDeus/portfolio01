export type PortfolioTemplatePresetId =
  | 'cyber-lime'
  | 'rose-wine'
  | 'ux-elite'
  | 'neon-spectrum'
  | 'minty-dark'
  | 'pastel-pop'

export type PortfolioTemplatePreset = {
  id: PortfolioTemplatePresetId
  name: string
  colors: {
    primary: string
    secondary: string
    tertiary: string
    surface: string
    surfaceElevated: string
    border: string
    text: string
    textMuted: string
    heroText: string
  }
  fonts: {
    heading: string
    body: string
  }
}