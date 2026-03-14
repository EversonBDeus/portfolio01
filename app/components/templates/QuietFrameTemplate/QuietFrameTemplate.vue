<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioTemplateTheme } from '~/composables/usePortfolioTemplateTheme'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode,
} from '~/types/portfolio-public-view-model'

type PreviewDevice = 'desktop' | 'mobile'

type TemplateSectionVisibility = {
  hero?: boolean
  about?: boolean
  projects?: boolean
  contact?: boolean
}

type TemplateContactItem = {
  key: 'publicEmail' | 'linkedin' | 'github' | 'website' | 'whatsapp'
  label: string
  value: string
  href: string
  icon: string
  external: boolean
}

const props = withDefaults(defineProps<{
  portfolio: PortfolioPublicViewModel
  themeName?: string
  templatePresetId?: string | null
  templateMode?: PortfolioTemplateMode
  previewDevice?: PreviewDevice
  sectionVisibility?: TemplateSectionVisibility | null
}>(), {
  themeName: 'Quiet Frame',
  templatePresetId: null,
  templateMode: 'light',
  previewDevice: 'desktop',
  sectionVisibility: null,
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const heroName = computed(() => props.portfolio.hero.publicName.trim())
const heroHeadline = computed(() => props.portfolio.hero.headline.trim())
const aboutSummary = computed(() => props.portfolio.about.summary.trim())
const roleTitle = computed(() => props.portfolio.hero.roleTitle.trim())
const location = computed(() => props.portfolio.hero.location.trim())

const skills = computed(() => {
  return [...new Set(
    props.portfolio.hero.skills
      .map(skill => skill.trim())
      .filter(Boolean),
  )].slice(0, 8)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter(project => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const leadProject = computed(() => featuredProjects.value[0] ?? null)
const secondaryProjects = computed(() => featuredProjects.value.slice(1, 4))
const featuredCount = computed(() => {
  return props.portfolio.projects.filter(project => project.featured).length
})

function normalizeWebsite(value: string) {
  const trimmed = String(value ?? '').trim()

  if (!trimmed) {
    return ''
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function normalizeWhatsappHref(value: string) {
  const trimmed = String(value ?? '').trim()

  if (!trimmed) {
    return ''
  }

  if (/^https?:\/\//i.test(trimmed)) {
    const digits = trimmed.replace(/\D/g, '')
    return digits ? `https://wa.me/${digits}` : trimmed
  }

  const digits = trimmed.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : ''
}

function formatWhatsappValue(value: string) {
  const trimmed = String(value ?? '').trim()

  if (!trimmed) {
    return ''
  }

  const digits = trimmed.replace(/\D/g, '')

  if (!digits) {
    return trimmed
  }

  return `+${digits}`
}

const contactItems = computed(() => {
  const items: TemplateContactItem[] = [
    {
      key: 'publicEmail',
      label: 'Email',
      value: props.portfolio.contact.publicEmail.trim(),
      href: props.portfolio.contact.publicEmail.trim()
        ? `mailto:${props.portfolio.contact.publicEmail.trim()}`
        : '',
      icon: 'i-lucide-mail',
      external: false,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: props.portfolio.contact.linkedin.trim(),
      href: normalizeWebsite(props.portfolio.contact.linkedin),
      icon: 'i-lucide-linkedin',
      external: true,
    },
    {
      key: 'github',
      label: 'GitHub',
      value: props.portfolio.contact.github.trim(),
      href: normalizeWebsite(props.portfolio.contact.github),
      icon: 'i-lucide-github',
      external: true,
    },
    {
      key: 'website',
      label: 'Website',
      value: props.portfolio.contact.website.trim(),
      href: normalizeWebsite(props.portfolio.contact.website),
      icon: 'i-lucide-globe',
      external: true,
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      value: formatWhatsappValue(props.portfolio.contact.whatsapp),
      href: normalizeWhatsappHref(props.portfolio.contact.whatsapp),
      icon: 'i-lucide-message-circle',
      external: true,
    },
  ]

  return items.filter(item => Boolean(item.value && item.href))
})

const visibleSections = computed(() => {
  return {
    hero: props.sectionVisibility?.hero ?? true,
    about: props.sectionVisibility?.about ?? true,
    projects: props.sectionVisibility?.projects ?? true,
    contact: props.sectionVisibility?.contact ?? true,
  }
})

const hasHeroContent = computed(() => {
  return Boolean(
    heroName.value
    || heroHeadline.value
    || roleTitle.value
    || location.value
    || skills.value.length,
  )
})

const heroVisible = computed(() => {
  return visibleSections.value.hero && hasHeroContent.value
})

const aboutVisible = computed(() => {
  return visibleSections.value.about && Boolean(aboutSummary.value)
})

const projectsVisible = computed(() => {
  return visibleSections.value.projects && Boolean(leadProject.value)
})

const contactVisible = computed(() => {
  return visibleSections.value.contact && contactItems.value.length > 0
})

const stats = computed(() => {
  const items: Array<{ label: string; value: string }> = []

  if (projectsVisible.value && props.portfolio.projects.length > 0) {
    items.push({ label: 'Projetos', value: String(props.portfolio.projects.length) })
  }

  if (projectsVisible.value && featuredCount.value > 0) {
    items.push({ label: 'Destaques', value: String(featuredCount.value) })
  }

  if (heroVisible.value && skills.value.length > 0) {
    items.push({ label: 'Skills', value: String(skills.value.length) })
  }

  return items
})

const primaryContacts = computed(() => {
  return contactVisible.value ? contactItems.value.slice(0, 3) : []
})

const extraContacts = computed(() => {
  return contactVisible.value ? contactItems.value.slice(3) : []
})

const hasSideColumn = computed(() => {
  return stats.value.length > 0 || primaryContacts.value.length > 0
})

const frameVisible = computed(() => {
  return heroVisible.value || aboutVisible.value || hasSideColumn.value
})

const frameSingleColumn = computed(() => {
  return !(heroVisible.value || aboutVisible.value) || !hasSideColumn.value
})

const hasFooterPanels = computed(() => {
  return aboutVisible.value || extraContacts.value.length > 0
})

const footerSingleColumn = computed(() => {
  return Number(aboutVisible.value) + Number(extraContacts.value.length > 0) <= 1
})
</script>

<template>
  <article
    class="lumio-template lumio-template--quiet-frame"
    :class="[
      `lumio-template--mode-${props.templateMode}`,
      `lumio-template--device-${props.previewDevice}`,
    ]"
    :style="themeVars"
  >
    <section
      v-if="frameVisible"
      class="lumio-template__frame-shell"
      :class="{ 'lumio-template__frame-shell--single': frameSingleColumn }"
    >
      <div
        v-if="heroVisible || aboutVisible"
        class="lumio-template__frame-main"
      >
        <div
          v-if="heroVisible"
          class="lumio-template__hero-card"
          v-reveal="{ distance: '18px', duration: 520 }"
        >
          <div class="lumio-template__hero-topline">
            <span class="lumio-template__hero-mark" />
          </div>

          <h1 class="lumio-template__name">
            {{ heroName || 'Perfil público' }}
          </h1>

          <p
            v-if="heroHeadline"
            class="lumio-template__headline"
          >
            {{ heroHeadline }}
          </p>

          <div
            v-if="roleTitle || location"
            class="lumio-template__meta-row"
          >
            <UBadge
              v-if="roleTitle"
              class="lumio-template__badge lumio-template__badge--soft"
            >
              {{ roleTitle }}
            </UBadge>

            <UBadge
              v-if="location"
              class="lumio-template__badge lumio-template__badge--outline"
            >
              {{ location }}
            </UBadge>
          </div>

          <ul
            v-if="skills.length"
            class="lumio-template__skills"
            aria-label="Skills principais"
          >
            <li
              v-for="skill in skills"
              :key="skill"
              class="lumio-template__skill"
            >
              {{ skill }}
            </li>
          </ul>
        </div>

        <div
          v-if="aboutVisible"
          class="lumio-template__about-card"
          v-reveal="{ delay: 50, distance: '18px', duration: 520 }"
        >
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <p class="lumio-template__copy">
            {{ aboutSummary }}
          </p>
        </div>
      </div>

      <aside
        v-if="hasSideColumn"
        class="lumio-template__frame-side"
        v-reveal="{ delay: 90, distance: '18px', duration: 520 }"
      >
        <div
          v-if="stats.length"
          class="lumio-template__stat-grid"
        >
          <article
            v-for="stat in stats"
            :key="stat.label"
            class="lumio-template__stat-card"
          >
            <p class="lumio-template__stat-label">{{ stat.label }}</p>
            <strong class="lumio-template__stat-value">{{ stat.value }}</strong>
          </article>
        </div>

        <div
          v-if="primaryContacts.length"
          class="lumio-template__contact-stack"
        >
          <a
            v-for="item in primaryContacts"
            :key="item.key"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="lumio-template__contact-card"
          >
            <span class="lumio-template__contact-icon">
              <UIcon :name="item.icon" />
            </span>

            <span class="lumio-template__contact-copy">
              <span class="lumio-template__contact-label">{{ item.label }}</span>
              <span class="lumio-template__contact-value">{{ item.value }}</span>
            </span>
          </a>
        </div>
      </aside>
    </section>

    <div
      v-if="projectsVisible || hasFooterPanels"
      class="lumio-template__body"
    >
      <section
        v-if="projectsVisible"
        class="lumio-template__projects-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__projects-head">
          <div>
            <p class="lumio-template__section-kicker">
              Projeto principal
            </p>

            <h2 class="lumio-template__section-title">
              {{ leadProject?.title }}
            </h2>
          </div>

          <div
            v-if="leadProject"
            class="lumio-template__projects-badges"
          >
            <UBadge
              v-if="leadProject.category"
              class="lumio-template__badge lumio-template__badge--soft"
            >
              {{ leadProject.category }}
            </UBadge>

            <UBadge
              v-if="leadProject.featured"
              class="lumio-template__badge lumio-template__badge--highlight"
            >
              Destaque
            </UBadge>
          </div>
        </div>

        <div class="lumio-template__projects-grid">
          <article class="lumio-template__lead-card">
            <p
              v-if="leadProject?.summary"
              class="lumio-template__copy"
            >
              {{ leadProject.summary }}
            </p>

            <a
              v-if="leadProject?.link"
              :href="leadProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="lumio-template__action"
            >
              <UIcon name="i-lucide-arrow-up-right" />
              Abrir projeto
            </a>
          </article>

          <div
            v-if="secondaryProjects.length"
            class="lumio-template__secondary-list"
          >
            <article
              v-for="project in secondaryProjects"
              :key="project.id"
              class="lumio-template__secondary-card"
            >
              <UBadge
                v-if="project.category"
                class="lumio-template__badge lumio-template__badge--outline"
              >
                {{ project.category }}
              </UBadge>

              <h3 class="lumio-template__mini-title">
                {{ project.title }}
              </h3>

              <p
                v-if="project.summary"
                class="lumio-template__copy lumio-template__copy--compact"
              >
                {{ project.summary }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        v-if="hasFooterPanels"
        class="lumio-template__footer-grid"
        :class="{ 'lumio-template__footer-grid--single': footerSingleColumn }"
        v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
      >
        <article
          v-if="aboutVisible"
          class="lumio-template__panel"
        >
          <p class="lumio-template__section-kicker">
            Resumo
          </p>

          <p class="lumio-template__copy">
            {{ aboutSummary }}
          </p>
        </article>

        <article
          v-if="extraContacts.length"
          class="lumio-template__panel"
        >
          <p class="lumio-template__section-kicker">
            Contato
          </p>

          <div class="lumio-template__extra-contacts">
            <UBadge
              v-for="item in extraContacts"
              :key="`extra-${item.key}`"
              class="lumio-template__badge lumio-template__badge--outline"
            >
              {{ item.label }} · {{ item.value }}
            </UBadge>
          </div>
        </article>
      </section>
    </div>
  </article>
</template>

<style scoped>
.lumio-template {
  font-family: var(--template-font-body);
  color: var(--template-text);
  min-width: 0;
}

.lumio-template--quiet-frame {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    linear-gradient(135deg, color-mix(in srgb, var(--template-surface) 16%, rgba(255, 255, 255, 0.98)), rgba(255, 255, 255, 0.98));
  border-radius: 1.8rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 90%, transparent);
  box-shadow:
    0 28px 50px -42px rgba(15, 23, 42, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.42);
}

.lumio-template--mode-dark.lumio-template--quiet-frame {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 12%, transparent), transparent 48%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.94));
  box-shadow:
    0 34px 56px -42px rgba(2, 6, 23, 0.42),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.lumio-template__frame-shell,
.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__frame-main,
.lumio-template__frame-side {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lumio-template__hero-card,
.lumio-template__about-card,
.lumio-template__stat-card,
.lumio-template__projects-shell,
.lumio-template__lead-card,
.lumio-template__secondary-card,
.lumio-template__panel,
.lumio-template__contact-card {
  border-radius: 1.45rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 86%, rgba(255, 255, 255, 0.52));
  box-shadow:
    0 18px 38px -38px rgba(15, 23, 42, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}

.lumio-template--mode-dark :is(
  .lumio-template__hero-card,
  .lumio-template__about-card,
  .lumio-template__stat-card,
  .lumio-template__projects-shell,
  .lumio-template__lead-card,
  .lumio-template__secondary-card,
  .lumio-template__panel,
  .lumio-template__contact-card
) {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 80%, rgba(255, 255, 255, 0.03));
  box-shadow:
    0 22px 46px -42px rgba(2, 6, 23, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.lumio-template__hero-card,
.lumio-template__about-card,
.lumio-template__stat-card,
.lumio-template__projects-shell,
.lumio-template__lead-card,
.lumio-template__secondary-card,
.lumio-template__panel,
.lumio-template__contact-card {
  padding: 1rem;
}

.lumio-template__hero-card {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-topline {
  display: flex;
  align-items: center;
}

.lumio-template__hero-mark {
  width: 2.8rem;
  height: 1px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__name,
.lumio-template__section-title,
.lumio-template__mini-title {
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__name {
  font-size: clamp(2.7rem, 8vw, 4.9rem);
  line-height: 0.94;
  letter-spacing: -0.065em;
  color: var(--template-text);
}

.lumio-template--mode-dark .lumio-template__name,
.lumio-template--mode-dark .lumio-template__section-title,
.lumio-template--mode-dark .lumio-template__mini-title {
  color: var(--template-hero-text);
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__contact-value {
  margin: 0;
  color: color-mix(in srgb, var(--template-text) 86%, #475569);
  line-height: 1.78;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template--mode-dark .lumio-template__headline,
.lumio-template--mode-dark .lumio-template__copy,
.lumio-template--mode-dark .lumio-template__contact-value {
  color: var(--template-text);
}

.lumio-template__headline {
  max-width: 34ch;
  font-size: 1rem;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.68;
}

.lumio-template__meta-row,
.lumio-template__projects-badges,
.lumio-template__extra-contacts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__badge {
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lumio-template__badge--soft {
  color: var(--template-text);
  background: color-mix(in srgb, var(--template-color-primary) 12%, rgba(255, 255, 255, 0.42));
}

.lumio-template__badge--outline {
  color: var(--template-text-muted);
  background: color-mix(in srgb, var(--template-surface) 72%, transparent);
}

.lumio-template__badge--highlight {
  color: var(--template-hero-text);
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lumio-template__skill {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0.46rem 0.78rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background: color-mix(in srgb, var(--template-surface) 76%, rgba(255, 255, 255, 0.42));
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--template-text);
}

.lumio-template--mode-dark .lumio-template__skill {
  background: color-mix(in srgb, var(--template-surface) 76%, rgba(255, 255, 255, 0.04));
}

.lumio-template__stat-grid,
.lumio-template__contact-stack,
.lumio-template__secondary-list {
  display: grid;
  gap: 1rem;
}

.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-label {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--template-text-muted);
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.35rem;
  line-height: 1;
  color: color-mix(in srgb, var(--template-color-secondary) 24%, #1f2937);
}

.lumio-template--mode-dark .lumio-template__stat-value {
  color: var(--template-hero-text);
}

.lumio-template__projects-shell {
  display: grid;
  gap: 1rem;
}

.lumio-template__projects-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.lumio-template__section-title {
  margin-top: 0.45rem;
  font-size: clamp(1.45rem, 3vw, 2.2rem);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.lumio-template__projects-grid,
.lumio-template__footer-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__lead-card {
  display: grid;
  gap: 0.9rem;
  align-content: start;
  min-height: 0;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.84rem 1rem;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: var(--template-hero-text);
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 16px 30px -22px color-mix(in srgb, var(--template-color-primary) 48%, transparent);
}

.lumio-template__mini-title {
  font-size: 1rem;
  line-height: 1.18;
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  text-decoration: none;
  color: inherit;
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.95rem;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--template-color-primary) 16%, transparent);
  color: color-mix(in srgb, var(--template-color-secondary) 30%, #1f2937);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--template-color-primary) 18%, transparent);
}

.lumio-template--mode-dark .lumio-template__contact-icon {
  color: var(--template-hero-text);
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.16rem;
  min-width: 0;
}

.lumio-template__frame-shell--single,
.lumio-template__footer-grid--single {
  grid-template-columns: 1fr;
}

@media (hover: hover) {
  .lumio-template__action:hover,
  .lumio-template__contact-card:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 767px) {
  .lumio-template {
    border-radius: 1.45rem;
  }

  .lumio-template__frame-shell,
  .lumio-template__body {
    padding: 0.82rem;
  }

  .lumio-template__hero-card,
  .lumio-template__about-card,
  .lumio-template__stat-card,
  .lumio-template__projects-shell,
  .lumio-template__lead-card,
  .lumio-template__secondary-card,
  .lumio-template__panel,
  .lumio-template__contact-card {
    padding: 0.9rem;
  }

  .lumio-template__name {
    font-size: clamp(2.15rem, 11vw, 3.8rem);
  }

  .lumio-template__headline {
    max-width: none;
    font-size: 0.94rem;
    line-height: 1.68;
  }

  .lumio-template__section-title {
    font-size: clamp(1.16rem, 6.4vw, 1.52rem);
  }

  .lumio-template__projects-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (min-width: 900px) {
  .lumio-template__frame-shell {
    grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
    align-items: start;
  }

  .lumio-template__stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__projects-grid {
    grid-template-columns: minmax(0, 1.02fr) minmax(320px, 0.98fr);
  }

  .lumio-template__footer-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.lumio-template--device-mobile {
  border-radius: 1.45rem;
}

.lumio-template--device-mobile .lumio-template__frame-shell,
.lumio-template--device-mobile .lumio-template__body {
  padding: 0.82rem;
}

.lumio-template--device-mobile .lumio-template__hero-card,
.lumio-template--device-mobile .lumio-template__about-card,
.lumio-template--device-mobile .lumio-template__stat-card,
.lumio-template--device-mobile .lumio-template__projects-shell,
.lumio-template--device-mobile .lumio-template__lead-card,
.lumio-template--device-mobile .lumio-template__secondary-card,
.lumio-template--device-mobile .lumio-template__panel,
.lumio-template--device-mobile .lumio-template__contact-card {
  padding: 0.9rem;
}

.lumio-template--device-mobile .lumio-template__name {
  font-size: clamp(2.15rem, 11vw, 3.8rem);
}

.lumio-template--device-mobile .lumio-template__headline {
  max-width: none;
  font-size: 0.94rem;
  line-height: 1.68;
}

.lumio-template--device-mobile .lumio-template__section-title {
  font-size: clamp(1.16rem, 6.4vw, 1.52rem);
}

.lumio-template--device-mobile .lumio-template__projects-head {
  flex-direction: column;
  align-items: flex-start;
}

.lumio-template--device-mobile .lumio-template__frame-shell,
.lumio-template--device-mobile .lumio-template__projects-grid,
.lumio-template--device-mobile .lumio-template__footer-grid,
.lumio-template--device-mobile .lumio-template__stat-grid {
  grid-template-columns: 1fr;
}
</style>