export type Experience = {
  id: string
  role: string
  company: string
  location?: string
  startDate: string // YYYY-MM
  endDate?: string // YYYY-MM (vazio = atual)
  description?: string
  highlights?: string[]
}

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Suporte Técnico (Fibra Óptica)',
    company: 'Provedor de Internet',
    location: 'Campo Grande - MS',
    startDate: '2023-01',
    endDate: '',
    description: 'Atendimento técnico e resolução de problemas de conexão, com foco em diagnóstico e orientação ao cliente.',
    highlights: [
      'Diagnóstico de rede e validação de sinal',
      'Atendimento ao cliente com foco em clareza e agilidade',
      'Registro e acompanhamento de chamados'
    ]
  }
]