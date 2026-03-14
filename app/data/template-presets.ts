import type { PortfolioTemplatePreset, PortfolioTemplatePresetId } from '~/types/template-preset'

export const TEMPLATE_PRESETS: Record<PortfolioTemplatePresetId, PortfolioTemplatePreset> = {
  'cyber-lime': {
    id: 'cyber-lime',
    name: 'Cyber Lime',
    colors: {
      primary: '#84cc16',
      secondary: '#65a30d',
      tertiary: '#bef264',
      surface: 'rgba(10, 18, 6, 0.78)',
      surfaceElevated: 'rgba(15, 23, 8, 0.9)',
      border: 'rgba(190, 242, 100, 0.18)',
      text: '#f7fee7',
      textMuted: 'rgba(247, 254, 231, 0.72)',
      heroText: '#ffffff'
    },
    fonts: {
      heading: 'Sora',
      body: 'Inter'
    }
  },

  'rose-wine': {
    id: 'rose-wine',
    name: 'Rose Wine',
    colors: {
      primary: '#e879f9',
      secondary: '#f472b6',
      tertiary: '#fbcfe8',
      surface: 'rgba(28, 12, 25, 0.78)',
      surfaceElevated: 'rgba(40, 16, 35, 0.9)',
      border: 'rgba(244, 114, 182, 0.2)',
      text: '#fdf2f8',
      textMuted: 'rgba(253, 242, 248, 0.74)',
      heroText: '#ffffff'
    },
    fonts: {
      heading: 'Plus Jakarta Sans',
      body: 'Inter'
    }
  },

  'ux-elite': {
    id: 'ux-elite',
    name: 'UX Elite',
    colors: {
      primary: '#3b82f6',
      secondary: '#22d3ee',
      tertiary: '#bfdbfe',
      surface: 'rgba(7, 16, 30, 0.82)',
      surfaceElevated: 'rgba(10, 21, 39, 0.92)',
      border: 'rgba(96, 165, 250, 0.18)',
      text: '#eff6ff',
      textMuted: 'rgba(239, 246, 255, 0.72)',
      heroText: '#ffffff'
    },
    fonts: {
      heading: 'Sora',
      body: 'Inter'
    }
  },

  'neon-spectrum': {
    id: 'neon-spectrum',
    name: 'Neon Spectrum',
    colors: {
      primary: '#22d3ee',
      secondary: '#a855f7',
      tertiary: '#67e8f9',
      surface: 'rgba(7, 12, 24, 0.78)',
      surfaceElevated: 'rgba(10, 18, 34, 0.9)',
      border: 'rgba(34, 211, 238, 0.18)',
      text: '#ecfeff',
      textMuted: 'rgba(236, 254, 255, 0.72)',
      heroText: '#ffffff'
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter'
    }
  },

  'minty-dark': {
    id: 'minty-dark',
    name: 'Mint Noir',
    colors: {
      primary: '#34d399',
      secondary: '#10b981',
      tertiary: '#a7f3d0',
      surface: 'rgba(8, 18, 14, 0.8)',
      surfaceElevated: 'rgba(10, 24, 18, 0.92)',
      border: 'rgba(52, 211, 153, 0.16)',
      text: '#ecfdf5',
      textMuted: 'rgba(236, 253, 245, 0.7)',
      heroText: '#ffffff'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    }
  },

  'pastel-pop': {
    id: 'pastel-pop',
    name: 'Soft Bloom',
    colors: {
      primary: '#f9a8d4',
      secondary: '#c4b5fd',
      tertiary: '#fbcfe8',
      surface: 'rgba(255, 255, 255, 0.86)',
      surfaceElevated: 'rgba(255, 255, 255, 0.94)',
      border: 'rgba(192, 132, 252, 0.18)',
      text: '#1f2937',
      textMuted: 'rgba(31, 41, 55, 0.68)',
      heroText: '#ffffff'
    },
    fonts: {
      heading: 'Plus Jakarta Sans',
      body: 'Inter'
    }
  }
}

export const DEFAULT_TEMPLATE_PRESET_ID: PortfolioTemplatePresetId = 'cyber-lime'