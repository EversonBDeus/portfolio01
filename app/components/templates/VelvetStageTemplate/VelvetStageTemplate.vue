<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioTemplateTheme } from '~/composables/usePortfolioTemplateTheme'
import type { PortfolioPublicViewModel } from '~/types/portfolio-public-view-model'

type TemplateMode = 'light' | 'dark'

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
  templateMode?: TemplateMode
}>(), {
  themeName: 'Velvet Stage',
  templatePresetId: null,
  templateMode: 'dark'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const templateName = computed(() => props.themeName.trim())
const isPublished = computed(() => props.portfolio.settings.publicationStatus === 'published')
const featuredCount = computed(() => props.portfolio.projects.filter((project) => project.featured).length)

const summary = computed(() => {
  return props.portfolio.about.summary.trim() || 'O resumo profissional ainda não foi preenchido.'
})

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
const secondaryContacts = computed(() => contactItems.value.slice(3))
</script>

<template>
  <article
    class="lumio-template lumio-template--velvet-stage"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero">
      <div class="lumio-template__hero-grid">
        <div
          class="lumio-template__hero-main"
          v-reveal="{ distance: '18px', duration: 550 }"
        >
          <div class="lumio-template__pill-row">
            <span class="lumio-template__pill">
              {{ templateName }}
            </span>

            <span
              class="lumio-template__pill lumio-template__pill--status"
              :class="isPublished ? 'lumio-template__pill--success' : 'lumio-template__pill--warning'"
            >
              {{ isPublished ? 'Publicado' : 'Rascunho' }}
            </span>
          </div>

          <p class="lumio-template__slug">
            /{{ portfolio.settings.publicSlug }}
          </p>

          <h1 class="lumio-template__name">
            {{ portfolio.hero.publicName }}
          </h1>

          <p class="lumio-template__headline">
            {{ portfolio.hero.headline }}
          </p>

          <div class="lumio-template__meta">
            <span
              v-if="portfolio.hero.roleTitle"
              class="lumio-template__meta-pill"
            >
              <UIcon name="i-lucide-briefcase-business" class="lumio-template__meta-icon" />
              {{ portfolio.hero.roleTitle }}
            </span>

            <span
              v-if="portfolio.hero.location"
              class="lumio-template__meta-pill"
            >
              <UIcon name="i-lucide-map-pin" class="lumio-template__meta-icon" />
              {{ portfolio.hero.location }}
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
          class="lumio-template__hero-aside"
          v-reveal="{ delay: 90, distance: '18px', duration: 550 }"
        >
          <div class="lumio-template__stats">
            <article
              v-for="stat in stats"
              :key="stat.label"
              class="lumio-template__stat-card"
            >
              <p class="lumio-template__stat-label">
                {{ stat.label }}
              </p>

              <p class="lumio-template__stat-value">
                {{ stat.value }}
              </p>
            </article>
          </div>

          <div
            v-if="primaryContacts.length"
            class="lumio-template__contact-stack"
          >
            <p class="lumio-template__section-kicker lumio-template__section-kicker--light">
              Contato principal
            </p>

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

              <span class="lumio-template__contact-content">
                <span class="lumio-template__contact-label">{{ item.label }}</span>
                <span class="lumio-template__contact-value">{{ item.value }}</span>
              </span>
            </a>
          </div>
        </aside>
      </div>
    </section>

    <div class="lumio-template__body">
      <section class="lumio-template__intro-grid">
        <article
          class="lumio-template__panel"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <h2 class="lumio-template__section-title">
            Uma apresentação hero-first, vendável e pronta para integração.
          </h2>

          <p class="lumio-template__copy">
            {{ summary }}
          </p>
        </article>

        <article
          class="lumio-template__panel"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Escopo atual
          </p>

          <p class="lumio-template__copy">
            Sem avatar, sem currículo para download, sem certificados e sem experiência cronológica.
            O foco continua em hero, sobre, projetos e contato.
          </p>
        </article>
      </section>

      <section
        class="lumio-template__project-shell"
        v-reveal="{ distance: '16px', duration: 520 }"
      >
        <div class="lumio-template__project-header">
          <div>
            <p class="lumio-template__section-kicker">
              Projeto principal
            </p>

            <h2 class="lumio-template__section-title">
              Destaque central da vitrine pública
            </h2>
          </div>

          <div
            v-if="supportingProjects.length"
            class="lumio-template__project-count"
          >
            +{{ supportingProjects.length }} projetos secundários
          </div>
        </div>

        <div class="lumio-template__project-grid">
          <article
            v-if="leadProject"
            class="lumio-template__lead-project"
          >
            <div class="lumio-template__project-pills">
              <span class="lumio-template__pill lumio-template__pill--ghost">
                {{ leadProject.category }}
              </span>

              <span
                v-if="leadProject.featured"
                class="lumio-template__pill lumio-template__pill--success"
              >
                Destaque
              </span>
            </div>

            <h3 class="lumio-template__project-title">
              {{ leadProject.title }}
            </h3>

            <p class="lumio-template__copy">
              {{ leadProject.summary }}
            </p>

            <a
              v-if="leadProject.link"
              :href="leadProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="lumio-template__action"
            >
              <UIcon name="i-lucide-arrow-up-right" class="lumio-template__action-icon" />
              Abrir projeto
            </a>
          </article>

          <div
            v-if="supportingProjects.length"
            class="lumio-template__project-list"
          >
            <article
              v-for="project in supportingProjects"
              :key="project.id"
              class="lumio-template__project-card"
            >
              <div class="lumio-template__project-pills">
                <span class="lumio-template__pill lumio-template__pill--ghost">
                  {{ project.category }}
                </span>

                <span
                  v-if="project.featured"
                  class="lumio-template__pill lumio-template__pill--success"
                >
                  Destaque
                </span>
              </div>

              <h3 class="lumio-template__project-card-title">
                {{ project.title }}
              </h3>

              <p class="lumio-template__copy lumio-template__copy--compact">
                {{ project.summary }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section class="lumio-template__footer-grid">
        <article
          class="lumio-template__panel"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Leitura rápida
          </p>

          <h2 class="lumio-template__section-title">
            O template principal do Lumio para landing premium.
          </h2>

          <p class="lumio-template__copy">
            O layout privilegia narrativa visual, bloco hero dominante, projeto principal amplo
            e uma malha de contato pronta para o fluxo público real.
          </p>
        </article>

        <article
          class="lumio-template__panel"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Todos os canais públicos
          </p>

          <div
            v-if="contactItems.length"
            class="lumio-template__contact-grid"
          >
            <a
              v-for="item in contactItems"
              :key="`footer-${item.key}`"
              :href="item.href"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noreferrer noopener' : undefined"
              class="lumio-template__contact-inline"
            >
              <span class="lumio-template__contact-icon lumio-template__contact-icon--inline">
                <UIcon :name="item.icon" />
              </span>

              <span class="lumio-template__contact-content">
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

          <p
            v-if="secondaryContacts.length"
            class="lumio-template__footnote"
          >
            {{ secondaryContacts.length }} canal(is) extra(s) também estão disponíveis na grade abaixo.
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
}

.lumio-template :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
}

