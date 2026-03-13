import type { Component } from 'vue'
import { DEFAULT_TEMPLATE_PRESET_ID, TEMPLATE_PRESETS } from '~/data/template-presets'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

export const PORTFOLIO_TEMPLATE_IDS = [
  'velvet-stage',
  'quiet-frame',
  'still-form',
  'aurora-ux',
  'studio-rail',
  'neon-pulse',
  'imperial-arc',
  'obsidian-prime',
  'noir-signal'
] as const

export type PortfolioTemplateId = (typeof PORTFOLIO_TEMPLATE_IDS)[number]

export type PortfolioTemplateLoader = () => Promise<{ default: Component }>

export type PortfolioTemplateRegistryItem = {
  id: PortfolioTemplateId
  name: string
  loader: PortfolioTemplateLoader
  defaultPresetId: PortfolioTemplatePresetId
  availablePresetIds: PortfolioTemplatePresetId[]
}

const ALL_TEMPLATE_PRESET_IDS = Object.keys(TEMPLATE_PRESETS) as PortfolioTemplatePresetId[]

export const DEFAULT_PORTFOLIO_TEMPLATE_ID: PortfolioTemplateId = 'velvet-stage'

const LEGACY_TEMPLATE_ID_ALIASES: Record<string, PortfolioTemplateId> = {
  berlim: 'velvet-stage',
  toquio: 'velvet-stage',
  'nova-york': 'velvet-stage',
  londres: 'velvet-stage',
  lisboa: 'velvet-stage',
  seul: 'velvet-stage'
}

function buildRegistryItem(
  id: PortfolioTemplateId,
  name: string,
  loader: PortfolioTemplateLoader
): PortfolioTemplateRegistryItem {
  return {
    id,
    name,
    loader,
    defaultPresetId: DEFAULT_TEMPLATE_PRESET_ID,
    availablePresetIds: [...ALL_TEMPLATE_PRESET_IDS]
  }
}

export const PORTFOLIO_TEMPLATE_REGISTRY: Record<PortfolioTemplateId, PortfolioTemplateRegistryItem> = {
  'velvet-stage': buildRegistryItem(
    'velvet-stage',
    'Velvet Stage',
    () => import('~/components/templates/VelvetStageTemplate/VelvetStageTemplate.vue')
  ),

  'quiet-frame': buildRegistryItem(
    'quiet-frame',
    'Quiet Frame',
    () => import('~/components/templates/QuietFrameTemplate/QuietFrameTemplate.vue')
  ),

  'still-form': buildRegistryItem(
    'still-form',
    'Still Form',
    () => import('~/components/templates/StillFormTemplate/StillFormTemplate.vue')
  ),

  'aurora-ux': buildRegistryItem(
    'aurora-ux',
    'Aurora UX',
    () => import('~/components/templates/AuroraUx/AuroraUxTemplate.vue')
  ),

  'studio-rail': buildRegistryItem(
    'studio-rail',
    'Studio Rail',
    () => import('~/components/templates/StudioRailTemplate/StudioRailTemplate.vue')
  ),

  'neon-pulse': buildRegistryItem(
    'neon-pulse',
    'Neon Pulse',
    () => import('~/components/templates/NeonPulseTemplate/NeonPulseTemplate.vue')
  ),

  'imperial-arc': buildRegistryItem(
    'imperial-arc',
    'Imperial Arc',
    () => import('~/components/templates/ImperialArcTemplate/ImperialArcTemplate.vue')
  ),

  'obsidian-prime': buildRegistryItem(
    'obsidian-prime',
    'Obsidian Prime',
    () => import('~/components/templates/ObsidianPrimeTemplate/ObsidianPrimeTemplate.vue')
  ),

  'noir-signal': buildRegistryItem(
    'noir-signal',
    'Noir Signal',
    () => import('~/components/templates/NoirSignalTemplate/NoirSignalTemplate.vue')
  )
}

export function isPortfolioTemplateId(value: string | null | undefined): value is PortfolioTemplateId {
  if (!value) {
    return false
  }

  return value in PORTFOLIO_TEMPLATE_REGISTRY
}

export function isPortfolioTemplatePresetId(
  value: string | null | undefined
): value is PortfolioTemplatePresetId {
  if (!value) {
    return false
  }

  return value in TEMPLATE_PRESETS
}

export function resolvePortfolioTemplateId(
  templateId: string | null | undefined
): PortfolioTemplateId {
  const candidate = String(templateId ?? '').trim()

  if (isPortfolioTemplateId(candidate)) {
    return candidate
  }

  return LEGACY_TEMPLATE_ID_ALIASES[candidate] ?? DEFAULT_PORTFOLIO_TEMPLATE_ID
}

export function getPortfolioTemplateRegistryItem(
  templateId: string | null | undefined
): PortfolioTemplateRegistryItem {
  const resolvedTemplateId = resolvePortfolioTemplateId(templateId)

  return PORTFOLIO_TEMPLATE_REGISTRY[resolvedTemplateId]
}

export function resolvePortfolioTemplatePresetId(
  templatePresetId: string | null | undefined,
  fallbackPresetId?: PortfolioTemplatePresetId
): PortfolioTemplatePresetId {
  if (isPortfolioTemplatePresetId(templatePresetId)) {
    return templatePresetId
  }

  if (fallbackPresetId && isPortfolioTemplatePresetId(fallbackPresetId)) {
    return fallbackPresetId
  }

  return DEFAULT_TEMPLATE_PRESET_ID
}