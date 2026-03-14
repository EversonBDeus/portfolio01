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
  themeName: 'Noir Signal',
  templatePresetId: null,
  templateMode: 'dark'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Portfólio escuro, preciso e orientado por contraste.'
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
  )].slice(0, 10)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter((project) => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const leadProject = computed(() => featuredProjects.value[0] ?? null)
const supportingProjects = computed(() => featuredProjects.value.slice(1, 5))
const featuredCount = computed(() => {
  return props.portfolio.projects.filter((project) => project.featured).length
})

const signalStats = computed(() => {
  return [
    {
      label: 'Projetos',
      value: String(props.portfolio.projects.length),
      detail: 'Inventário público'
    },
    {
      label: 'Destaques',
      value: String(featuredCount.value),
      detail: 'Seleção atual'
    },
    {
      label: 'Skills',
      value: String(skills.value.length),
      detail: 'Capacidades-chave'
    }
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
      key: 'whatsapp',
      label: 'WhatsApp',
      value: props.portfolio.contact.whatsapp.trim(),
      href: normalizeWhatsapp(props.portfolio.contact.whatsapp),
      icon: 'i-lucide-message-circle-more',
      external: true
    },
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
    }
  ]

  return items.filter((item) => Boolean(item.value && item.href))
})

const primaryContacts = computed(() => contactItems.value.slice(0, 2))
const extraContacts = computed(() => contactItems.value.slice(2))
</script>

<template>
  <article
    class="lumio-template lumio-template--noir-signal"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__command-shell">
      <div
        class="lumio-template__command-main"
        v-reveal="{ distance: '18px', duration: 520 }"
      >
        <span
          class="lumio-template__accent-bar"
          aria-hidden="true"
        />

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

        <div class="lumio-template__summary-inline">
          <p class="lumio-template__section-kicker">
            Resumo
          </p>

          <p class="lumio-template__copy">
            {{ summary }}
          </p>
        </div>
      </div>

      <aside
        class="lumio-template__command-rail"
        v-reveal="{ delay: 90, distance: '18px', duration: 520 }"
      >
        <div class="lumio-template__signal-grid">
          <article
            v-for="stat in signalStats"
            :key="stat.label"
            class="lumio-template__signal-card"
          >
            <p class="lumio-template__signal-label">
              {{ stat.label }}
            </p>

            <strong class="lumio-template__signal-value">
              {{ stat.value }}
            </strong>

            <span class="lumio-template__signal-detail">
              {{ stat.detail }}
            </span>
          </article>
        </div>

        <div
          v-if="primaryContacts.length"
          class="lumio-template__rail-contacts"
        >
          <a
            v-for="item in primaryContacts"
            :key="item.key"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="lumio-template__contact-card lumio-template__contact-card--rail"
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

    <div class="lumio-template__body">
      <section
        class="lumio-template__intel-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__intel-head">
          <div>
            <p class="lumio-template__section-kicker">
              Projeto principal
            </p>

            <h2 class="lumio-template__section-title">
              {{ leadProject ? leadProject.title : 'Projetos em destaque' }}
            </h2>
          </div>

          <span
            v-if="supportingProjects.length"
            class="lumio-template__support-badge"
          >
            +{{ supportingProjects.length }}
          </span>
        </div>

        <div
          v-if="leadProject"
          class="lumio-template__intel-grid"
        >
          <article class="lumio-template__lead-card">
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
              <UIcon name="i-lucide-arrow-up-right" />
              Abrir projeto
            </a>
          </article>

          <div
            v-if="supportingProjects.length"
            class="lumio-template__accordion-stack"
          >
            <details
              v-for="project in supportingProjects"
              :key="project.id"
              class="lumio-template__accordion-item"
            >
              <summary class="lumio-template__accordion-summary">
                <span class="lumio-template__accordion-title-wrap">
                  <span class="lumio-template__project-category">
                    {{ project.category || 'Projeto selecionado' }}
                  </span>

                  <span class="lumio-template__accordion-title">
                    {{ project.title }}
                  </span>
                </span>

                <UIcon
                  name="i-lucide-plus"
                  class="lumio-template__accordion-icon lumio-template__accordion-icon--plus"
                />

                <UIcon
                  name="i-lucide-minus"
                  class="lumio-template__accordion-icon lumio-template__accordion-icon--minus"
                />
              </summary>

              <div class="lumio-template__accordion-body">
                <p class="lumio-template__copy lumio-template__copy--compact">
                  {{ project.summary || 'Projeto ainda sem descrição pública.' }}
                </p>

                <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  rel="noreferrer noopener"
                  class="lumio-template__text-link"
                >
                  Ver projeto
                </a>
              </div>
            </details>
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

      <section class="lumio-template__grid">
        <article
          class="lumio-template__panel lumio-template__panel--about"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
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

        <article
          class="lumio-template__panel lumio-template__panel--contacts"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Contato
          </p>

          <div
            v-if="extraContacts.length"
            class="lumio-template__contact-grid"
          >
            <a
              v-for="item in extraContacts"
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
            Nenhum canal adicional foi informado ainda.
          </p>
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
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 12%, transparent), transparent 24%),
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-secondary) 10%, transparent), transparent 20%),
    linear-gradient(180deg, #04070d 0%, #07111a 55%, #08131d 100%);
  box-shadow:
    0 34px 110px -58px rgba(2, 6, 23, 0.62),
    inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.lumio-template--mode-light {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent 24%),
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-secondary) 8%, transparent), transparent 20%),
    linear-gradient(180deg, #f7f5fb 0%, #fbfbff 100%);
  box-shadow:
    0 28px 96px -58px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.36);
}

