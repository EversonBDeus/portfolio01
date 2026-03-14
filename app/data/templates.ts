import type { PlanTier } from '~/composables/usePerfilState'
import {
  PORTFOLIO_TEMPLATE_REGISTRY,
  type PortfolioTemplateId,
  type PortfolioTemplateMode,
  type PortfolioTemplateTier,
} from '~/data/portfolio-template-registry'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

export type TemplateTier = PortfolioTemplateTier

export type TemplateCategoryFilter = 'Todos' | string

export type TemplateCategoryOption = {
  label: TemplateCategoryFilter
  icon: string
}

export type TemplateCatalogItem = {
  id: PortfolioTemplateId
  slug: string
  templateId: PortfolioTemplateId
  previewTemplateId: PortfolioTemplateId
  name: string
  title: string
  description: string
  category: string
  tags: string[]
  tier: TemplateTier
  previewPresetId: PortfolioTemplatePresetId
  templatePresetId: PortfolioTemplatePresetId
  previewMode: PortfolioTemplateMode
  templateMode: PortfolioTemplateMode
  componentName: string
  available: boolean
  isNew: boolean
  gradient: string
  previewTitle: string
  previewSubtitle: string
  statsLabel: string
}

export type PortfolioTemplate = TemplateCatalogItem

const TEMPLATE_GRADIENTS: Record<PortfolioTemplateId, string> = {
  'quiet-frame': 'from-stone-200 via-neutral-100 to-zinc-200 dark:from-stone-700 dark:via-zinc-800 dark:to-neutral-900',
  'still-form': 'from-slate-100 via-stone-100 to-amber-50 dark:from-slate-700 dark:via-neutral-800 dark:to-stone-900',
  'aurora-ux': 'from-sky-500 via-cyan-400 to-indigo-600',
  'velvet-stage': 'from-fuchsia-500 via-rose-500 to-orange-400',
  'neon-pulse': 'from-cyan-400 via-violet-500 to-pink-500',
  'studio-rail': 'from-emerald-400 via-teal-500 to-cyan-500',
  'imperial-arc': 'from-amber-300 via-orange-300 to-rose-300 dark:from-amber-700 dark:via-orange-700 dark:to-rose-800',
  'obsidian-prime': 'from-slate-700 via-zinc-800 to-black',
  'noir-signal': 'from-lime-400 via-emerald-500 to-teal-600',
}

const TEMPLATE_CATEGORY_ICONS: Record<string, string> = {
  Todos: 'i-lucide-layout-template',
  Editorial: 'i-lucide-book-open-text',
  Produto: 'i-lucide-monitor-smartphone',
  Premium: 'i-lucide-crown',
  Expressivo: 'i-lucide-sparkles',
  Estúdio: 'i-lucide-panels-left-right',
  Curado: 'i-lucide-gallery-vertical-end',
  Tático: 'i-lucide-radar',
}

function getTemplateCategoryIcon(category: string): string {
  return TEMPLATE_CATEGORY_ICONS[category] ?? 'i-lucide-tag'
}

function buildStatsLabel(
  category: string,
  tags: string[],
  tier: TemplateTier,
): string {
  const tierLabel = tier === 'free' ? 'Free' : tier === 'plus' ? 'Plus' : 'Pro'

  return `${category} · ${tags.length} tags · ${tierLabel}`
}

export const TEMPLATE_CATALOG: TemplateCatalogItem[] = PORTFOLIO_TEMPLATE_REGISTRY.map(
  template => ({
    id: template.id,
    slug: template.id,
    templateId: template.id,
    previewTemplateId: template.id,
    name: template.name,
    title: template.name,
    description: template.description,
    category: template.category,
    tags: template.tags,
    tier: template.tier,
    previewPresetId: template.defaultPresetId,
    templatePresetId: template.defaultPresetId,
    previewMode: template.defaultMode,
    templateMode: template.defaultMode,
    componentName: template.componentName,
    available: true,
    isNew: false,
    gradient: TEMPLATE_GRADIENTS[template.id],
    previewTitle: template.name,
    previewSubtitle: template.description,
    statsLabel: buildStatsLabel(template.category, template.tags, template.tier),
  }),
)

export const PORTFOLIO_TEMPLATES = TEMPLATE_CATALOG

export const TEMPLATE_CATEGORIES: TemplateCategoryOption[] = [
  {
    label: 'Todos',
    icon: getTemplateCategoryIcon('Todos'),
  },
  ...Array.from(new Set(TEMPLATE_CATALOG.map(template => template.category))).map(category => ({
    label: category,
    icon: getTemplateCategoryIcon(category),
  })),
]

export const templates = TEMPLATE_CATALOG
export const portfolioTemplates = TEMPLATE_CATALOG

export function getTemplateById(
  templateId: string | null | undefined,
): TemplateCatalogItem | null {
  if (!templateId) {
    return null
  }

  return TEMPLATE_CATALOG.find(template => template.id === templateId) ?? null
}

export function isTemplateAvailableForPlan(
  template: TemplateCatalogItem,
  plan: PlanTier,
): boolean {
  const planWeight: Record<PlanTier, number> = {
    free: 0,
    plus: 1,
    pro: 2,
  }

  const templateWeight: Record<TemplateTier, number> = {
    free: 0,
    plus: 1,
    pro: 2,
  }

  return planWeight[plan] >= templateWeight[template.tier]
}

export default TEMPLATE_CATALOG