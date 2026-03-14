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
  themeName: 'Still Form',
  templatePresetId: null,
  templateMode: 'light'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Portfólio calmo, editorial e orientado por clareza visual.'
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
    class="lumio-template lumio-template--still-form"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero-sheet">
      <div
        class="lumio-template__hero-main"
        v-reveal="{ distance: '18px', duration: 520 }"
      >
        <div class="lumio-template__hero-kicker">
          <span class="lumio-template__hero-line" />
          Caderno público
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
      </div>

      <aside
        class="lumio-template__hero-side"
        v-reveal="{ delay: 70, distance: '18px', duration: 520 }"
      >
        <article class="lumio-template__note-card">
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <p class="lumio-template__copy">
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
      </aside>
    </section>

    <div class="lumio-template__body">
      <section
        class="lumio-template__editorial-grid"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <article class="lumio-template__panel lumio-template__panel--lead">
          <div class="lumio-template__panel-head">
            <p class="lumio-template__section-kicker">
              Projeto principal
            </p>

            <div
              v-if="leadProject"
              class="lumio-template__panel-badges"
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
            <h2 class="lumio-template__section-title">
              {{ leadProject.title }}
            </h2>

            <p class="lumio-template__copy">
              {{ leadProject.summary || 'Projeto ainda sem descrição pública.' }}
            </p>

            <div class="lumio-template__paper-stage">
              <div class="lumio-template__paper-page lumio-template__paper-page--main">
                <span class="lumio-template__paper-line lumio-template__paper-line--title" />
                <span class="lumio-template__paper-line lumio-template__paper-line--hero" />
                <span class="lumio-template__paper-line lumio-template__paper-line--copy" />
                <span class="lumio-template__paper-line lumio-template__paper-line--copy short" />
              </div>
              <div class="lumio-template__paper-page" />
            </div>

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

          <p
            v-else
            class="lumio-template__copy"
          >
            Nenhum projeto público disponível no momento.
          </p>
        </article>

        <article class="lumio-template__panel lumio-template__panel--stack">
          <p class="lumio-template__section-kicker">
            Caderno lateral
          </p>

          <div
            v-if="secondaryProjects.length"
            class="lumio-template__stack-list"
          >
            <article
              v-for="project in secondaryProjects"
              :key="project.id"
              class="lumio-template__stack-card"
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

          <p
            v-else
            class="lumio-template__copy lumio-template__copy--compact"
          >
            Nenhum projeto adicional foi informado ainda.
          </p>
        </article>
      </section>

      <section
        class="lumio-template__lower-grid"
        v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
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
            Contato principal
          </p>

          <div
            v-if="primaryContacts.length"
            class="lumio-template__contact-grid"
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
            v-if="!primaryContacts.length"
            class="lumio-template__copy lumio-template__copy--compact"
          >
            Nenhum canal público foi informado ainda.
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
}

.lumio-template :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
}

.lumio-template--still-form {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent 26%),
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 2%, #f7f3ee), #fcfaf7 100%);
  box-shadow:
    0 30px 96px -58px rgba(15, 23, 42, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.34);
}

.lumio-template--mode-dark {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent 26%),
    linear-gradient(180deg, #0b1118 0%, #111923 100%);
  box-shadow:
    0 38px 110px -60px rgba(2, 6, 23, 0.62),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.lumio-template__hero-sheet {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--template-border) 82%, transparent);
}

.lumio-template__hero-main,
.lumio-template__hero-side,
.lumio-template__note-card,
.lumio-template__stat-card,
.lumio-template__panel,
.lumio-template__stack-card,
.lumio-template__contact-card,
.lumio-template__paper-page {
  min-width: 0;
}

.lumio-template__hero-main {
  display: grid;
  gap: 1rem;
  align-content: start;
  padding: 1.1rem;
  border-radius: 1.65rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 84%, rgba(255, 255, 255, 0.42));
  box-shadow:
    0 20px 42px -40px rgba(15, 23, 42, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.26);
}

.lumio-template--mode-dark .lumio-template__hero-main {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 6%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 78%, rgba(255, 255, 255, 0.03));
  box-shadow:
    0 24px 52px -44px rgba(2, 6, 23, 0.36),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.lumio-template__hero-side {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lumio-template__hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--template-text-muted);
}

