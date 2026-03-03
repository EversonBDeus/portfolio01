import type { PortfolioSectionConfig } from '~/types/portfolio'

export const sections = [
  {
    id: 'projects',
    label: 'Projetos',
    icon: 'i-lucide-folder-kanban',
    enabled: true,
    hideWhenEmpty: true
  },
  {
    id: 'skills',
    label: 'Habilidades',
    icon: 'i-lucide-sparkles',
    enabled: true,
    hideWhenEmpty: true
  },
  {
    id: 'certificates',
    label: 'Certificados',
    icon: 'i-lucide-award',
    enabled: true,
    hideWhenEmpty: true
  },

  // ✅ Universais (servem para qualquer área)
  {
    id: 'experience',
    label: 'Experiência',
    icon: 'i-lucide-briefcase-business',
    enabled: true,
    hideWhenEmpty: true
  },
  {
    id: 'education',
    label: 'Formação',
    icon: 'i-lucide-graduation-cap',
    enabled: true,
    hideWhenEmpty: true
  }
] satisfies PortfolioSectionConfig[]