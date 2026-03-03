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

export const experiences: Experience[] = []