.lumio-template :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
}

.lumio-template__command-shell {
  display: grid;
  gap: 1rem;
  align-items: start;
  padding: 1rem;
  border-bottom: 1px solid var(--template-border);
}

.lumio-template__command-main,
.lumio-template__command-rail,
.lumio-template__signal-card,
.lumio-template__lead-card,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__summary-inline,
.lumio-template__accordion-item,
.lumio-template__empty-state {
  min-width: 0;
}

.lumio-template__command-main {
  display: grid;
  gap: 1rem;
  align-content: start;
  padding: 1.15rem;
  border-radius: 1.7rem;
  border: 1px solid var(--template-border);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 12%, transparent), transparent 48%),
    color-mix(in srgb, var(--template-surface-elevated) 84%, rgba(4, 10, 16, 0.96));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.02),
    0 26px 60px -42px rgba(2, 6, 23, 0.42);
}

.lumio-template--mode-light .lumio-template__command-main {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 7%, transparent), transparent 48%),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #fcfbff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    0 22px 54px -44px rgba(15, 23, 42, 0.1);
}

.lumio-template__command-rail {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lumio-template__accent-bar {
  display: block;
  width: 2.8rem;
  height: 1px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__name,
.lumio-template__section-title,
.lumio-template__project-title,
.lumio-template__accordion-title {
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__name {
  font-size: clamp(2.7rem, 6.2vw, 5rem);
  line-height: 0.92;
  letter-spacing: -0.055em;
  color: var(--template-hero-text);
}

.lumio-template--mode-light .lumio-template__name,
.lumio-template--mode-light .lumio-template__section-title,
.lumio-template--mode-light .lumio-template__project-title,
.lumio-template--mode-light .lumio-template__accordion-title {
  color: color-mix(in srgb, var(--template-color-secondary) 28%, #111827);
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__contact-value,
.lumio-template__signal-detail {
  margin: 0;
  color: var(--template-text);
  line-height: 1.76;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template--mode-light .lumio-template__headline,
.lumio-template--mode-light .lumio-template__copy,
.lumio-template--mode-light .lumio-template__contact-value,
.lumio-template--mode-light .lumio-template__signal-detail {
  color: color-mix(in srgb, var(--template-text) 84%, #475569);
}

.lumio-template__headline {
  max-width: 28ch;
  font-size: 1rem;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.66;
}

.lumio-template__meta,
.lumio-template__skills,
.lumio-template__tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__skills {
  margin: 0;
  padding: 0;
  list-style: none;
}

.lumio-template__meta-pill,
.lumio-template__skill,
.lumio-template__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.25rem;
  padding: 0.52rem 0.82rem;
  border-radius: 999px;
  border: 1px solid var(--template-border);
  background: color-mix(in srgb, var(--template-surface) 84%, rgba(255, 255, 255, 0.02));
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--template-text);
}

.lumio-template--mode-light .lumio-template__meta-pill,
.lumio-template--mode-light .lumio-template__skill,
.lumio-template--mode-light .lumio-template__tag {
  background: color-mix(in srgb, var(--template-surface-elevated) 84%, #fdfbff);
}

.lumio-template__tag--highlight {
  color: var(--template-hero-text);
  border-color: color-mix(in srgb, var(--template-color-primary) 26%, transparent);
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--template-color-primary) 22%, transparent),
      color-mix(in srgb, var(--template-color-secondary) 18%, transparent)
    ),
    color-mix(in srgb, var(--template-surface-elevated) 88%, rgba(255, 255, 255, 0.02));
}

.lumio-template--mode-light .lumio-template__tag--highlight {
  color: color-mix(in srgb, var(--template-color-secondary) 30%, #111827);
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--template-color-primary) 12%, transparent),
      color-mix(in srgb, var(--template-color-secondary) 10%, transparent)
    ),
    #fefcff;
}

.lumio-template__summary-inline,
.lumio-template__signal-card,
.lumio-template__intel-shell,
.lumio-template__lead-card,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__accordion-item,
.lumio-template__empty-state {
  border-radius: 1.45rem;
  border: 1px solid var(--template-border);
  background: color-mix(in srgb, var(--template-surface) 86%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.02),
    0 22px 52px -42px rgba(2, 6, 23, 0.36);
  backdrop-filter: blur(14px);
}

.lumio-template--mode-light .lumio-template__summary-inline,
.lumio-template--mode-light .lumio-template__signal-card,
.lumio-template--mode-light .lumio-template__intel-shell,
.lumio-template--mode-light .lumio-template__lead-card,
.lumio-template--mode-light .lumio-template__panel,
.lumio-template--mode-light .lumio-template__contact-card,
.lumio-template--mode-light .lumio-template__accordion-item,
.lumio-template--mode-light .lumio-template__empty-state {
  background: color-mix(in srgb, var(--template-surface-elevated) 88%, #fcfbff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    0 18px 44px -42px rgba(15, 23, 42, 0.1);
}

.lumio-template__summary-inline,
.lumio-template__signal-card,
.lumio-template__lead-card,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__empty-state {
  padding: 1rem;
}

.lumio-template__signal-grid {
  display: grid;
  gap: 0.85rem;
}

.lumio-template__signal-card {
  position: relative;
  overflow: hidden;
}

.lumio-template__signal-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: linear-gradient(180deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__signal-label,
.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__project-category {
  margin: 0;
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--template-text-muted);
}

.lumio-template__signal-value {
  display: block;
  margin-top: 0.55rem;
  font-size: 1.55rem;
  line-height: 1;
  color: var(--template-hero-text);
}

.lumio-template--mode-light .lumio-template__signal-value {
  color: color-mix(in srgb, var(--template-color-secondary) 30%, #111827);
}

.lumio-template__rail-contacts {
  display: grid;
  gap: 0.85rem;
}

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__intel-shell {
  padding: 1rem;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 6%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 88%, rgba(255, 255, 255, 0.02));
}

.lumio-template--mode-light .lumio-template__intel-shell {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 5%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #fcfbff);
}

.lumio-template__intel-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lumio-template__support-badge {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--template-border);
  background: color-mix(in srgb, var(--template-color-secondary) 10%, transparent);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--template-text);
}

