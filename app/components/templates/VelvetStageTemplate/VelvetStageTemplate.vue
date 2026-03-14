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
  themeName: 'Velvet Stage',
  templatePresetId: null,
  templateMode: 'dark',
  previewDevice: 'desktop',
  sectionVisibility: null,
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const visibleSections = computed(() => ({
  hero: props.sectionVisibility?.hero ?? true,
  about: props.sectionVisibility?.about ?? true,
  projects: props.sectionVisibility?.projects ?? true,
  contact: props.sectionVisibility?.contact ?? true,
}))

const publicName = computed(() => props.portfolio.hero.publicName.trim())
const headline = computed(() => props.portfolio.hero.headline.trim())
const summary = computed(() => props.portfolio.about.summary.trim())
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
const supportingProjects = computed(() => featuredProjects.value.slice(1, 4))
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
  return digits ? `+${digits}` : trimmed
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

const primaryContacts = computed(() => contactItems.value.slice(0, 2))
const extraContacts = computed(() => contactItems.value.slice(2))

const heroVisible = computed(() => {
  return visibleSections.value.hero && Boolean(
    publicName.value
    || headline.value
    || roleTitle.value
    || location.value
    || skills.value.length,
  )
})

const aboutVisible = computed(() => {
  return visibleSections.value.about && Boolean(summary.value)
})

const projectsVisible = computed(() => {
  return visibleSections.value.projects && Boolean(leadProject.value)
})

const contactVisible = computed(() => {
  return visibleSections.value.contact && contactItems.value.length > 0
})

const stageStats = computed(() => {
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

const heroStageVisible = computed(() => {
  return heroVisible.value || projectsVisible.value || stageStats.value.length > 0 || primaryContacts.value.length > 0
})

const heroStageSingle = computed(() => {
  return !(heroVisible.value && (projectsVisible.value || stageStats.value.length > 0 || primaryContacts.value.length > 0))
})

const lowerVisible = computed(() => {
  return aboutVisible.value || extraContacts.value.length > 0 || supportingProjects.value.length > 0
})

const lowerCount = computed(() => {
  return Number(aboutVisible.value) + Number(extraContacts.value.length > 0 || supportingProjects.value.length > 0)
})
</script>

<template>
  <article
    class="lumio-template lumio-template--velvet-stage"
    :class="[
      `lumio-template--mode-${props.templateMode}`,
      `lumio-template--device-${props.previewDevice}`,
    ]"
    :style="themeVars"
  >
    <section
      v-if="heroStageVisible"
      class="lumio-template__hero-stage"
      :class="{ 'lumio-template__hero-stage--single': heroStageSingle }"
    >
      <div
        v-if="heroVisible"
        class="lumio-template__hero-card"
        v-reveal="{ distance: '20px', duration: 540 }"
      >
        <div class="lumio-template__hero-mark" />

        <h1 class="lumio-template__name">
          {{ publicName }}
        </h1>

        <p
          v-if="headline"
          class="lumio-template__headline"
        >
          {{ headline }}
        </p>

        <div
          v-if="roleTitle || location || featuredCount > 0"
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

          <UBadge
            v-if="featuredCount > 0"
            class="lumio-template__badge lumio-template__badge--highlight"
          >
            {{ featuredCount }} destaque<span v-if="featuredCount > 1">s</span>
          </UBadge>
        </div>

        <ul
          v-if="skills.length"
          class="lumio-template__skills"
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
        v-if="projectsVisible || stageStats.length > 0 || primaryContacts.length > 0"
        class="lumio-template__hero-side"
        v-reveal="{ delay: 80, distance: '18px', duration: 520 }"
      >
        <article
          v-if="projectsVisible"
          class="lumio-template__feature-card"
        >
          <div class="lumio-template__feature-head">
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
              class="lumio-template__feature-badges"
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
          v-if="stageStats.length > 0"
          class="lumio-template__stats-grid"
        >
          <article
            v-for="stat in stageStats"
            :key="stat.label"
            class="lumio-template__stat-card"
          >
            <p class="lumio-template__stat-label">{{ stat.label }}</p>
            <strong class="lumio-template__stat-value">{{ stat.value }}</strong>
          </article>
        </div>

        <div
          v-if="primaryContacts.length > 0"
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
      </div>
    </section>

    <section
      v-if="lowerVisible"
      class="lumio-template__lower"
      :class="{ 'lumio-template__lower--single': lowerCount <= 1 }"
      v-reveal="{ delay: 100, distance: '14px', duration: 500 }"
    >
      <article
        v-if="aboutVisible"
        class="lumio-template__panel"
      >
        <p class="lumio-template__section-kicker">
          Resumo
        </p>

        <p class="lumio-template__copy">
          {{ summary }}
        </p>
      </article>

      <article
        v-if="supportingProjects.length > 0 || extraContacts.length > 0"
        class="lumio-template__panel"
      >
        <p class="lumio-template__section-kicker">
          Extensões
        </p>

        <div
          v-if="supportingProjects.length > 0"
          class="lumio-template__support-grid"
        >
          <article
            v-for="project in supportingProjects"
            :key="project.id"
            class="lumio-template__mini-card"
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

        <div
          v-if="extraContacts.length > 0"
          class="lumio-template__extra-contacts"
        >
          <a
            v-for="item in extraContacts"
            :key="`extra-${item.key}`"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="lumio-template__inline-contact"
          >
            <UIcon :name="item.icon" />
            <span>{{ item.label }} · {{ item.value }}</span>
          </a>
        </div>
      </article>
    </section>
  </article>
</template>

<style scoped>
.lumio-template {
  font-family: var(--template-font-body);
  color: var(--template-text);
  min-width: 0;
}

.lumio-template--velvet-stage {
  border-radius: 2rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 16%, transparent), transparent 24%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 18%, transparent), transparent 24%),
    linear-gradient(180deg, rgba(18, 10, 28, 0.98), rgba(24, 12, 34, 0.98));
  box-shadow:
    0 42px 116px -62px rgba(18, 10, 28, 0.68),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.lumio-template--mode-light.lumio-template--velvet-stage {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent 24%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 12%, transparent), transparent 24%),
    linear-gradient(180deg, rgba(250, 244, 248, 0.98), rgba(255, 252, 253, 0.98));
  box-shadow:
    0 28px 88px -56px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.36);
}

