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
  themeName: 'Obsidian Prime',
  templatePresetId: null,
  templateMode: 'dark'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Presença digital premium com composição sólida, contraste alto e leitura refinada.'
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
const featuredCount = computed(() => props.portfolio.projects.filter((project) => project.featured).length)

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
    class="lumio-template lumio-template--obsidian-prime"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero-shell">
      <div
        class="lumio-template__hero-panel"
        v-reveal="{ distance: '18px', duration: 520 }"
      >
        <div class="lumio-template__hero-copy">
          <span class="lumio-template__eyebrow" aria-hidden="true" />

          <h1 class="lumio-template__name">
            {{ publicName }}
          </h1>

          <p
            v-if="roleTitle"
            class="lumio-template__role"
          >
            {{ roleTitle }}
          </p>

          <p class="lumio-template__headline">
            {{ headline }}
          </p>

          <div class="lumio-template__meta-row">
            <UBadge
              v-if="location"
              class="lumio-template__badge lumio-template__badge--soft"
            >
              {{ location }}
            </UBadge>

            <UBadge
              v-if="featuredCount > 0"
              class="lumio-template__badge lumio-template__badge--soft"
            >
              {{ featuredCount }} destaque<span v-if="featuredCount > 1">s</span>
            </UBadge>
          </div>
        </div>

        <div class="lumio-template__hero-summary">
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <p class="lumio-template__copy">
            {{ summary }}
          </p>
        </div>
      </div>

      <div
        class="lumio-template__metrics-strip"
        v-reveal="{ delay: 70, distance: '18px', duration: 520 }"
      >
        <article
          v-for="stat in stats"
          :key="stat.label"
          class="lumio-template__metric-card"
        >
          <p class="lumio-template__stat-label">{{ stat.label }}</p>
          <strong class="lumio-template__stat-value">{{ stat.value }}</strong>
        </article>
      </div>
    </section>

    <div class="lumio-template__body">
      <section
        class="lumio-template__feature-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__feature-head">
          <div>
            <p class="lumio-template__section-kicker">
              Projeto em evidência
            </p>

            <h2 class="lumio-template__section-title">
              {{ leadProject ? leadProject.title : 'Projetos em destaque' }}
            </h2>
          </div>

          <div
            v-if="leadProject"
            class="lumio-template__feature-badges"
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

        <div
          v-if="leadProject"
          class="lumio-template__feature-grid"
        >
          <article class="lumio-template__lead-card">
            <div class="lumio-template__lead-stage">
              <div class="lumio-template__stage-frame lumio-template__stage-frame--main">
                <div class="lumio-template__stage-line lumio-template__stage-line--title" />
                <div class="lumio-template__stage-line lumio-template__stage-line--media" />
                <div class="lumio-template__stage-line lumio-template__stage-line--copy" />
                <div class="lumio-template__stage-line lumio-template__stage-line--copy short" />
              </div>
            </div>

            <div class="lumio-template__lead-copy">
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
            </div>
          </article>

          <div
            v-if="secondaryProjects.length"
            class="lumio-template__vault-list"
          >
            <article
              v-for="project in secondaryProjects"
              :key="project.id"
              class="lumio-template__vault-card"
            >
              <div class="lumio-template__vault-top">
                <UBadge class="lumio-template__badge lumio-template__badge--outline">
                  {{ project.category || 'Projeto selecionado' }}
                </UBadge>

                <UBadge
                  v-if="project.featured"
                  class="lumio-template__badge lumio-template__badge--highlight"
                >
                  Destaque
                </UBadge>
              </div>

              <div class="lumio-template__stage-frame">
                <div class="lumio-template__stage-line lumio-template__stage-line--media" />
              </div>

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
          class="lumio-template__empty-shell"
        >
          <div class="lumio-template__empty-gallery">
            <div class="lumio-template__stage-frame lumio-template__stage-frame--main">
              <div class="lumio-template__stage-line lumio-template__stage-line--title" />
              <div class="lumio-template__stage-line lumio-template__stage-line--media" />
              <div class="lumio-template__stage-line lumio-template__stage-line--copy" />
            </div>

            <div class="lumio-template__stage-frame">
              <div class="lumio-template__stage-line lumio-template__stage-line--media" />
            </div>

            <div class="lumio-template__stage-frame">
              <div class="lumio-template__stage-line lumio-template__stage-line--media" />
            </div>
          </div>

          <p class="lumio-template__copy">
            Nenhum projeto público disponível no momento.
          </p>
        </div>
      </section>

      <div class="lumio-template__lower-grid">
        <section
          class="lumio-template__panel"
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

          <ul
            v-if="skills.length"
            class="lumio-template__skill-grid"
            aria-label="Skills principais"
          >
            <li
              v-for="skill in skills"
              :key="skill"
              class="lumio-template__skill-chip"
            >
              {{ skill }}
            </li>
          </ul>
        </section>

        <section
          class="lumio-template__panel"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
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
            v-if="secondaryContacts.length"
            class="lumio-template__contact-tags"
          >
            <UBadge
              v-for="item in secondaryContacts"
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
        </section>
      </div>
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