.lumio-template__hero-line {
  width: 2.6rem;
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
  color: color-mix(in srgb, var(--template-color-secondary) 24%, #1f2937);
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
.lumio-template__panel-badges,
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

.lumio-template--mode-dark .lumio-template__badge--soft {
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
  background: color-mix(in srgb, var(--template-surface) 76%, rgba(255, 255, 255, 0.42));
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--template-text);
}

.lumio-template--mode-dark .lumio-template__skill {
  background: color-mix(in srgb, var(--template-surface) 76%, rgba(255, 255, 255, 0.04));
}

.lumio-template__note-card,
.lumio-template__stat-card,
.lumio-template__panel,
.lumio-template__stack-card,
.lumio-template__contact-card {
  border-radius: 1.45rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 86%, rgba(255, 255, 255, 0.5));
  box-shadow:
    0 18px 38px -38px rgba(15, 23, 42, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}

.lumio-template--mode-dark .lumio-template__note-card,
.lumio-template--mode-dark .lumio-template__stat-card,
.lumio-template--mode-dark .lumio-template__panel,
.lumio-template--mode-dark .lumio-template__stack-card,
.lumio-template--mode-dark .lumio-template__contact-card {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 80%, rgba(255, 255, 255, 0.03));
  box-shadow:
    0 22px 46px -42px rgba(2, 6, 23, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.lumio-template__note-card,
.lumio-template__stat-card,
.lumio-template__panel,
.lumio-template__stack-card,
.lumio-template__contact-card {
  padding: 1rem;
}

.lumio-template__stat-grid,
.lumio-template__contact-grid,
.lumio-template__stack-list {
  display: grid;
  gap: 1rem;
}

.lumio-template__stat-label,
.lumio-template__section-kicker,
.lumio-template__contact-label {
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

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__editorial-grid,
.lumio-template__lower-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__panel {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__panel--lead {
  align-content: start;
}

.lumio-template__panel-head {
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

.lumio-template__section-title--compact {
  font-size: clamp(1.08rem, 2vw, 1.44rem);
}

.lumio-template__paper-stage {
  position: relative;
  min-height: 12rem;
  margin-top: 0.3rem;
}

.lumio-template__paper-page {
  position: absolute;
  inset: 0;
  border-radius: 1.35rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 2%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 88%, rgba(255, 255, 255, 0.56));
  box-shadow:
    0 16px 28px -26px rgba(15, 23, 42, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.26);
}

.lumio-template--mode-dark .lumio-template__paper-page {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 84%, rgba(255, 255, 255, 0.03));
  box-shadow:
    0 18px 32px -28px rgba(2, 6, 23, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.lumio-template__paper-page--main {
  inset: 0 2.2rem 1rem 0;
  z-index: 2;
  padding: 1rem;
}

.lumio-template__paper-page:not(.lumio-template__paper-page--main) {
  inset: 1rem 0 0 2.2rem;
  z-index: 1;
}

.lumio-template__paper-line {
  display: block;
  border-radius: 999px;
  background: color-mix(in srgb, var(--template-text-muted) 20%, transparent);
}

.lumio-template__paper-line--title {
  width: 42%;
  height: 0.8rem;
  margin-bottom: 0.8rem;
}

.lumio-template__paper-line--hero {
  width: 100%;
  height: 5.8rem;
  margin-bottom: 0.8rem;
  border-radius: 1rem;
}

.lumio-template__paper-line--copy {
  width: 88%;
  height: 0.75rem;
}

.lumio-template__paper-line--copy.short {
  width: 62%;
  margin-top: 0.55rem;
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

  .lumio-template__hero-sheet,
  .lumio-template__body {
    padding: 0.82rem;
  }

  .lumio-template__hero-main,
  .lumio-template__note-card,
  .lumio-template__stat-card,
  .lumio-template__panel,
  .lumio-template__stack-card,
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

  .lumio-template__section-title--compact {
    font-size: clamp(1rem, 5.6vw, 1.24rem);
  }

  .lumio-template__paper-stage {
    min-height: 9rem;
  }

  .lumio-template__paper-page--main {
    inset: 0 1rem 0.7rem 0;
  }

  .lumio-template__paper-page:not(.lumio-template__paper-page--main) {
    inset: 0.7rem 0 0 1rem;
  }

  .lumio-template__panel-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (min-width: 900px) {
  .lumio-template__hero-sheet {
    grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
    align-items: start;
  }

  .lumio-template__stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__editorial-grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  }

  .lumio-template__lower-grid {
    grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr);
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>