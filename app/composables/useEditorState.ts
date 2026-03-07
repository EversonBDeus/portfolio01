import { computed } from 'vue'
import type { PortfolioTemplate } from '~/data/templates'
import {
  EDITOR_SECTIONS,
  type EditorSectionDefinition,
  type EditorSectionId
} from '~/data/editor-sections'
import { useOnboardingState } from '~/composables/useOnboardingState'
import { useTemplateSelection } from '~/composables/useTemplateSelection'

export type EditorDevice = 'desktop' | 'mobile'

export type EditorSectionVisibility = Record<EditorSectionId, boolean>

export type EditorSectionListItem = EditorSectionDefinition & {
  enabled: boolean
}

export type EditorPreviewProject = {
  id: string
  title: string
  category: string
  summary: string
  link: string
  featured: boolean
}

export type EditorPreviewLink = {
  label: string
  value: string
  href: string
}

export type EditorPreviewData = {
  publicName: string
  headline: string
  roleTitle: string
  summary: string
  location: string
  skills: string[]
  projects: EditorPreviewProject[]
  links: EditorPreviewLink[]
}

function createInitialVisibility(): EditorSectionVisibility {
  return {
    hero: true,
    about: true,
    projects: true,
    contact: true
  }
}

export function useEditorState() {
  //  =========== Dados de Entrada ================
  //  ----------- Onboarding e Template Selecionado --------------

  const { publicProfile, professional, projects } = useOnboardingState()

  const {
    hasSelectedTemplate,
    selectedTemplate
  } = useTemplateSelection()

  //  =========== Estado do Editor ================
  //  ----------- Viewport e Seções --------------

  const device = useState<EditorDevice>('editor-device', () => 'desktop')
  const activeSection = useState<EditorSectionId>('editor-active-section', () => 'hero')
  const visibility = useState<EditorSectionVisibility>('editor-section-visibility', createInitialVisibility)

  const sections = computed<EditorSectionListItem[]>(() => {
    return EDITOR_SECTIONS.map((section) => ({
      ...section,
      enabled: visibility.value[section.id]
    }))
  })

  //  =========== Preview de Projetos ================
  //  ----------- Ordenação da Vitrine --------------

  const previewProjects = computed<EditorPreviewProject[]>(() => {
    return [...projects.value.items]
      .sort((current, next) => Number(next.featured) - Number(current.featured))
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        summary: item.summary,
        link: item.link,
        featured: item.featured
      }))
  })

  //  =========== Preview de Contato ================
  //  ----------- Links Públicos --------------

  const previewLinks = computed<EditorPreviewLink[]>(() => {
    const items: EditorPreviewLink[] = []

    if (publicProfile.value.linkedin.trim()) {
      items.push({
        label: 'LinkedIn',
        value: publicProfile.value.linkedin.trim(),
        href: publicProfile.value.linkedin.trim().startsWith('http')
          ? publicProfile.value.linkedin.trim()
          : `https://${publicProfile.value.linkedin.trim()}`
      })
    }

    if (publicProfile.value.github.trim()) {
      items.push({
        label: 'GitHub',
        value: publicProfile.value.github.trim(),
        href: publicProfile.value.github.trim().startsWith('http')
          ? publicProfile.value.github.trim()
          : `https://${publicProfile.value.github.trim()}`
      })
    }

    if (publicProfile.value.publicEmail.trim()) {
      items.push({
        label: 'E-mail',
        value: publicProfile.value.publicEmail.trim(),
        href: `mailto:${publicProfile.value.publicEmail.trim()}`
      })
    }

    return items
  })

  //  =========== Preview Geral ================
  //  ----------- Dados Renderizados --------------

  const previewData = computed<EditorPreviewData>(() => {
    return {
      publicName: publicProfile.value.publicName.trim() || 'Seu nome público',
      headline:
        publicProfile.value.headline.trim() ||
        professional.value.roleTitle.trim() ||
        'Sua headline profissional',
      roleTitle: professional.value.roleTitle.trim() || 'Seu cargo principal',
      summary:
        professional.value.professionalSummary.trim() ||
        publicProfile.value.bio.trim() ||
        'Adicione seu resumo profissional no onboarding ou no painel para alimentar esta seção do template.',
      location: publicProfile.value.location.trim() || 'Sua localização',
      skills: professional.value.mainSkills.slice(0, 6),
      projects: previewProjects.value,
      links: previewLinks.value
    }
  })

  //  =========== Ações do Editor ================
  //  ----------- Interações Locais --------------

  function setDevice(nextDevice: EditorDevice) {
    device.value = nextDevice
  }

  function setActiveSection(sectionId: EditorSectionId) {
    activeSection.value = sectionId
  }

  function toggleSection(sectionId: EditorSectionId) {
    visibility.value = {
      ...visibility.value,
      [sectionId]: !visibility.value[sectionId]
    }
  }

  return {
    activeSection,
    device,
    hasSelectedTemplate,
    previewData,
    sections,
    selectedTemplate,
    setActiveSection,
    setDevice,
    toggleSection,
    visibility
  }
}