import {
  DEFAULT_TEMPLATE_PRESET_ID,
  TEMPLATE_PRESETS,
} from '~/data/template-presets'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

export type PortfolioTemplateId =
  | 'quiet-frame'
  | 'still-form'
  | 'aurora-ux'
  | 'velvet-stage'
  | 'neon-pulse'
  | 'studio-rail'
  | 'imperial-arc'
  | 'obsidian-prime'
  | 'noir-signal'

export type PortfolioTemplateMode = 'light' | 'dark'
export type PortfolioTemplateTier = 'free' | 'plus' | 'pro'

export type PortfolioTemplateRegistryItem = {
  id: PortfolioTemplateId
  componentName: string
  name: string
  description: string
  category: string
  tags: string[]
  tier: PortfolioTemplateTier
  defaultPresetId: PortfolioTemplatePresetId
  defaultMode: PortfolioTemplateMode
  legacyIds?: string[]
}

export const PORTFOLIO_TEMPLATE_FALLBACK_ID: PortfolioTemplateId = 'velvet-stage'

const PORTFOLIO_TEMPLATE_PRESET_IDS = Object.keys(
  TEMPLATE_PRESETS,
) as PortfolioTemplatePresetId[]

const TEMPLATE_DEFAULT_PRESET_BY_ID: Record<PortfolioTemplateId, PortfolioTemplatePresetId> = {
  'quiet-frame': 'minty-dark',
  'still-form': 'pastel-pop',
  'aurora-ux': 'ux-elite',
  'velvet-stage': 'rose-wine',
  'neon-pulse': 'neon-spectrum',
  'studio-rail': 'minty-dark',
  'imperial-arc': 'rose-wine',
  'obsidian-prime': 'ux-elite',
  'noir-signal': 'cyber-lime',
}

export const PORTFOLIO_TEMPLATE_REGISTRY: PortfolioTemplateRegistryItem[] = [
  {
    id: 'quiet-frame',
    componentName: 'QuietFrameTemplate',
    name: 'Quiet Frame',
    description: 'Minimalista, tipográfico e editorial com presença silenciosa.',
    category: 'Editorial',
    tags: ['minimalista', 'tipografia', 'clean', 'editorial'],
    tier: 'free',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['quiet-frame'],
    defaultMode: 'light',
    legacyIds: ['quietframe', 'quiet_frame'],
  },
  {
    id: 'still-form',
    componentName: 'StillFormTemplate',
    name: 'Still Form',
    description: 'Calmo, leve e refinado para portfólios autorais com leitura limpa.',
    category: 'Editorial',
    tags: ['calmo', 'editorial', 'clean', 'premium'],
    tier: 'free',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['still-form'],
    defaultMode: 'light',
    legacyIds: ['stillform', 'still_form'],
  },
  {
    id: 'aurora-ux',
    componentName: 'AuroraUxTemplate',
    name: 'Aurora UX',
    description: 'Contraste nítido, layout moderno e leitura forte para perfis digitais.',
    category: 'Produto',
    tags: ['ux', 'produto', 'moderno', 'tech'],
    tier: 'plus',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['aurora-ux'],
    defaultMode: 'dark',
    legacyIds: ['auroraux', 'aurora_ux'],
  },
  {
    id: 'velvet-stage',
    componentName: 'VelvetStageTemplate',
    name: 'Velvet Stage',
    description: 'Hero dominante e composição vendável para destaque premium.',
    category: 'Premium',
    tags: ['hero', 'premium', 'dominante', 'vendável'],
    tier: 'pro',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['velvet-stage'],
    defaultMode: 'dark',
    legacyIds: ['velvetstage', 'velvet_stage'],
  },
  {
    id: 'neon-pulse',
    componentName: 'NeonPulseTemplate',
    name: 'Neon Pulse',
    description: 'Energia luminosa, visual expressivo e presença mobile-first forte.',
    category: 'Expressivo',
    tags: ['vibrante', 'neon', 'criativo', 'mobile'],
    tier: 'plus',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['neon-pulse'],
    defaultMode: 'dark',
    legacyIds: ['neonpulse', 'neon_pulse'],
  },
  {
    id: 'studio-rail',
    componentName: 'StudioRailTemplate',
    name: 'Studio Rail',
    description: 'Composição modular com rail lateral real e leitura de estúdio.',
    category: 'Estúdio',
    tags: ['rail', 'modular', 'estúdio', 'layout'],
    tier: 'plus',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['studio-rail'],
    defaultMode: 'light',
    legacyIds: ['studiorail', 'studio_rail'],
  },
  {
    id: 'imperial-arc',
    componentName: 'ImperialArcTemplate',
    name: 'Imperial Arc',
    description: 'Curadoria nobre com moldura premium e leitura mais editorial.',
    category: 'Curado',
    tags: ['editorial', 'nobre', 'curado', 'premium'],
    tier: 'pro',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['imperial-arc'],
    defaultMode: 'light',
    legacyIds: ['imperialarc', 'imperial_arc'],
  },
  {
    id: 'obsidian-prime',
    componentName: 'ObsidianPrimeTemplate',
    name: 'Obsidian Prime',
    description: 'Denso, monolítico e escuro para uma presença mais sólida.',
    category: 'Premium',
    tags: ['monolítico', 'escuro', 'sólido', 'premium'],
    tier: 'pro',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['obsidian-prime'],
    defaultMode: 'dark',
    legacyIds: ['obsidianprime', 'obsidian_prime'],
  },
  {
    id: 'noir-signal',
    componentName: 'NoirSignalTemplate',
    name: 'Noir Signal',
    description: 'Visual tático, contrastado e técnico sem virar dashboard genérico.',
    category: 'Tático',
    tags: ['tático', 'tech', 'contraste', 'dark'],
    tier: 'plus',
    defaultPresetId: TEMPLATE_DEFAULT_PRESET_BY_ID['noir-signal'],
    defaultMode: 'dark',
    legacyIds: ['noirsignal', 'noir_signal'],
  },
]