.lumio-template--velvet-stage {
  --velvet-shell-bg: #09111b;
  --velvet-body-bg: rgba(6, 12, 20, 0.96);
  --velvet-panel-bg: rgba(255, 255, 255, 0.05);
  --velvet-panel-bg-strong: rgba(255, 255, 255, 0.09);
  --velvet-panel-border: rgba(255, 255, 255, 0.12);
  --velvet-muted: rgba(255, 255, 255, 0.74);
  --velvet-subtle: rgba(255, 255, 255, 0.5);
  border: 1px solid color-mix(in srgb, var(--template-border) 78%, transparent);
  border-radius: 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 28%),
    linear-gradient(180deg, rgba(9, 17, 27, 0.98), rgba(7, 12, 20, 0.99));
  box-shadow: 0 28px 90px -46px rgba(15, 23, 42, 0.42);
}

.lumio-template--velvet-stage.lumio-template--mode-light {
  --velvet-shell-bg: #f5f7fb;
  --velvet-body-bg: rgba(255, 255, 255, 0.96);
  --velvet-panel-bg: rgba(6, 12, 20, 0.03);
  --velvet-panel-bg-strong: rgba(6, 12, 20, 0.06);
  --velvet-panel-border: rgba(15, 23, 42, 0.1);
  --velvet-muted: rgba(15, 23, 42, 0.74);
  --velvet-subtle: rgba(15, 23, 42, 0.56);
  color: #0f172a;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.55), transparent 28%),
    linear-gradient(180deg, #ffffff, #f4f7fb);
  box-shadow: 0 28px 90px -46px rgba(15, 23, 42, 0.16);
}

.lumio-template__hero {
  position: relative;
  padding: 1.4rem;
  background:
    linear-gradient(135deg, var(--template-color-primary), var(--template-color-secondary), var(--template-color-tertiary));
}

.lumio-template__hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(2, 6, 23, 0.14), rgba(2, 6, 23, 0.38));
  pointer-events: none;
}