.lumio-template__hero-stage,
.lumio-template__lower {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__hero-stage--single,
.lumio-template__lower--single {
  grid-template-columns: 1fr;
}

.lumio-template__hero-card,
.lumio-template__feature-card,
.lumio-template__stat-card,
.lumio-template__contact-card,
.lumio-template__panel,
.lumio-template__mini-card {
  border-radius: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 6%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 76%, rgba(255, 255, 255, 0.03));
  box-shadow:
    0 24px 46px -42px rgba(18, 10, 28, 0.36),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

.lumio-template--mode-light :is(
  .lumio-template__hero-card,
  .lumio-template__feature-card,
  .lumio-template__stat-card,
  .lumio-template__contact-card,
  .lumio-template__panel,
  .lumio-template__mini-card
) {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 90%, #ffffff);
  box-shadow:
    0 18px 38px -36px rgba(15, 23, 42, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.32);
}

.lumio-template__hero-card,
.lumio-template__hero-side,
.lumio-template__contact-stack {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-mark {
  width: 4rem;
  height: 0.24rem;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  box-shadow: 0 0 24px color-mix(in srgb, var(--template-color-primary) 44%, transparent);
}

.lumio-template__name,
.lumio-template__section-title,
.lumio-template__mini-title {
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__name {
  font-size: clamp(2.8rem, 8vw, 5.2rem);
  line-height: 0.92;
  letter-spacing: -0.068em;
  color: var(--template-hero-text);
}

.lumio-template--mode-light .lumio-template__name,
.lumio-template--mode-light .lumio-template__section-title,
.lumio-template--mode-light .lumio-template__mini-title {
  color: color-mix(in srgb, var(--template-color-secondary) 24%, #111827);
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__contact-value {
  margin: 0;
  line-height: 1.78;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: var(--template-text);
}

.lumio-template--mode-light .lumio-template__headline,
.lumio-template--mode-light .lumio-template__copy,
.lumio-template--mode-light .lumio-template__contact-value {
  color: color-mix(in srgb, var(--template-text) 86%, #475569);
}

.lumio-template__headline {
  max-width: 34ch;
  font-size: 1.02rem;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.66;
}

.lumio-template__meta-row,
.lumio-template__feature-badges,
.lumio-template__support-grid,
.lumio-template__extra-contacts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__support-grid {
  display: grid;
}

.lumio-template__badge {
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lumio-template__badge--soft {
  color: var(--template-text);
  background: color-mix(in srgb, var(--template-color-primary) 12%, rgba(255, 255, 255, 0.08));
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
  background: color-mix(in srgb, var(--template-surface) 74%, rgba(255, 255, 255, 0.04));
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--template-text);
}

.lumio-template__feature-card,
.lumio-template__panel {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lumio-template__feature-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.lumio-template__section-kicker,
.lumio-template__stat-label,
.lumio-template__contact-label {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--template-text-muted);
}

.lumio-template__section-title {
  font-size: clamp(1.45rem, 3vw, 2.2rem);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.lumio-template__stats-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.35rem;
  line-height: 1;
  color: var(--template-hero-text);
}

.lumio-template--mode-light .lumio-template__stat-value {
  color: color-mix(in srgb, var(--template-color-secondary) 24%, #111827);
}

.lumio-template__contact-card,
.lumio-template__inline-contact {
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
  width: 2.45rem;
  height: 2.45rem;
  border-radius: 0.92rem;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--template-color-primary) 14%, transparent);
  color: var(--template-hero-text);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--template-color-primary) 18%, transparent);
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.16rem;
  min-width: 0;
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
  box-shadow: 0 18px 34px -24px color-mix(in srgb, var(--template-color-primary) 54%, transparent);
}

@media (max-width: 767px) {
  .lumio-template__hero-stage,
  .lumio-template__lower {
    padding: 0.82rem;
  }

  .lumio-template__hero-card,
  .lumio-template__feature-card,
  .lumio-template__stat-card,
  .lumio-template__contact-card,
  .lumio-template__panel,
  .lumio-template__mini-card {
    padding: 0.9rem;
  }

  .lumio-template__stats-grid {
    grid-template-columns: 1fr;
  }

  .lumio-template__name {
    font-size: clamp(2.2rem, 11vw, 4rem);
  }

  .lumio-template__headline {
    max-width: none;
    font-size: 0.94rem;
    line-height: 1.68;
  }
}

@media (min-width: 900px) {
  .lumio-template__hero-stage {
    grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
  }

  .lumio-template__hero-stage--single {
    grid-template-columns: 1fr;
  }

  .lumio-template__lower {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }

  .lumio-template__lower--single {
    grid-template-columns: 1fr;
  }
}

.lumio-template--device-mobile .lumio-template__hero-stage,
.lumio-template--device-mobile .lumio-template__lower,
.lumio-template--device-mobile .lumio-template__stats-grid {
  grid-template-columns: 1fr;
}

.lumio-template--device-mobile .lumio-template__hero-stage,
.lumio-template--device-mobile .lumio-template__lower {
  padding: 0.82rem;
}

.lumio-template--device-mobile .lumio-template__hero-card,
.lumio-template--device-mobile .lumio-template__feature-card,
.lumio-template--device-mobile .lumio-template__stat-card,
.lumio-template--device-mobile .lumio-template__contact-card,
.lumio-template--device-mobile .lumio-template__panel,
.lumio-template--device-mobile .lumio-template__mini-card {
  padding: 0.9rem;
}

.lumio-template--device-mobile .lumio-template__name {
  font-size: clamp(2.2rem, 11vw, 4rem);
}

.lumio-template--device-mobile .lumio-template__headline {
  max-width: none;
  font-size: 0.94rem;
  line-height: 1.68;
}
</style>