.lumio-template--obsidian-prime {
  position: relative;
  border: 1px solid color-mix(in srgb, var(--template-border) 92%, transparent);
  border-radius: 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 12%, transparent), transparent 26%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 10%, transparent), transparent 24%),
    linear-gradient(180deg, #070b12 0%, #0a1018 100%);
  box-shadow:
    0 40px 120px -62px rgba(2, 6, 23, 0.7),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.lumio-template--mode-light {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 9%, transparent), transparent 26%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 8%, transparent), transparent 24%),
    linear-gradient(180deg, #f5f4f8 0%, #fbfbfe 100%);
  box-shadow:
    0 32px 96px -62px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.36);
}

.lumio-template__hero-shell {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--template-border) 82%, transparent);
}

.lumio-template__hero-panel,
.lumio-template__metric-card,
.lumio-template__feature-shell,
.lumio-template__lead-card,
.lumio-template__vault-card,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__empty-shell,
.lumio-template__stage-frame {
  min-width: 0;
}

.lumio-template__hero-panel {
  display: grid;
  gap: 1rem;
  padding: 1.15rem;
  border-radius: 1.75rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent 50%),
    color-mix(in srgb, var(--template-surface-elevated) 84%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 26px 58px -46px rgba(2, 6, 23, 0.42);
}

.lumio-template--mode-light .lumio-template__hero-panel {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 6%, transparent), transparent 50%),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    0 18px 44px -42px rgba(15, 23, 42, 0.12);
}

.lumio-template__hero-copy {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-summary {
  display: grid;
  gap: 0.65rem;
  padding: 1rem;
  border-radius: 1.35rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 82%, transparent);
  background: color-mix(in srgb, var(--template-surface) 76%, transparent);
}

