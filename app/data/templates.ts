import type { PortfolioTemplateId } from '~/data/portfolio-template-registry'

export type TemplateTier = 'free' | 'plus' | 'pro'

export type TemplateCategory =
  | 'Minimalista'
  | 'Criativo'
  | 'Profissional'
  | 'Dark Mode'
  | 'Editorial'

export type TemplateCategoryFilter = 'Todos' | TemplateCategory

export type TemplateCategoryOption = {
  label: TemplateCategoryFilter
  icon: string
}

export type PortfolioTemplate = {
  id: PortfolioTemplateId
  name: string
  category: TemplateCategory
  tier: TemplateTier
  description: string
  tags: string[]
  gradient: string
  previewTitle: string
  previewSubtitle: string
  statsLabel: string
}

export const TEMPLATE_CATEGORIES: TemplateCategoryOption[] = [
  { label: 'Todos', icon: 'i-lucide-layout-grid' },
  { label: 'Minimalista', icon: 'i-lucide-circle' },
  { label: 'Criativo', icon: 'i-lucide-sparkles' },
  { label: 'Profissional', icon: 'i-lucide-briefcase-business' },
  { label: 'Dark Mode', icon: 'i-lucide-moon-star' },
  { label: 'Editorial', icon: 'i-lucide-newspaper' }
]

export const PORTFOLIO_TEMPLATES: PortfolioTemplate[] = [
  {
    id: 'quiet-frame',
    name: 'Quiet Frame',
    category: 'Minimalista',
    tier: 'free',
    description:
      'Layout limpo, com foco em tipografia, resumo profissional e projetos organizados.',
    tags: ['Clean', 'Tipografia', 'Portfólio direto'],
    gradient: 'from-slate-200 via-zinc-100 to-white',
    previewTitle: 'Portfólio direto ao ponto',
    previewSubtitle: 'Ideal para quem quer clareza e leitura rápida.',
    statsLabel: 'Seções enxutas'
  },
  {
    id: 'still-form',
    name: 'Still Form',
    category: 'Editorial',
    tier: 'free',
    description:
      'Estrutura calma e editorial para perfis que valorizam texto, ritmo e leitura elegante.',
    tags: ['Editorial', 'Calmo', 'Narrativa'],
    gradient: 'from-stone-200 via-neutral-100 to-zinc-50',
    previewTitle: 'Leitura tranquila',
    previewSubtitle: 'Bom para conteúdo, presença autoral e ritmo visual suave.',
    statsLabel: 'Caderno visual'
  },
  {
    id: 'aurora-ux',
    name: 'Aurora UX',
    category: 'Profissional',
    tier: 'free',
    description:
      'Template equilibrado para produto, UX, frontend e perfis com clareza técnica.',
    tags: ['Produto', 'UX', 'Clareza'],
    gradient: 'from-cyan-300 via-sky-400 to-blue-500',
    previewTitle: 'Estrutura objetiva',
    previewSubtitle: 'Organiza headline, destaque e contato com leitura leve.',
    statsLabel: 'Foco em produto'
  },
  {
    id: 'velvet-stage',
    name: 'Velvet Stage',
    category: 'Criativo',
    tier: 'plus',
    description:
      'Composição dominante para quem quer uma vitrine premium, vendável e com hero forte.',
    tags: ['Hero dominante', 'Premium', 'Apresentação'],
    gradient: 'from-fuchsia-500 via-violet-500 to-indigo-600',
    previewTitle: 'Presença visual forte',
    previewSubtitle: 'Pensado para causar impacto logo no primeiro bloco.',
    statsLabel: 'Vitrine premium'
  },
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    category: 'Criativo',
    tier: 'plus',
    description:
      'Visual mais vibrante e luminoso, ideal para perfis criativos, branding e áreas visuais.',
    tags: ['Vibrante', 'Visual forte', 'Criativo'],
    gradient: 'from-fuchsia-500 via-violet-500 to-sky-500',
    previewTitle: 'Card principal vibrante',
    previewSubtitle: 'Bom para perfis que querem energia e presença visual.',
    statsLabel: 'Hero expressivo'
  },
  {
    id: 'studio-rail',
    name: 'Studio Rail',
    category: 'Dark Mode',
    tier: 'plus',
    description:
      'Layout com rail lateral e leitura modular, ideal para estúdios, produto e tecnologia.',
    tags: ['Rail lateral', 'Modular', 'Estúdio'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    previewTitle: 'Rail de estúdio',
    previewSubtitle: 'Distribui o conteúdo com apoio lateral e ritmo de painel.',
    statsLabel: 'Leitura modular'
  },
  {
    id: 'imperial-arc',
    name: 'Imperial Arc',
    category: 'Editorial',
    tier: 'pro',
    description:
      'Template com presença nobre, curadoria visual e composição mais cerimonial.',
    tags: ['Nobre', 'Editorial', 'Curadoria'],
    gradient: 'from-amber-300 via-rose-400 to-indigo-700',
    previewTitle: 'Editorial de alto valor',
    previewSubtitle: 'Pensado para autoridade visual, sofisticação e moldura premium.',
    statsLabel: 'Composição curada'
  },
  {
    id: 'obsidian-prime',
    name: 'Obsidian Prime',
    category: 'Dark Mode',
    tier: 'pro',
    description:
      'Visual sólido, denso e premium para perfis executivos, tecnologia e consultoria.',
    tags: ['Premium', 'Sólido', 'Executivo'],
    gradient: 'from-zinc-800 via-slate-900 to-black',
    previewTitle: 'Estrutura monolítica',
    previewSubtitle: 'Ideal para uma leitura forte, sóbria e profissional.',
    statsLabel: 'Leitura executiva'
  },
  {
    id: 'noir-signal',
    name: 'Noir Signal',
    category: 'Dark Mode',
    tier: 'pro',
    description:
      'Template tático e contrastado, com linguagem mais aguda para perfis digitais e tech.',
    tags: ['Tático', 'Contraste', 'Tech'],
    gradient: 'from-slate-900 via-black to-zinc-950',
    previewTitle: 'Sinal escuro de alto contraste',
    previewSubtitle: 'Focado em presença visual forte e leitura orientada por contraste.',
    statsLabel: 'Leitura tática'
  }
]