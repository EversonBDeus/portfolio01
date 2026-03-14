import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
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
  component: Component
  name: string
  description: string
  category: string
  tags: string[]
  tier: PortfolioTemplateTier
  defaultPresetId: PortfolioTemplatePresetId
  defaultMode: PortfolioTemplateMode
  legacyIds?: string[]
}

const QuietFrameTemplate = defineAsyncComponent(
  () => import('~/components/templates/QuietFrameTemplate/QuietFrameTemplate.vue'),
)

const StillFormTemplate = defineAsyncComponent(
  () => import('~/components/templates/StillFormTemplate/StillFormTemplate.vue'),
)

const AuroraUxTemplate = defineAsyncComponent(
  () => import('~/components/templates/AuroraUx/AuroraUxTemplate.vue'),
)

const VelvetStageTemplate = defineAsyncComponent(
  () => import('~/components/templates/VelvetStageTemplate/VelvetStageTemplate.vue'),
)

const NeonPulseTemplate = defineAsyncComponent(
  () => import('~/components/templates/NeonPulseTemplate/NeonPulseTemplate.vue'),
)

const StudioRailTemplate = defineAsyncComponent(
  () => import('~/components/templates/StudioRailTemplate/StudioRailTemplate.vue'),
)

const ImperialArcTemplate = defineAsyncComponent(
  () => import('~/components/templates/ImperialArcTemplate/ImperialArcTemplate.vue'),
)

const ObsidianPrimeTemplate = defineAsyncComponent(
  () => import('~/components/templates/ObsidianPrimeTemplate/ObsidianPrimeTemplate.vue'),
)

const NoirSignalTemplate = defineAsyncComponent(
  () => import('~/components/templates/NoirSignalTemplate/NoirSignalTemplate.vue'),
)

export const PORTFOLIO_TEMPLATE_FALLBACK_ID: PortfolioTemplateId = 'velvet-stage'

export const PORTFOLIO_TEMPLATE_REGISTRY: PortfolioTemplateRegistryItem[] = [
  {
    id: 'quiet-frame',
    componentName: 'QuietFrameTemplate',
    component: QuietFrameTemplate,
    name: 'Quiet Frame',
    description: 'Minimalista, tipográfico e editorial com presença silenciosa.',
    category: 'Editorial',
    tags: ['minimalista', 'tipografia', 'clean', 'editorial'],
    tier: 'free',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'light',
    legacyIds: ['quietframe', 'quiet_frame'],
  },
  {
    id: 'still-form',
    componentName: 'StillFormTemplate',
    component: StillFormTemplate,
    name: 'Still Form',
    description: 'Calmo, leve e refinado para portfólios autorais com leitura limpa.',
    category: 'Editorial',
    tags: ['calmo', 'editorial', 'clean', 'premium'],
    tier: 'free',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'light',
    legacyIds: ['stillform', 'still_form'],
  },
  {
    id: 'aurora-ux',
    componentName: 'AuroraUxTemplate',
    component: AuroraUxTemplate,
    name: 'Aurora UX',
    description: 'Contraste nítido, layout moderno e leitura forte para perfis digitais.',
    category: 'Produto',
    tags: ['ux', 'produto', 'moderno', 'tech'],
    tier: 'plus',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'dark',
    legacyIds: ['auroraux', 'aurora_ux'],
  },
  {
    id: 'velvet-stage',
    componentName: 'VelvetStageTemplate',
    component: VelvetStageTemplate,
    name: 'Velvet Stage',
    description: 'Hero dominante e composição vendável para destaque premium.',
    category: 'Premium',
    tags: ['hero', 'premium', 'dominante', 'vendável'],
    tier: 'pro',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'dark',
    legacyIds: ['velvetstage', 'velvet_stage'],
  },
  {
    id: 'neon-pulse',
    componentName: 'NeonPulseTemplate',
    component: NeonPulseTemplate,
    name: 'Neon Pulse',
    description: 'Energia luminosa, visual expressivo e presença mobile-first forte.',
    category: 'Expressivo',
    tags: ['vibrante', 'neon', 'criativo', 'mobile'],
    tier: 'plus',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'dark',
    legacyIds: ['neonpulse', 'neon_pulse'],
  },
  {
    id: 'studio-rail',
    componentName: 'StudioRailTemplate',
    component: StudioRailTemplate,
    name: 'Studio Rail',
    description: 'Composição modular com rail lateral real e leitura de estúdio.',
    category: 'Estúdio',
    tags: ['rail', 'modular', 'estúdio', 'layout'],
    tier: 'plus',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'light',
    legacyIds: ['studiorail', 'studio_rail'],
  },
  {
    id: 'imperial-arc',
    componentName: 'ImperialArcTemplate',
    component: ImperialArcTemplate,
    name: 'Imperial Arc',
    description: 'Curadoria nobre com moldura premium e leitura mais editorial.',
    category: 'Curado',
    tags: ['editorial', 'nobre', 'curado', 'premium'],
    tier: 'pro',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'light',
    legacyIds: ['imperialarc', 'imperial_arc'],
  },
  {
    id: 'obsidian-prime',
    componentName: 'ObsidianPrimeTemplate',
    component: ObsidianPrimeTemplate,
    name: 'Obsidian Prime',
    description: 'Denso, monolítico e escuro para uma presença mais sólida.',
    category: 'Premium',
    tags: ['monolítico', 'escuro', 'sólido', 'premium'],
    tier: 'pro',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'dark',
    legacyIds: ['obsidianprime', 'obsidian_prime'],
  },
  {
    id: 'noir-signal',
    componentName: 'NoirSignalTemplate',
    component: NoirSignalTemplate,
    name: 'Noir Signal',
    description: 'Visual tático, contrastado e técnico sem virar dashboard genérico.',
    category: 'Tático',
    tags: ['tático', 'tech', 'contraste', 'dark'],
    tier: 'plus',
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    defaultMode: 'dark',
    legacyIds: ['noirsignal', 'noir_signal'],
  },
]

export const PORTFOLIO_TEMPLATE_IDS = PORTFOLIO_TEMPLATE_REGISTRY.map(
  template => template.id,
)

const PORTFOLIO_TEMPLATE_PRESET_IDS = Object.keys(
  TEMPLATE_PRESETS,
) as PortfolioTemplatePresetId[]

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