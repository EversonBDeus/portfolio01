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
  themeName: 'Aurora UX',
  templatePresetId: null,
  templateMode: 'light'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Template clean, direto e preparado para leitura de produto e UX.'
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
    class="lumio-template lumio-template--aurora-ux"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero">
      <div class="lumio-template__hero-grid">
        <div
          class="lumio-template__hero-main"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <h1 class="lumio-template__name">
            {{ publicName }}
          </h1>

          <p class="lumio-template__headline">
            {{ headline }}
          </p>

          <div class="lumio-template__meta">
            <span
              v-if="roleTitle"
              class="lumio-template__meta-pill"
            >
              <UIcon name="i-lucide-briefcase-business" />
              {{ roleTitle }}
            </span>

            <span
              v-if="location"
              class="lumio-template__meta-pill"
            >
              <UIcon name="i-lucide-map-pin" />
              {{ location }}
            </span>
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

        <aside
          class="lumio-template__hero-side"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
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

          <div class="lumio-template__card">
            <p class="lumio-template__section-kicker">
              Resumo
            </p>

            <p class="lumio-template__copy lumio-template__copy--compact">
              {{ summary }}
            </p>
          </div>
        </aside>
      </div>
    </section>

    <div class="lumio-template__body">
      <section class="lumio-template__grid lumio-template__grid--intro">
        <article
          class="lumio-template__card"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <h2 class="lumio-template__section-title">
            {{ headline }}
          </h2>

          <p class="lumio-template__copy">
            {{ summary }}
          </p>
        </article>

        <article
          class="lumio-template__card"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Contato principal
          </p>

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

          <p
            v-else
            class="lumio-template__copy lumio-template__copy--compact"
          >
            Nenhum canal público foi informado ainda.
          </p>
        </article>
      </section>

      <section
        class="lumio-template__feature-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__feature-header">
          <div>
            <p class="lumio-template__section-kicker">
              Projeto principal
            </p>

            <h2 class="lumio-template__section-title">
              {{ leadProject ? leadProject.title : 'Projetos em destaque' }}
            </h2>
          </div>

          <span
            v-if="secondaryProjects.length"
            class="lumio-template__support-count"
          >
            +{{ secondaryProjects.length }} projetos auxiliares
          </span>
        </div>

        <div
          v-if="leadProject"
          class="lumio-template__feature-grid"
        >
          <article class="lumio-template__feature-card">
            <div class="lumio-template__tag-row">
              <span class="lumio-template__tag">
                {{ leadProject.category || 'Projeto selecionado' }}
              </span>

              <span
                v-if="leadProject.featured"
                class="lumio-template__tag lumio-template__tag--highlight"
              >
                Destaque
              </span>
            </div>

            <h3 class="lumio-template__project-title">
              {{ leadProject.title }}
            </h3>

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
              Abrir projeto
            </a>
          </article>

          <div
            v-if="secondaryProjects.length"
            class="lumio-template__support-list"
          >
            <article
              v-for="project in secondaryProjects"
              :key="project.id"
              class="lumio-template__support-card"
            >
              <p class="lumio-template__project-category">
                {{ project.category || 'Projeto selecionado' }}
              </p>

              <h3 class="lumio-template__project-card-title">
                {{ project.title }}
              </h3>

              <p class="lumio-template__copy lumio-template__copy--compact">
                {{ project.summary || 'Projeto ainda sem descrição pública.' }}
              </p>
            </article>
          </div>
        </div>

        <div
          v-else
          class="lumio-template__empty-state"
        >
          <p class="lumio-template__copy">
            Nenhum projeto público disponível no momento.
          </p>
        </div>
      </section>

      <section
        v-if="extraContacts.length"
        class="lumio-template__card"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <p class="lumio-template__section-kicker">
          Mais canais
        </p>

        <div class="lumio-template__footer-contacts">
          <a
            v-for="item in extraContacts"
            :key="`extra-${item.key}`"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="lumio-template__footer-contact"
          >
            <UIcon :name="item.icon" />
            <span>{{ item.value }}</span>
          </a>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.lumio-template {
  --aurora-outline-light: color-mix(in srgb, var(--template-color-secondary) 14%, rgba(15, 23, 42, 0.12));
  --aurora-outline-dark: color-mix(in srgb, var(--template-border) 84%, rgba(255, 255, 255, 0.08));
  --aurora-text-strong-light: color-mix(in srgb, var(--template-color-secondary) 24%, #08111c);
  --aurora-text-soft-light: color-mix(in srgb, var(--template-color-secondary) 14%, #334155);
  --aurora-text-muted-light: color-mix(in srgb, var(--template-color-primary) 14%, #64748b);
  --aurora-surface-light: color-mix(in srgb, var(--template-color-primary) 4%, #ffffff);
  --aurora-surface-light-elevated: color-mix(in srgb, var(--template-color-secondary) 5%, #ffffff);
  --aurora-surface-dark: color-mix(in srgb, var(--template-surface) 90%, #030712);
  --aurora-surface-dark-elevated: color-mix(in srgb, var(--template-surface-elevated) 94%, #02060b);
  font-family: var(--template-font-body);
  border-radius: 2rem;
  overflow: hidden;
  min-width: 0;
}

.lumio-template--mode-light {
  color: var(--aurora-text-soft-light);
  border: 1px solid var(--aurora-outline-light);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 16%, transparent), transparent 24%),
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-secondary) 14%, transparent), transparent 28%),
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, #f8fbff), #ffffff 58%);
  box-shadow: 0 32px 100px -56px rgba(15, 23, 42, 0.14);
}

.lumio-template--mode-dark {
  color: var(--template-text);
  border: 1px solid var(--aurora-outline-dark);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 22%, transparent), transparent 24%),
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-secondary) 18%, transparent), transparent 26%),
    linear-gradient(180deg, #061018, #08121d 52%, #0a1622);
  box-shadow: 0 32px 100px -56px rgba(15, 23, 42, 0.48);
}