.lumio-template__section-title {
  margin-top: 0.45rem;
  font-size: clamp(1.45rem, 3vw, 2.2rem);
  line-height: 1.06;
  letter-spacing: -0.04em;
}

.lumio-template__section-title--compact {
  font-size: clamp(1.08rem, 2vw, 1.42rem);
}

.lumio-template__intel-grid,
.lumio-template__grid,
.lumio-template__contact-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__lead-card {
  display: grid;
  gap: 0.95rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface-elevated) 88%, rgba(255, 255, 255, 0.02));
}

.lumio-template--mode-light .lumio-template__lead-card {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 7%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #fcfbff);
}

.lumio-template__project-title,
.lumio-template__accordion-title {
  font-size: 1.2rem;
  line-height: 1.14;
  color: var(--template-hero-text);
}

.lumio-template__accordion-stack {
  display: grid;
  gap: 0.85rem;
}

.lumio-template__accordion-item {
  overflow: hidden;
}

.lumio-template__accordion-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 1rem;
  list-style: none;
  cursor: pointer;
}

.lumio-template__accordion-summary::-webkit-details-marker {
  display: none;
}

.lumio-template__accordion-title-wrap {
  display: grid;
  gap: 0.28rem;
  min-width: 0;
}

.lumio-template__accordion-icon {
  flex-shrink: 0;
}

