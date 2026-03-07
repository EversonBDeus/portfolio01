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
  id: string
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
    id: 'berlim',
    name: 'Berlim',
    category: 'Minimalista',
    tier: 'free',
    description:
      'Layout limpo, com foco em tipografia, resumo profissional e projetos organizados.',
    tags: ['Clean', 'Tipografia', 'Portfólio direto'],
    gradient: 'from-slate-200 via-slate-100 to-white',
    previewTitle: 'Portfólio direto ao ponto',
    previewSubtitle: 'Ideal para quem quer clareza e leitura rápida.',
    statsLabel: 'Seções enxutas'
  },
  {
    id: 'toquio',
    name: 'Tóquio',
    category: 'Criativo',
    tier: 'plus',
    description:
      'Visual mais vibrante, pensado para perfis criativos, designers e áreas visuais.',
    tags: ['Criativo', 'Visual forte', 'Apresentação'],
    gradient: 'from-fuchsia-500 via-violet-500 to-sky-500',
    previewTitle: 'Visual impactante',
    previewSubtitle: 'Destaque para branding, cores e blocos de projetos.',
    statsLabel: 'Hero mais expressivo'
  },
  {
    id: 'nova-york',
    name: 'Nova York',
    category: 'Profissional',
    tier: 'free',
    description:
      'Template equilibrado para perfis corporativos, consultoria, engenharia e produto.',
    tags: ['Corporativo', 'Confiança', 'B2B'],
    gradient: 'from-sky-700 via-blue-800 to-slate-900',
    previewTitle: 'Credibilidade profissional',
    previewSubtitle: 'Organiza experiência, prova social e projetos com sobriedade.',
    statsLabel: 'Leitura executiva'
  },
  {
    id: 'londres',
    name: 'Londres',
    category: 'Dark Mode',
    tier: 'pro',
    description:
      'Tema escuro premium com contraste alto e visual mais tecnológico.',
    tags: ['Dark', 'Tech', 'Premium'],
    gradient: 'from-zinc-800 via-zinc-900 to-black',
    previewTitle: 'Dark premium',
    previewSubtitle: 'Perfeito para tecnologia, produto e perfis mais modernos.',
    statsLabel: 'Visual avançado'
  },
  {
    id: 'lisboa',
    name: 'Lisboa',
    category: 'Editorial',
    tier: 'plus',
    description:
      'Estrutura mais editorial, boa para criadores, fotógrafos e perfis com storytelling.',
    tags: ['Editorial', 'Storytelling', 'Imagem'],
    gradient: 'from-amber-100 via-orange-200 to-rose-200',
    previewTitle: 'Narrativa visual',
    previewSubtitle: 'Valoriza texto, imagens e seções de conteúdo mais ricas.',
    statsLabel: 'Mais espaço para narrativa'
  },
  {
    id: 'seul',
    name: 'Seul',
    category: 'Criativo',
    tier: 'pro',
    description:
      'Template futurista, com blocos visuais mais fortes e presença moderna.',
    tags: ['Futurista', 'Digital', 'Destaque'],
    gradient: 'from-cyan-400 via-sky-500 to-indigo-700',
    previewTitle: 'Assinatura moderna',
    previewSubtitle: 'Pensado para perfis digitais e portfolios com personalidade.',
    statsLabel: 'Cards mais visuais'
  }
]