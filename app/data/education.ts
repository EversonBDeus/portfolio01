export type Education = {
  id: string
  title: string
  institution: string
  startDate: string // YYYY-MM
  endDate?: string // YYYY-MM (vazio = em andamento)
  description?: string
}

export const education: Education[] = [
  {
    id: 'edu-1',
    title: 'Análise e Desenvolvimento de Sistemas',
    institution: 'Estácio',
    startDate: '2022-01',
    endDate: '',
    description: 'Graduação focada em desenvolvimento web, banco de dados e fundamentos de arquitetura.'
  }
]