.lumio-template--mode-light .lumio-template__hero-summary {
  background: color-mix(in srgb, var(--template-surface) 88%, #ffffff);
}

.lumio-template__eyebrow {
  display: block;
  width: 3rem;
  height: 1px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
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
  font-size: clamp(2.8rem, 6.4vw, 5.4rem);
  line-height: 0.92;
  letter-spacing: -0.06em;
  color: var(--template-hero-text);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
}

.lumio-template--mode-light .lumio-template__name,
.lumio-template--mode-light .lumio-template__section-title,
.lumio-template--mode-light .lumio-template__project-title,
.lumio-template--mode-light .lumio-template__project-card-title {
  color: color-mix(in srgb, var(--template-color-secondary) 28%, #111827);
  text-shadow: none;
}

.lumio-template__role {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.2;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--template-color-tertiary) 78%, #f8fafc);
}

.lumio-template--mode-light .lumio-template__role {
  color: color-mix(in srgb, var(--template-color-secondary) 38%, #475569);
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
  color: color-mix(in srgb, var(--template-text) 84%, #475569);
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
.lumio-template__feature-badges,
.lumio-template__contact-tags {
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
  background: color-mix(in srgb, var(--template-color-primary) 12%, var(--template-surface-elevated));
}

.lumio-template__badge--outline {
  color: var(--template-text-muted);
  background: color-mix(in srgb, var(--template-surface) 78%, transparent);
}

.lumio-template__badge--highlight {
  color: var(--template-hero-text);
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__metrics-strip {
  display: grid;
  gap: 1rem;
}

.lumio-template__metric-card {
  padding: 1rem;
  border-radius: 1.45rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 84%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 20px 44px -40px rgba(2, 6, 23, 0.36);
}

.lumio-template--mode-light .lumio-template__metric-card {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 2%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.32),
    0 16px 36px -38px rgba(15, 23, 42, 0.1);
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
  font-size: 1.45rem;
  line-height: 1;
  color: var(--template-hero-text);
}

.lumio-template--mode-light .lumio-template__stat-value {
  color: color-mix(in srgb, var(--template-color-secondary) 30%, #111827);
}

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__feature-shell,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__empty-shell {
  border-radius: 1.65rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 84%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 24px 52px -44px rgba(2, 6, 23, 0.38);
}

.lumio-template--mode-light .lumio-template__feature-shell,
.lumio-template--mode-light .lumio-template__panel,
.lumio-template--mode-light .lumio-template__contact-card,
.lumio-template--mode-light .lumio-template__empty-shell {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 2%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.32),
    0 18px 44px -42px rgba(15, 23, 42, 0.1);
}

.lumio-template__feature-shell,
.lumio-template__panel,
.lumio-template__empty-shell {
  padding: 1.05rem;
}

.lumio-template__feature-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lumio-template__section-title {
  margin-top: 0.45rem;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.06;
  letter-spacing: -0.045em;
}

.lumio-template__section-title--compact {
  font-size: clamp(1.12rem, 2vw, 1.48rem);
}

.lumio-template__feature-grid,
.lumio-template__lower-grid,
.lumio-template__contact-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__lead-card {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lumio-template__lead-stage {
  display: grid;
}

.lumio-template__stage-frame {
  padding: 0.8rem;
  border-radius: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 76%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 16px 32px -28px rgba(2, 6, 23, 0.32);
}

.lumio-template--mode-light .lumio-template__stage-frame {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 2%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.32),
    0 12px 28px -26px rgba(15, 23, 42, 0.1);
}

.lumio-template__stage-frame--main {
  min-height: 13rem;
}

.lumio-template__stage-line {
  border-radius: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 84%, rgba(255, 255, 255, 0.02));
}

.lumio-template__stage-line--title {
  height: 1rem;
  width: 44%;
  margin-bottom: 0.8rem;
}

.lumio-template__stage-line--media {
  height: 7.8rem;
  margin-bottom: 0.8rem;
}

.lumio-template__stage-line--copy {
  height: 0.9rem;
  width: 82%;
}

.lumio-template__stage-line--copy.short {
  width: 58%;
  margin-top: 0.6rem;
}

.lumio-template__lead-copy {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__project-title,
.lumio-template__project-card-title {
  font-size: 1.2rem;
  line-height: 1.16;
}

.lumio-template__project-card-title {
  font-size: 1rem;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.86rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: var(--template-hero-text);
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 18px 34px -24px color-mix(in srgb, var(--template-color-primary) 54%, transparent);
}

.lumio-template__vault-list {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lumio-template__vault-card {
  display: grid;
  gap: 0.8rem;
  padding: 0.95rem;
  border-radius: 1.45rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-secondary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 78%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 18px 40px -36px rgba(2, 6, 23, 0.34);
}

.lumio-template--mode-light .lumio-template__vault-card {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-secondary) 2%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.32),
    0 14px 34px -34px rgba(15, 23, 42, 0.1);
}

.lumio-template__vault-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.65rem;
}

.lumio-template__empty-shell {
  display: grid;
  gap: 1rem;
}

.lumio-template__empty-gallery {
  display: grid;
  gap: 1rem;
}

.lumio-template__lower-grid {
  align-items: start;
}

.lumio-template__panel {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lumio-template__skill-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.15rem;
  padding: 0.48rem 0.78rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  background: color-mix(in srgb, var(--template-surface) 72%, transparent);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--template-text);
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.82rem;
  padding: 0.95rem;
  text-decoration: none;
  color: inherit;
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 1rem;
  flex-shrink: 0;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 14%, transparent), color-mix(in srgb, var(--template-color-secondary) 10%, transparent)),
    color-mix(in srgb, var(--template-surface-elevated) 82%, rgba(255, 255, 255, 0.03));
  color: var(--template-hero-text);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--template-color-primary) 18%, transparent);
}

.lumio-template--mode-light .lumio-template__contact-icon {
  color: color-mix(in srgb, var(--template-color-secondary) 30%, #111827);
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

@media (hover: hover) {
  .lumio-template__action:hover,
  .lumio-template__contact-card:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 767px) {
  .lumio-template__hero-shell,
  .lumio-template__body {
    padding: 0.82rem;
  }

  .lumio-template__hero-panel,
  .lumio-template__feature-shell,
  .lumio-template__panel,
  .lumio-template__empty-shell {
    padding: 0.95rem;
  }

  .lumio-template__name {
    font-size: clamp(2.2rem, 12vw, 3.6rem);
  }

  .lumio-template__headline {
    max-width: none;
  }

  .lumio-template__feature-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .lumio-template__stage-frame--main {
    min-height: 10.4rem;
  }
}

@media (min-width: 900px) {
  .lumio-template__hero-panel {
    grid-template-columns: minmax(0, 1.14fr) minmax(280px, 0.86fr);
    align-items: stretch;
  }

  .lumio-template__metrics-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__feature-grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  }

  .lumio-template__empty-gallery {
    grid-template-columns: 1.08fr 0.96fr 0.96fr;
  }

  .lumio-template__lower-grid {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>