.lumio-template__accordion-icon--minus {
  display: none;
}

.lumio-template__accordion-item[open] .lumio-template__accordion-icon--plus {
  display: none;
}

.lumio-template__accordion-item[open] .lumio-template__accordion-icon--minus {
  display: inline-flex;
}

.lumio-template__accordion-body {
  display: grid;
  gap: 0.75rem;
  padding: 0 1rem 1rem;
  border-top: 1px solid color-mix(in srgb, var(--template-border) 78%, transparent);
}

.lumio-template__text-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  color: var(--template-color-primary);
  font-weight: 700;
  text-decoration: none;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  margin-top: 0.2rem;
  padding: 0.86rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: var(--template-hero-text);
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 18px 34px -24px color-mix(in srgb, var(--template-color-primary) 54%, transparent);
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.82rem;
  text-decoration: none;
  color: inherit;
}

.lumio-template__contact-card--rail {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-secondary) 6%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface) 86%, rgba(255, 255, 255, 0.02));
}

.lumio-template--mode-light .lumio-template__contact-card--rail {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-secondary) 5%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #fcfbff);
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 1rem;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--template-color-primary) 14%, transparent);
  color: var(--template-color-primary);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--template-color-primary) 18%, transparent);
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}

.lumio-template__empty-state {
  display: grid;
  gap: 0.65rem;
}

@media (hover: hover) {
  .lumio-template__action:hover,
  .lumio-template__contact-card:hover,
  .lumio-template__accordion-item:hover,
  .lumio-template__text-link:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 767px) {
  .lumio-template {
    border-radius: 1.4rem;
  }

  .lumio-template__command-shell,
  .lumio-template__body {
    padding: 0.82rem;
  }

  .lumio-template__command-main,
  .lumio-template__summary-inline,
  .lumio-template__signal-card,
  .lumio-template__intel-shell,
  .lumio-template__lead-card,
  .lumio-template__panel,
  .lumio-template__contact-card,
  .lumio-template__accordion-summary,
  .lumio-template__empty-state {
    padding: 0.9rem;
  }

  .lumio-template__accordion-body {
    padding: 0 0.9rem 0.9rem;
  }

  .lumio-template__name {
    font-size: clamp(2.05rem, 11vw, 3.15rem);
  }

  .lumio-template__headline {
    max-width: none;
    font-size: 0.92rem;
    line-height: 1.66;
  }

  .lumio-template__section-title {
    font-size: clamp(1.18rem, 6.6vw, 1.55rem);
  }

  .lumio-template__section-title--compact {
    font-size: clamp(1rem, 5.6vw, 1.24rem);
  }

  .lumio-template__project-title,
  .lumio-template__accordion-title {
    font-size: 1.04rem;
  }

  .lumio-template__copy,
  .lumio-template__contact-value,
  .lumio-template__signal-detail {
    font-size: 0.9rem;
    line-height: 1.62;
  }

  .lumio-template__copy--compact {
    font-size: 0.86rem;
  }

  .lumio-template__meta-pill,
  .lumio-template__skill,
  .lumio-template__tag {
    font-size: 0.68rem;
  }

  .lumio-template__intel-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (min-width: 980px) {
  .lumio-template__command-shell {
    grid-template-columns: minmax(0, 1.16fr) minmax(320px, 0.84fr);
  }

  .lumio-template__intel-grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  }

  .lumio-template__grid {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>