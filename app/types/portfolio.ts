export type PortfolioSectionId = 'projects' | 'skills' | 'certificates'

export type PortfolioSectionConfig = {
  id: PortfolioSectionId
  label: string
  icon: string

  /** Se false, a seção não aparece */
  enabled: boolean

  /**
   * Se true e a seção estiver vazia, ela some no modo público.
   * (No editor, a gente pode forçar mostrar)
   */
  hideWhenEmpty: boolean
}