export const PORTFOLIO_TEMPLATE_IDS = PORTFOLIO_TEMPLATE_REGISTRY.map(
  template => template.id,
)

function normalizeKey(value: string | null | undefined) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
}

export function isPortfolioTemplatePresetId(
  value: string,
): value is PortfolioTemplatePresetId {
  return PORTFOLIO_TEMPLATE_PRESET_IDS.includes(value as PortfolioTemplatePresetId)
}

export function resolvePortfolioTemplatePresetId(
  value: string | null | undefined,
  fallback: PortfolioTemplatePresetId = DEFAULT_TEMPLATE_PRESET_ID,
): PortfolioTemplatePresetId {
  const normalizedValue = typeof value === 'string' ? value.trim() : ''

  if (normalizedValue && isPortfolioTemplatePresetId(normalizedValue)) {
    return normalizedValue
  }

  return isPortfolioTemplatePresetId(fallback)
    ? fallback
    : DEFAULT_TEMPLATE_PRESET_ID
}

export function normalizePortfolioTemplateId(
  value: string | null | undefined,
): PortfolioTemplateId {
  const normalizedValue = normalizeKey(value)

  const directMatch = PORTFOLIO_TEMPLATE_REGISTRY.find(
    template => template.id === normalizedValue,
  )

  if (directMatch) {
    return directMatch.id
  }

  const legacyMatch = PORTFOLIO_TEMPLATE_REGISTRY.find(template =>
    template.legacyIds?.some(legacyId => normalizeKey(legacyId) === normalizedValue),
  )

  return legacyMatch?.id ?? PORTFOLIO_TEMPLATE_FALLBACK_ID
}

export function getPortfolioTemplateEntry(
  value: string | null | undefined,
): PortfolioTemplateRegistryItem {
  const templateId = normalizePortfolioTemplateId(value)

  return (
    PORTFOLIO_TEMPLATE_REGISTRY.find(template => template.id === templateId)
    ?? PORTFOLIO_TEMPLATE_REGISTRY[0]!
  )
}

export function getPortfolioTemplateRegistryItem(
  value: string | null | undefined,
): PortfolioTemplateRegistryItem {
  return getPortfolioTemplateEntry(value)
}