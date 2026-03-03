export type Education = {
  id: string
  title: string
  institution: string
  startDate: string // YYYY-MM
  endDate?: string // YYYY-MM (vazio = em andamento)
  description?: string
}

export const education: Education[] = []