.lumio-template__hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1.25rem;
}

.lumio-template__hero-main,
.lumio-template__hero-aside,
.lumio-template__panel,
.lumio-template__lead-project,
.lumio-template__project-card,
.lumio-template__contact-card,
.lumio-template__contact-inline,
.lumio-template__stat-card {
  min-width: 0;
}

.lumio-template__pill-row,
.lumio-template__meta,
.lumio-template__project-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(16px);
  color: #fff;
  font-size: 0.77rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lumio-template__pill--ghost {
  color: inherit;
  border-color: color-mix(in srgb, var(--template-border) 86%, transparent);
  background: var(--velvet-panel-bg);
  text-transform: none;
  letter-spacing: 0;
}

.lumio-template__pill--status {
  border-color: transparent;
}

.lumio-template__pill--success {
  background: rgba(22, 163, 74, 0.2);
  color: #dcfce7;
}

.lumio-template__pill--warning {
  background: rgba(245, 158, 11, 0.22);
  color: #fef3c7;
}

.lumio-template__slug,
.lumio-template__section-kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template__slug {
  margin-top: 1.4rem;
  color: rgba(255, 255, 255, 0.76);
}

.lumio-template__section-kicker {
  color: var(--template-color-tertiary);
}

.lumio-template__section-kicker--light {
  color: rgba(255, 255, 255, 0.72);
}

.lumio-template__name {
  margin: 0.9rem 0 0;
  font-size: clamp(2.25rem, 6vw, 4.75rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  color: #fff;
}

.lumio-template__headline {
  margin: 1rem 0 0;
  max-width: 46rem;
  color: rgba(255, 255, 255, 0.88);
  font-size: 1rem;
  line-height: 1.8;
}

.lumio-template__meta {
  margin-top: 1.1rem;
}

.lumio-template__meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 0.95rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
}

.lumio-template__meta-icon,
.lumio-template__action-icon {
  font-size: 1rem;
}

.lumio-template__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 1.1rem 0 0;
  padding: 0;
  list-style: none;
}

.lumio-template__skill {
  padding: 0.68rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.9rem;
}

.lumio-template__hero-aside {
  display: grid;
  gap: 0.9rem;
}

.lumio-template__stats {
  display: grid;
  gap: 0.75rem;
}

.lumio-template__stat-card,
.lumio-template__contact-card {
  padding: 1rem;
  border: 1px solid var(--velvet-panel-border);
  border-radius: 1.4rem;
  background: var(--velvet-panel-bg-strong);
  backdrop-filter: blur(18px);
}

.lumio-template__stat-label,
.lumio-template__contact-label {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.66);
}

