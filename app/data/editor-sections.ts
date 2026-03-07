export type EditorSectionId = 'hero' | 'about' | 'projects' | 'contact'

export type EditorSectionDefinition = {
  id: EditorSectionId
  label: string
  description: string
  icon: string
}

export const EDITOR_SECTIONS: EditorSectionDefinition[] = [
  {
    id: 'hero',
    label: 'Hero',
    description: 'Nome, headline, cargo e destaque principal do template.',
    icon: 'i-lucide-panels-top-left'
  },
  {
    id: 'about',
    label: 'Sobre',
    description: 'Resumo profissional e contexto do perfil público.',
    icon: 'i-lucide-file-text'
  },
  {
    id: 'projects',
    label: 'Projetos',
    description: 'Primeira vitrine dos projetos cadastrados no onboarding.',
    icon: 'i-lucide-folder-kanban'
  },
  {
    id: 'contact',
    label: 'Contato',
    description: 'Links públicos e canais principais do portfólio.',
    icon: 'i-lucide-send'
  }
]