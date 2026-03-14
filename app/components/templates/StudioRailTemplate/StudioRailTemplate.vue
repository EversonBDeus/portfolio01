<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioTemplateTheme } from '~/composables/usePortfolioTemplateTheme'
import type {
  PortfolioPublicViewModel,
  PortfolioTemplateMode
} from '~/types/portfolio-public-view-model'

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
}>(), {
  themeName: 'Studio Rail',
  templatePresetId: null,
  templateMode: 'dark'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Portfólio com rail lateral, estrutura modular e leitura de estúdio.'
})

const summary = computed(() => {
  return props.portfolio.about.summary.trim() || 'O resumo profissional ainda não foi preenchido.'
})

const roleTitle = computed(() => props.portfolio.hero.roleTitle.trim())
const location = computed(() => props.portfolio.hero.location.trim())

const skills = computed(() => {
  return [...new Set(
    props.portfolio.hero.skills
      .map((skill) => skill.trim())
      .filter(Boolean)
  )].slice(0, 8)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter((project) => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const leadProject = computed(() => featuredProjects.value[0] ?? null)
const secondaryProjects = computed(() => featuredProjects.value.slice(1, 4))
const featuredCount = computed(() => {
  return props.portfolio.projects.filter((project) => project.featured).length
})

const stats = computed(() => {
  return [
    { label: 'Projetos', value: String(props.portfolio.projects.length) },
    { label: 'Destaques', value: String(featuredCount.value) },
    { label: 'Skills', value: String(skills.value.length) }
  ]
})

function normalizeWebsite(value: string) {
  const trimmed = String(value ?? '').trim()

  if (!trimmed) {
    return ''
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function normalizeWhatsapp(value: string) {
  const trimmed = String(value ?? '').trim()

  if (!trimmed) {
    return ''
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const digits = trimmed.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : ''
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
      external: false
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: props.portfolio.contact.linkedin.trim(),
      href: normalizeWebsite(props.portfolio.contact.linkedin),
      icon: 'i-lucide-linkedin',
      external: true
    },
    {
      key: 'github',
      label: 'GitHub',
      value: props.portfolio.contact.github.trim(),
      href: normalizeWebsite(props.portfolio.contact.github),
      icon: 'i-lucide-github',
      external: true
    },
    {
      key: 'website',
      label: 'Website',
      value: props.portfolio.contact.website.trim(),
      href: normalizeWebsite(props.portfolio.contact.website),
      icon: 'i-lucide-globe',
      external: true
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      value: props.portfolio.contact.whatsapp.trim(),
      href: normalizeWhatsapp(props.portfolio.contact.whatsapp),
      icon: 'i-lucide-message-circle',
      external: true
    }
  ]

  return items.filter((item) => Boolean(item.value && item.href))
})

const primaryContacts = computed(() => contactItems.value.slice(0, 3))
const extraContacts = computed(() => contactItems.value.slice(3))
</script>

<template>
  <article
    class="lumio-template lumio-template--studio-rail"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__shell">
      <div class="lumio-template__main">
        <section
          class="lumio-template__hero-card"
          v-reveal="{ distance: '18px', duration: 520 }"
        >
          <div class="lumio-template__hero-head">
            <span class="lumio-template__hero-mark" />
          </div>

          <h1 class="lumio-template__name">
            {{ publicName }}
          </h1>

          <p class="lumio-template__headline">
            {{ headline }}
          </p>

          <div class="lumio-template__meta-row">
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
        </section>

        <section
          class="lumio-template__lead-shell"
          v-reveal="{ delay: 60, distance: '16px', duration: 520 }"
        >
          <div class="lumio-template__lead-head">
            <div>
              <p class="lumio-template__section-kicker">
                Projeto principal
              </p>

              <h2 class="lumio-template__section-title">
                {{ leadProject ? leadProject.title : 'Projetos em destaque' }}
              </h2>
            </div>

            <div
              v-if="leadProject"
              class="lumio-template__lead-badges"
            >
              <UBadge class="lumio-template__badge lumio-template__badge--soft">
                {{ leadProject.category || 'Projeto selecionado' }}
              </UBadge>

              <UBadge
                v-if="leadProject.featured"
                class="lumio-template__badge lumio-template__badge--highlight"
              >
                Destaque
              </UBadge>
            </div>
          </div>

          <template v-if="leadProject">
            <div class="lumio-template__lead-stage">
              <div class="lumio-template__stage-panel lumio-template__stage-panel--wide">
                <span class="lumio-template__stage-line lumio-template__stage-line--header" />
                <span class="lumio-template__stage-line lumio-template__stage-line--screen" />
                <span class="lumio-template__stage-line lumio-template__stage-line--copy" />
                <span class="lumio-template__stage-line lumio-template__stage-line--copy short" />
              </div>
              <div class="lumio-template__stage-panel lumio-template__stage-panel--stack" />
            </div>

            <p class="lumio-template__copy">
              {{ leadProject.summary || 'Projeto ainda sem descrição pública.' }}
            </p>

            <a
              v-if="leadProject.link"
              :href="leadProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="lumio-template__action"
            >
              <UIcon name="i-lucide-arrow-up-right" />
              Abrir projeto
            </a>
          </template>

          <div
            v-else
            class="lumio-template__empty-card"
          >
            <p class="lumio-template__copy">
              Nenhum projeto público disponível no momento.
            </p>
          </div>
        </section>

        <section
          class="lumio-template__lower-grid"
          v-reveal="{ delay: 90, distance: '14px', duration: 500 }"
        >
          <article class="lumio-template__panel">
            <p class="lumio-template__section-kicker">
              Sobre
            </p>

            <h2 class="lumio-template__section-title lumio-template__section-title--compact">
              {{ headline }}
            </h2>

            <p class="lumio-template__copy">
              {{ summary }}
            </p>
          </article>

          <article class="lumio-template__panel">
            <p class="lumio-template__section-kicker">
              Contato
            </p>

            <div
              v-if="extraContacts.length"
              class="lumio-template__extra-contacts"
            >
              <UBadge
                v-for="item in extraContacts"
                :key="`extra-${item.key}`"
                class="lumio-template__badge lumio-template__badge--outline"
              >
                {{ item.label }}
              </UBadge>
            </div>

            <p
              v-else
              class="lumio-template__copy lumio-template__copy--compact"
            >
              Nenhum canal adicional foi informado ainda.
            </p>
          </article>
        </section>
      </div>

      <aside
        class="lumio-template__rail"
        v-reveal="{ delay: 80, distance: '18px', duration: 520 }"
      >
        <div class="lumio-template__rail-head">
          <span class="lumio-template__rail-line" />
          <p class="lumio-template__rail-label">
            Rail
          </p>
        </div>

        <article class="lumio-template__rail-card lumio-template__rail-card--summary">
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <p class="lumio-template__copy lumio-template__copy--compact">
            {{ summary }}
          </p>
        </article>

        <div class="lumio-template__stat-grid">
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
          v-if="secondaryProjects.length"
          class="lumio-template__rail-projects"
        >
          <article
            v-for="project in secondaryProjects"
            :key="project.id"
            class="lumio-template__rail-card"
          >
            <UBadge class="lumio-template__badge lumio-template__badge--outline">
              {{ project.category || 'Projeto selecionado' }}
            </UBadge>

            <h3 class="lumio-template__mini-title">
              {{ project.title }}
            </h3>

            <p class="lumio-template__copy lumio-template__copy--compact">
              {{ project.summary || 'Projeto ainda sem descrição pública.' }}
            </p>
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
  </article>
</template>

<style scoped>
.lumio-template {
  font-family: var(--template-font-body);
  color: var(--template-text);
  min-width: 0;
}

.lumio-template :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
}

.lumio-template--studio-rail {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent 26%),
    linear-gradient(180deg, #0a1018 0%, #111923 100%);
  box-shadow:
    0 38px 110px -60px rgba(2, 6, 23, 0.62),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.lumio-template--mode-light {
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent 26%),
    linear-gradient(180deg, #f4f3f7 0%, #fafafe 100%);
  box-shadow:
    0 28px 90px -58px rgba(15, 23, 42, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.34);
}

.lumio-template__shell {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__main,
.lumio-template__rail,
.lumio-template__hero-card,
.lumio-template__lead-shell,
.lumio-template__panel,
.lumio-template__rail-card,
.lumio-template__stat-card,
.lumio-template__contact-card,
.lumio-template__empty-card,
.lumio-template__stage-panel {
  min-width: 0;
}

.lumio-template__main,
.lumio-template__rail {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lumio-template__hero-card,
.lumio-template__lead-shell,
.lumio-template__panel,
.lumio-template__rail-card,
.lumio-template__stat-card,
.lumio-template__contact-card,
.lumio-template__empty-card {
  border-radius: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 80%, rgba(255, 255, 255, 0.03));
  box-shadow:
    0 22px 46px -42px rgba(2, 6, 23, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.lumio-template--mode-light :is(
  .lumio-template__hero-card,
  .lumio-template__lead-shell,
  .lumio-template__panel,
  .lumio-template__rail-card,
  .lumio-template__stat-card,
  .lumio-template__contact-card,
  .lumio-template__empty-card
) {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    0 18px 38px -38px rgba(15, 23, 42, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.32);
}

.lumio-template__hero-card,
.lumio-template__lead-shell,
.lumio-template__panel,
.lumio-template__rail-card,
.lumio-template__stat-card,
.lumio-template__contact-card,
.lumio-template__empty-card {
  padding: 1rem;
}

.lumio-template__hero-card {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-head {
  display: flex;
  align-items: center;
}

.lumio-template__hero-mark {
  width: 3rem;
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
  color: var(--template-hero-text);
}

.lumio-template--mode-light .lumio-template__name,
.lumio-template--mode-light .lumio-template__section-title,
.lumio-template--mode-light .lumio-template__mini-title {
  color: color-mix(in srgb, var(--template-color-secondary) 26%, #111827);
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__contact-value {
  margin: 0;
  color: var(--template-text);
  line-height: 1.78;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template--mode-light .lumio-template__headline,
.lumio-template--mode-light .lumio-template__copy,
.lumio-template--mode-light .lumio-template__contact-value {
  color: color-mix(in srgb, var(--template-text) 86%, #475569);
}

.lumio-template__headline {
  max-width: 36ch;
  font-size: 1rem;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.66;
}

.lumio-template__meta-row,
.lumio-template__lead-badges,
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
  background: color-mix(in srgb, var(--template-color-primary) 14%, rgba(255, 255, 255, 0.08));
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

.lumio-template--mode-light .lumio-template__skill {
  background: color-mix(in srgb, var(--template-surface) 82%, rgba(255, 255, 255, 0.68));
}

.lumio-template__lead-shell {
  display: grid;
  gap: 1rem;
}

.lumio-template__lead-head,
.lumio-template__projects-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-label,
.lumio-template__rail-label {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--template-text-muted);
}

.lumio-template__section-title {
  margin-top: 0.45rem;
  font-size: clamp(1.45rem, 3vw, 2.2rem);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.lumio-template__section-title--compact {
  font-size: clamp(1.08rem, 2vw, 1.44rem);
}

.lumio-template__lead-stage {
  display: grid;
  gap: 0.85rem;
}

.lumio-template__stage-panel {
  border-radius: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 82%, transparent);
  background: color-mix(in srgb, var(--template-surface) 72%, rgba(255, 255, 255, 0.04));
}

.lumio-template--mode-light .lumio-template__stage-panel {
  background: color-mix(in srgb, var(--template-surface) 82%, rgba(255, 255, 255, 0.68));
}

.lumio-template__stage-panel--wide {
  display: grid;
  gap: 0.7rem;
  min-height: 11rem;
  padding: 0.9rem;
}

.lumio-template__stage-panel--stack {
  min-height: 5rem;
}

.lumio-template__stage-line {
  display: block;
  border-radius: 999px;
  background: color-mix(in srgb, var(--template-text-muted) 22%, transparent);
}

.lumio-template__stage-line--header {
  width: 38%;
  height: 0.8rem;
}

.lumio-template__stage-line--screen {
  width: 100%;
  height: 5.8rem;
  border-radius: 1rem;
}

.lumio-template__stage-line--copy {
  width: 86%;
  height: 0.75rem;
}

.lumio-template__stage-line--copy.short {
  width: 58%;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.84rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: var(--template-hero-text);
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 16px 30px -22px color-mix(in srgb, var(--template-color-primary) 48%, transparent);
}

.lumio-template__lower-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__panel {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__rail-head {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
}

.lumio-template__rail-line {
  width: 2.2rem;
  height: 1px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__stat-grid,
.lumio-template__contact-stack,
.lumio-template__rail-projects {
  display: grid;
  gap: 1rem;
}

.lumio-template__stat-card {
  position: relative;
  overflow: hidden;
}

.lumio-template__stat-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: linear-gradient(180deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.35rem;
  line-height: 1;
  color: var(--template-hero-text);
}

.lumio-template--mode-light .lumio-template__stat-value {
  color: color-mix(in srgb, var(--template-color-secondary) 24%, #1f2937);
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
  color: var(--template-hero-text);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--template-color-primary) 18%, transparent);
}

.lumio-template--mode-light .lumio-template__contact-icon {
  color: color-mix(in srgb, var(--template-color-secondary) 28%, #1f2937);
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.16rem;
  min-width: 0;
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

  .lumio-template__shell {
    padding: 0.82rem;
  }

  .lumio-template__hero-card,
  .lumio-template__lead-shell,
  .lumio-template__panel,
  .lumio-template__rail-card,
  .lumio-template__stat-card,
  .lumio-template__contact-card,
  .lumio-template__empty-card {
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

  .lumio-template__section-title--compact {
    font-size: clamp(1rem, 5.6vw, 1.24rem);
  }

  .lumio-template__lead-head,
  .lumio-template__projects-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .lumio-template__stage-panel--wide {
    min-height: 8.6rem;
  }
}

@media (min-width: 980px) {
  .lumio-template__shell {
    grid-template-columns: minmax(0, 1.14fr) 20rem;
    align-items: start;
  }

  .lumio-template__projects-grid,
  .lumio-template__lower-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .lumio-template__contact-stack {
    grid-template-columns: 1fr;
  }

  .lumio-template__stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>