.lumio-template__stat-value {
  margin: 0.55rem 0 0;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.lumio-template__contact-stack,
.lumio-template__project-list,
.lumio-template__contact-grid {
  display: grid;
  gap: 0.85rem;
}

.lumio-template__contact-card,
.lumio-template__contact-inline {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  text-decoration: none;
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.lumio-template__contact-card:hover,
.lumio-template__contact-inline:hover,
.lumio-template__action:hover {
  transform: translateY(-2px);
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  flex-shrink: 0;
}

.lumio-template__contact-icon--inline {
  width: 2.35rem;
  height: 2.35rem;
  background: color-mix(in srgb, var(--template-color-primary) 26%, transparent);
}

.lumio-template__contact-content {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

.lumio-template__contact-value {
  color: #fff;
  font-size: 0.94rem;
  font-weight: 500;
  line-height: 1.6;
  word-break: break-word;
}

.lumio-template__body {
  padding: 1rem;
  background: var(--velvet-body-bg);
}

.lumio-template__intro-grid,
.lumio-template__footer-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__panel,
.lumio-template__lead-project,
.lumio-template__project-card,
.lumio-template__contact-inline {
  padding: 1.15rem;
  border-radius: 1.7rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 80%, transparent);
  background: var(--velvet-panel-bg);
}

.lumio-template__section-title {
  margin: 0.65rem 0 0;
  font-size: clamp(1.5rem, 3vw, 2.35rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.lumio-template__copy {
  margin: 0.95rem 0 0;
  color: var(--velvet-muted);
  font-size: 0.97rem;
  line-height: 1.8;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.7;
}

.lumio-template__project-shell {
  margin-top: 1rem;
  padding: 1.15rem;
  border-radius: 1.9rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 82%, rgba(0, 0, 0, 0.24));
}

.lumio-template__project-header {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__project-count,
.lumio-template__footnote {
  color: var(--velvet-subtle);
  font-size: 0.9rem;
  line-height: 1.6;
}

.lumio-template__project-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.lumio-template__project-title,
.lumio-template__project-card-title {
  margin: 0.85rem 0 0;
  font-size: 1.35rem;
  line-height: 1.18;
}

.lumio-template__project-card-title {
  font-size: 1.05rem;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1rem;
  padding: 0.9rem 1.05rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

.lumio-template--mode-light .lumio-template__slug,
.lumio-template--mode-light .lumio-template__headline,
.lumio-template--mode-light .lumio-template__meta-pill,
.lumio-template--mode-light .lumio-template__skill,
.lumio-template--mode-light .lumio-template__pill,
.lumio-template--mode-light .lumio-template__stat-label,
.lumio-template--mode-light .lumio-template__stat-value,
.lumio-template--mode-light .lumio-template__contact-label,
.lumio-template--mode-light .lumio-template__contact-value,
.lumio-template--mode-light .lumio-template__contact-icon,
.lumio-template--mode-light .lumio-template__name,
.lumio-template--mode-light .lumio-template__action {
  color: #0f172a;
}

.lumio-template--mode-light .lumio-template__pill,
.lumio-template--mode-light .lumio-template__meta-pill,
.lumio-template--mode-light .lumio-template__skill,
.lumio-template--mode-light .lumio-template__action,
.lumio-template--mode-light .lumio-template__contact-icon,
.lumio-template--mode-light .lumio-template__stat-card,
.lumio-template--mode-light .lumio-template__contact-card {
  border-color: rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.74);
}

.lumio-template--mode-light .lumio-template__section-kicker--light {
  color: rgba(15, 23, 42, 0.62);
}

@media (min-width: 48rem) {
  .lumio-template__hero,
  .lumio-template__body {
    padding: 1.4rem;
  }

  .lumio-template__hero-grid,
  .lumio-template__intro-grid,
  .lumio-template__footer-grid,
  .lumio-template__project-grid {
    gap: 1.15rem;
  }

  .lumio-template__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .lumio-template__hero-grid {
    grid-template-columns: minmax(0, 1.15fr) 21.5rem;
    align-items: end;
    gap: 1.5rem;
  }

  .lumio-template__stats {
    grid-template-columns: 1fr;
  }

  .lumio-template__intro-grid,
  .lumio-template__footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lumio-template__project-grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    align-items: start;
  }
}
</style>