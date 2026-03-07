import { computed } from 'vue'
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

export type EditorHeroForm = {
  publicName: string
  headline: string
  roleTitle: string
  location: string
  skillsText: string
}

export type EditorAboutForm = {
  summary: string
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

function normalizeSkills(skillsText: string) {
  return skillsText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6)
}

export function useEditorState() {
  //  =========== Dados do Onboarding ================
  //  ----------- Base do Preview --------------

  const { publicProfile, professional, projects } = useOnboardingState()

  const {
    hasSelectedTemplate,
    selectedTemplate
  } = useTemplateSelection()

  const previewProjects = computed<EditorPreviewProject[]>(() => {
    return [...(projects.value.items ?? [])]
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

  const basePreviewData = computed<EditorPreviewData>(() => {
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
      skills: Array.isArray(professional.value.mainSkills)
        ? professional.value.mainSkills.slice(0, 6)
        : [],
      projects: previewProjects.value,
      links: previewLinks.value
    }
  })

  //  =========== Estado do Editor ================
  //  ----------- Viewport, Seção e Visibilidade --------------

  const device = useState<EditorDevice>('editor-device', () => 'desktop')
  const activeSection = useState<EditorSectionId>('editor-active-section', () => 'hero')
  const visibility = useState<EditorSectionVisibility>('editor-section-visibility', createInitialVisibility)

  const sections = computed<EditorSectionListItem[]>(() => {
    return EDITOR_SECTIONS.map((section) => ({
      ...section,
      enabled: visibility.value[section.id]
    }))
  })

  //  =========== Estado da Hero ================
  //  ----------- Edição Local --------------

  const heroForm = useState<EditorHeroForm>('editor-hero-form', () => ({
    publicName: basePreviewData.value.publicName,
    headline: basePreviewData.value.headline,
    roleTitle: basePreviewData.value.roleTitle,
    location: basePreviewData.value.location,
    skillsText: basePreviewData.value.skills.join(', ')
  }))

  //  =========== Estado do Sobre ================
  //  ----------- Edição Local --------------

  const aboutForm = useState<EditorAboutForm>('editor-about-form', () => ({
    summary: basePreviewData.value.summary
  }))

  //  =========== Preview Final ================
  //  ----------- Dados Renderizados --------------

  const previewData = computed<EditorPreviewData>(() => {
    return {
      publicName: heroForm.value.publicName.trim(),
      headline: heroForm.value.headline.trim(),
      roleTitle: heroForm.value.roleTitle.trim(),
      summary: aboutForm.value.summary.trim(),
      location: heroForm.value.location.trim(),
      skills: normalizeSkills(heroForm.value.skillsText),
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

  function setHeroForm(nextValue: EditorHeroForm) {
    heroForm.value = nextValue
  }

  function setAboutForm(nextValue: EditorAboutForm) {
    aboutForm.value = nextValue
  }

  function resetSection(sectionId: EditorSectionId) {
    if (sectionId === 'hero') {
      heroForm.value = {
        publicName: basePreviewData.value.publicName,
        headline: basePreviewData.value.headline,
        roleTitle: basePreviewData.value.roleTitle,
        location: basePreviewData.value.location,
        skillsText: basePreviewData.value.skills.join(', ')
      }

      return
    }

    if (sectionId === 'about') {
      aboutForm.value = {
        summary: basePreviewData.value.summary
      }
    }
  }

  return {
    aboutForm,
    activeSection,
    device,
    hasSelectedTemplate,
    heroForm,
    previewData,
    resetSection,
    sections,
    selectedTemplate,
    setAboutForm,
    setActiveSection,
    setDevice,
    setHeroForm,
    toggleSection,
    visibility
  }
}