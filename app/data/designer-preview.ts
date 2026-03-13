import type { PortfolioPublicViewModel } from '~/types/portfolio-public-view-model'

export const DESIGNER_PREVIEW_PORTFOLIO: PortfolioPublicViewModel = {
  settings: {
    templateId: 'aurora-ux',
    publicSlug: 'lumio-demo',
    publicationStatus: 'published'
  },

  hero: {
    publicName: 'Marina Costa',
    headline: 'Designer de produto e frontend engineer focada em interfaces claras, performance e percepção premium em produtos digitais.',
    roleTitle: 'Product Designer • Frontend Engineer',
    location: 'Brasil',
    skills: ['Nuxt 4', 'Vue 3', 'Nuxt UI', 'TypeScript', 'UX', 'Design Systems']
  },

  about: {
    summary:
      'Atuo na interseção entre design de interface, arquitetura de componentes e experiência do usuário. Meu foco é criar páginas e fluxos com leitura rápida, estrutura escalável e acabamento visual consistente.'
  },

  projects: [
    {
      id: 'lumio-dashboard',
      title: 'Lumio Dashboard',
      category: 'Produto SaaS',
      summary:
        'Dashboard com foco em navegação orientada a contexto, leitura rápida e componentes reutilizáveis para operação e analytics.',
      link: 'https://example.com/lumio-dashboard',
      featured: true
    },
    {
      id: 'portfolio-system',
      title: 'Portfolio Publishing System',
      category: 'Plataforma',
      summary:
        'Estrutura de publicação para portfólios com editor, templates e dados persistidos prontos para escalar.',
      link: 'https://example.com/portfolio-system',
      featured: true
    },
    {
      id: 'velocity-landing',
      title: 'Velocity Landing',
      category: 'Landing Page',
      summary:
        'Experimento visual com foco em narrativa premium, hierarquia de informação e percepção de qualidade.',
      link: 'https://example.com/velocity-landing',
      featured: false
    }
  ],

  contact: {
    publicEmail: 'marina@example.com',
    linkedin: 'https://linkedin.com/in/marina-costa-demo',
    github: 'https://github.com/marina-demo',
    website: 'https://example.com',
    whatsapp: 'https://wa.me/5500000000000'
  }
}