.lumio-template--mode-light :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
  color: var(--aurora-text-strong-light);
}

.lumio-template--mode-dark :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
  color: var(--template-hero-text);
}

.lumio-template__hero {
  padding: 1.35rem;
}

.lumio-template--mode-light .lumio-template__hero {
  border-bottom: 1px solid var(--aurora-outline-light);
  background: linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent);
}

.lumio-template--mode-dark .lumio-template__hero {
  border-bottom: 1px solid var(--aurora-outline-dark);
  background: linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 14%, transparent), transparent);
}

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__hero-grid,
.lumio-template__grid,
.lumio-template__feature-grid,
.lumio-template__contact-stack,
.lumio-template__stat-grid,
.lumio-template__support-list,
.lumio-template__footer-contacts {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-main,
.lumio-template__hero-side,
.lumio-template__card,
.lumio-template__feature-card,
.lumio-template__support-card,
.lumio-template__contact-card,
.lumio-template__stat-card,
.lumio-template__empty-state {
  min-width: 0;
}

.lumio-template__hero-main,
.lumio-template__hero-side {
  align-content: start;
}

.lumio-template__hero-main {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-side {
  display: grid;
  gap: 0.9rem;
}

.lumio-template__meta,
.lumio-template__skills,
.lumio-template__tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__skills {
  list-style: none;
  margin: 0;
  padding: 0;
}

.lumio-template__meta-pill,
.lumio-template__skill,
.lumio-template__tag,
.lumio-template__footer-contact {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.45rem;
  padding: 0.64rem 0.88rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
}

.lumio-template--mode-light .lumio-template__meta-pill,
.lumio-template--mode-light .lumio-template__skill,
.lumio-template--mode-light .lumio-template__tag,
.lumio-template--mode-light .lumio-template__footer-contact {
  border: 1px solid var(--aurora-outline-light);
  background: color-mix(in srgb, var(--template-color-primary) 10%, #ffffff);
  color: var(--aurora-text-strong-light);
}

.lumio-template--mode-dark .lumio-template__meta-pill,
.lumio-template--mode-dark .lumio-template__skill,
.lumio-template--mode-dark .lumio-template__tag,
.lumio-template--mode-dark .lumio-template__footer-contact {
  border: 1px solid var(--aurora-outline-dark);
  background: color-mix(in srgb, var(--template-color-primary) 10%, var(--aurora-surface-dark-elevated));
  color: var(--template-text);
}

.lumio-template__tag--highlight {
  font-weight: 700;
}

.lumio-template--mode-light .lumio-template__tag--highlight {
  color: color-mix(in srgb, var(--template-color-primary) 64%, #1e293b);
  background: color-mix(in srgb, var(--template-color-primary) 16%, #ffffff);
}

.lumio-template--mode-dark .lumio-template__tag--highlight {
  color: var(--template-hero-text);
  background: color-mix(in srgb, var(--template-color-primary) 18%, var(--aurora-surface-dark-elevated));
}

.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-label,
.lumio-template__project-category {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template--mode-light .lumio-template__section-kicker,
.lumio-template--mode-light .lumio-template__contact-label,
.lumio-template--mode-light .lumio-template__stat-label,
.lumio-template--mode-light .lumio-template__project-category {
  color: var(--aurora-text-muted-light);
}

.lumio-template--mode-dark .lumio-template__section-kicker,
.lumio-template--mode-dark .lumio-template__contact-label,
.lumio-template--mode-dark .lumio-template__stat-label,
.lumio-template--mode-dark .lumio-template__project-category {
  color: var(--template-text-muted);
}

.lumio-template__name,
.lumio-template__section-title,
.lumio-template__project-title,
.lumio-template__project-card-title {
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__name {
  font-size: clamp(2.6rem, 5.8vw, 5rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__contact-value {
  margin: 0;
  line-height: 1.78;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__headline {
  max-width: 25ch;
  font-size: 1rem;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.72;
}

.lumio-template--mode-light .lumio-template__headline,
.lumio-template--mode-light .lumio-template__copy,
.lumio-template--mode-light .lumio-template__contact-value {
  color: var(--aurora-text-soft-light);
  opacity: 1;
}

.lumio-template--mode-dark .lumio-template__headline,
.lumio-template--mode-dark .lumio-template__copy,
.lumio-template--mode-dark .lumio-template__contact-value {
  color: var(--template-text);
  opacity: 0.86;
}

.lumio-template__card,
.lumio-template__feature-shell,
.lumio-template__feature-card,
.lumio-template__support-card,
.lumio-template__contact-card,
.lumio-template__stat-card,
.lumio-template__empty-state {
  padding: 1.05rem;
  border-radius: 1.55rem;
  backdrop-filter: blur(12px);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.lumio-template--mode-light .lumio-template__card,
.lumio-template--mode-light .lumio-template__feature-shell,
.lumio-template--mode-light .lumio-template__feature-card,
.lumio-template--mode-light .lumio-template__support-card,
.lumio-template--mode-light .lumio-template__contact-card,
.lumio-template--mode-light .lumio-template__stat-card,
.lumio-template--mode-light .lumio-template__empty-state {
  border: 1px solid var(--aurora-outline-light);
  background: var(--aurora-surface-light-elevated);
  box-shadow: 0 18px 48px -36px rgba(15, 23, 42, 0.18);
}

.lumio-template--mode-dark .lumio-template__card,
.lumio-template--mode-dark .lumio-template__feature-shell,
.lumio-template--mode-dark .lumio-template__feature-card,
.lumio-template--mode-dark .lumio-template__support-card,
.lumio-template--mode-dark .lumio-template__contact-card,
.lumio-template--mode-dark .lumio-template__stat-card,
.lumio-template--mode-dark .lumio-template__empty-state {
  border: 1px solid var(--aurora-outline-dark);
  background: color-mix(in srgb, var(--template-surface) 74%, rgba(4, 10, 16, 0.94));
  box-shadow: 0 24px 56px -42px rgba(2, 6, 23, 0.42);
}

.lumio-template--mode-light .lumio-template__feature-shell {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-secondary) 8%, transparent), transparent),
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, #ffffff), #ffffff 68%);
}

.lumio-template--mode-dark .lumio-template__feature-shell {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-secondary) 12%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 82%, rgba(4, 10, 16, 0.96));
}

.lumio-template--mode-light .lumio-template__stat-card {
  background: color-mix(in srgb, var(--template-color-primary) 10%, #ffffff);
}

.lumio-template--mode-dark .lumio-template__stat-card {
  background: color-mix(in srgb, var(--template-color-primary) 12%, var(--aurora-surface-dark-elevated));
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.3rem;
  line-height: 1;
}

.lumio-template--mode-light .lumio-template__stat-value,
.lumio-template--mode-light .lumio-template__support-count,
.lumio-template--mode-light .lumio-template__project-title,
.lumio-template--mode-light .lumio-template__project-card-title {
  color: var(--aurora-text-strong-light);
}

.lumio-template--mode-dark .lumio-template__stat-value,
.lumio-template--mode-dark .lumio-template__support-count,
.lumio-template--mode-dark .lumio-template__project-title,
.lumio-template--mode-dark .lumio-template__project-card-title {
  color: var(--template-hero-text);
}

.lumio-template__feature-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lumio-template__support-count {
  display: inline-flex;
  align-items: center;
  min-height: 2.4rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 700;
  white-space: nowrap;
}

.lumio-template--mode-light .lumio-template__support-count {
  border: 1px solid var(--aurora-outline-light);
  background: color-mix(in srgb, var(--template-color-secondary) 10%, #ffffff);
}

.lumio-template--mode-dark .lumio-template__support-count {
  border: 1px solid var(--aurora-outline-dark);
  background: color-mix(in srgb, var(--template-color-secondary) 12%, var(--aurora-surface-dark-elevated));
}

.lumio-template__section-title {
  margin-top: 0.55rem;
  font-size: clamp(1.42rem, 3vw, 2.24rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.lumio-template__project-title,
.lumio-template__project-card-title {
  font-size: 1.2rem;
  line-height: 1.18;
}

.lumio-template__project-card-title {
  font-size: 1rem;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 2.8rem;
  margin-top: 0.8rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 18px 34px -22px color-mix(in srgb, var(--template-color-primary) 56%, transparent);
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  color: inherit;
  text-decoration: none;
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 1rem;
  flex-shrink: 0;
}

.lumio-template--mode-light .lumio-template__contact-icon {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--template-color-primary) 14%, #ffffff),
    color-mix(in srgb, var(--template-color-secondary) 16%, #ffffff)
  );
  color: var(--aurora-text-strong-light);
}

.lumio-template--mode-dark .lumio-template__contact-icon {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--template-color-primary) 18%, transparent),
    color-mix(in srgb, var(--template-color-secondary) 20%, transparent)
  );
  color: var(--template-hero-text);
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}

@media (hover: hover) {
  .lumio-template__action:hover,
  .lumio-template__contact-card:hover,
  .lumio-template__support-card:hover,
  .lumio-template__footer-contact:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 767px) {
  .lumio-template {
    border-radius: 1.45rem;
  }

  .lumio-template__hero {
    padding: 0.88rem;
  }

  .lumio-template__body {
    gap: 0.8rem;
    padding: 0.76rem;
  }

  .lumio-template__hero-grid,
  .lumio-template__grid,
  .lumio-template__feature-grid,
  .lumio-template__contact-stack,
  .lumio-template__stat-grid,
  .lumio-template__support-list,
  .lumio-template__footer-contacts {
    gap: 0.78rem;
  }

  .lumio-template__name {
    font-size: clamp(1.8rem, 10vw, 2.85rem);
  }

  .lumio-template__headline {
    max-width: none;
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .lumio-template__section-title {
    font-size: clamp(1.18rem, 7vw, 1.56rem);
  }

  .lumio-template__project-title {
    font-size: 1.05rem;
  }

  .lumio-template__project-card-title {
    font-size: 0.96rem;
  }

  .lumio-template__copy,
  .lumio-template__contact-value {
    font-size: 0.92rem;
    line-height: 1.66;
  }

  .lumio-template__copy--compact {
    font-size: 0.88rem;
  }

  .lumio-template__meta,
  .lumio-template__skills,
  .lumio-template__tag-row {
    gap: 0.5rem;
  }

  .lumio-template__meta-pill,
  .lumio-template__skill,
  .lumio-template__tag,
  .lumio-template__footer-contact {
    min-height: 2.15rem;
    padding: 0.5rem 0.72rem;
    font-size: 0.72rem;
  }

  .lumio-template__card,
  .lumio-template__feature-shell,
  .lumio-template__feature-card,
  .lumio-template__support-card,
  .lumio-template__contact-card,
  .lumio-template__stat-card,
  .lumio-template__empty-state {
    padding: 0.88rem;
    border-radius: 1.2rem;
  }

  .lumio-template__contact-card {
    gap: 0.72rem;
  }

  .lumio-template__contact-icon {
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 0.85rem;
  }

  .lumio-template__feature-header {
    flex-direction: column;
    align-items: start;
    gap: 0.75rem;
  }

  .lumio-template__support-count {
    min-height: 2.15rem;
    padding: 0 0.78rem;
    font-size: 0.76rem;
  }
}

@media (min-width: 900px) {
  .lumio-template__hero-grid {
    grid-template-columns: minmax(0, 1.14fr) minmax(340px, 0.86fr);
    align-items: start;
  }

  .lumio-template__stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__grid--intro {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .lumio-template__feature-grid {
    grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
  }

  .lumio-template__contact-stack {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__footer-contacts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>