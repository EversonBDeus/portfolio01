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
  themeName: 'Still Form',
  templatePresetId: null,
  templateMode: 'light'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const templateName = computed(() => props.themeName.trim())
const isPublished = computed(() => props.portfolio.settings.publicationStatus === 'published')
const summary = computed(() => {
  return props.portfolio.about.summary.trim() || 'O resumo profissional ainda não foi preenchido.'
})

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
const otherProjects = computed(() => featuredProjects.value.slice(1, 5))
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
      key: 'whatsapp',
      label: 'WhatsApp',
      value: props.portfolio.contact.whatsapp.trim(),
      href: normalizeWhatsapp(props.portfolio.contact.whatsapp),
      icon: 'i-lucide-message-circle',
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

const whatsappItem = computed(() => {
  return contactItems.value.find((item) => item.key === 'whatsapp') ?? null
})
</script>

<template>
  <article
    class="lumio-template lumio-template--still-form"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero">
      <div class="lumio-template__hero-grid">
        <div
          class="lumio-template__hero-main"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="lumio-template__header-row">
            <span class="lumio-template__mark">
              {{ templateName }}
            </span>

            <span
              class="lumio-template__mark lumio-template__mark--status"
              :class="isPublished ? 'lumio-template__mark--success' : 'lumio-template__mark--warning'"
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
              <UIcon name="i-lucide-briefcase-business" />
              {{ portfolio.hero.roleTitle }}
            </span>

            <span
              v-if="portfolio.hero.location"
              class="lumio-template__meta-pill"
            >
              <UIcon name="i-lucide-map-pin" />
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
          class="lumio-template__aside"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <div class="lumio-template__stat-list">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="lumio-template__stat-row"
            >
              <span class="lumio-template__stat-label">{{ stat.label }}</span>
              <strong class="lumio-template__stat-value">{{ stat.value }}</strong>
            </div>
          </div>

          <a
            v-if="whatsappItem"
            :href="whatsappItem.href"
            :target="whatsappItem.external ? '_blank' : undefined"
            :rel="whatsappItem.external ? 'noreferrer noopener' : undefined"
            class="lumio-template__cta"
          >
            <UIcon :name="whatsappItem.icon" />
            WhatsApp
          </a>
        </aside>
      </div>
    </section>

    <div class="lumio-template__body">
      <section class="lumio-template__section">
        <div
          class="lumio-template__section-copy"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <h2 class="lumio-template__section-title">
            Um template mais calmo, limpo e preciso.
          </h2>

          <p class="lumio-template__copy">
            {{ summary }}
          </p>
        </div>

        <aside
          class="lumio-template__note"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Escopo atual
          </p>

          <p class="lumio-template__copy lumio-template__copy--compact">
            Hero, sobre, projetos e contato em uma composição editorial com linhas finas
            e sem dependência do tema global do app.
          </p>
        </aside>
      </section>

      <section class="lumio-template__section lumio-template__section--projects">
        <div
          class="lumio-template__section-copy"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Projeto principal
          </p>

          <template v-if="leadProject">
            <h2 class="lumio-template__section-title">
              {{ leadProject.title }}
            </h2>

            <div class="lumio-template__project-tags">
              <span class="lumio-template__tag">
                {{ leadProject.category }}
              </span>

              <span
                v-if="leadProject.featured"
                class="lumio-template__tag lumio-template__tag--highlight"
              >
                Destaque
              </span>
            </div>

            <p class="lumio-template__copy">
              {{ leadProject.summary }}
            </p>

            <a
              v-if="leadProject.link"
              :href="leadProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="lumio-template__link"
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
        </div>

        <div
          v-if="otherProjects.length"
          class="lumio-template__project-list"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <article
            v-for="project in otherProjects"
            :key="project.id"
            class="lumio-template__project-row"
          >
            <div class="lumio-template__project-tags">
              <span class="lumio-template__tag">
                {{ project.category }}
              </span>

              <span
                v-if="project.featured"
                class="lumio-template__tag lumio-template__tag--highlight"
              >
                Destaque
              </span>
            </div>

            <h3 class="lumio-template__project-title">
              {{ project.title }}
            </h3>

            <p class="lumio-template__copy lumio-template__copy--compact">
              {{ project.summary }}
            </p>
          </article>
        </div>
      </section>

      <section class="lumio-template__section">
        <div
          class="lumio-template__section-copy"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Contato
          </p>

          <h2 class="lumio-template__section-title">
            Canais públicos em uma estrutura silenciosa.
          </h2>
        </div>

        <div
          v-if="contactItems.length"
          class="lumio-template__contact-grid"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <a
            v-for="item in contactItems"
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
          class="lumio-template__copy"
        >
          Nenhum canal público foi informado ainda.
        </p>
      </section>
    </div>
  </article>
</template>

<style scoped>
.lumio-template {
  font-family: var(--template-font-body);
}

.lumio-template :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
}

.lumio-template--still-form {
  --still-shell-bg: #fafafa;
  --still-line: rgba(15, 23, 42, 0.1);
  --still-text: #0f172a;
  --still-muted: rgba(15, 23, 42, 0.66);
  --still-subtle: rgba(15, 23, 42, 0.5);
  --still-surface: rgba(15, 23, 42, 0.02);
  color: var(--still-text);
  border: 1px solid color-mix(in srgb, var(--template-border) 66%, rgba(15, 23, 42, 0.08));
  border-radius: 2rem;
  overflow: hidden;
  background: var(--still-shell-bg);
  box-shadow: 0 24px 80px -44px rgba(15, 23, 42, 0.16);
}

.lumio-template--still-form.lumio-template--mode-dark {
  --still-shell-bg: #080f18;
  --still-line: rgba(255, 255, 255, 0.1);
  --still-text: var(--template-text);
  --still-muted: rgba(255, 255, 255, 0.7);
  --still-subtle: rgba(255, 255, 255, 0.5);
  --still-surface: rgba(255, 255, 255, 0.03);
  box-shadow: 0 24px 80px -44px rgba(15, 23, 42, 0.42);
}

.lumio-template__hero,
.lumio-template__body {
  padding: 1.35rem;
}

.lumio-template__hero {
  border-bottom: 1px solid var(--still-line);
}

.lumio-template__hero-grid,
.lumio-template__section,
.lumio-template__contact-grid,
.lumio-template__project-list {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-main,
.lumio-template__aside,
.lumio-template__section-copy,
.lumio-template__note,
.lumio-template__contact-card {
  min-width: 0;
}

.lumio-template__header-row,
.lumio-template__meta,
.lumio-template__skills,
.lumio-template__project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__mark,
.lumio-template__meta-pill,
.lumio-template__skill,
.lumio-template__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.62rem 0.86rem;
  border-radius: 999px;
  border: 1px solid var(--still-line);
  background: var(--still-surface);
  font-size: 0.8rem;
  font-weight: 600;
}

.lumio-template__mark--status {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.lumio-template__mark--success,
.lumio-template__tag--highlight {
  color: color-mix(in srgb, var(--template-color-primary) 74%, var(--still-text));
  border-color: color-mix(in srgb, var(--template-color-primary) 36%, transparent);
  background: color-mix(in srgb, var(--template-color-primary) 12%, transparent);
}

.lumio-template__mark--warning {
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.18);
}

.lumio-template__slug,
.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-label {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template__slug {
  margin-top: 1rem;
  color: var(--still-subtle);
}

.lumio-template__section-kicker {
  color: var(--template-color-secondary);
}

.lumio-template__name {
  margin: 0.85rem 0 0;
  font-size: clamp(2.15rem, 5vw, 4.5rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
}

.lumio-template__headline,
.lumio-template__copy {
  margin: 0.95rem 0 0;
  color: var(--still-muted);
  font-size: 0.97rem;
  line-height: 1.8;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.7;
}

.lumio-template__aside,
.lumio-template__note {
  padding-top: 0.2rem;
  border-top: 1px solid var(--still-line);
}

.lumio-template__stat-list {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--still-line);
}

.lumio-template__stat-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.lumio-template__stat-value {
  font-size: 1.15rem;
}

.lumio-template__cta,
.lumio-template__link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1rem;
  padding: 0.88rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--still-line);
  color: var(--still-text);
  text-decoration: none;
  font-weight: 700;
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.lumio-template__cta:hover,
.lumio-template__link:hover,
.lumio-template__contact-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--template-color-primary) 28%, var(--still-line));
  background: color-mix(in srgb, var(--template-color-primary) 8%, transparent);
}

.lumio-template__body {
  display: grid;
  gap: 0;
}

.lumio-template__section {
  padding: 1.35rem 0;
  border-bottom: 1px solid var(--still-line);
}

.lumio-template__section:last-child {
  border-bottom: none;
}

.lumio-template__section-title {
  margin: 0.6rem 0 0;
  font-size: clamp(1.4rem, 2.8vw, 2.2rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.lumio-template__project-title {
  margin: 0.8rem 0 0;
  font-size: 1.05rem;
  line-height: 1.24;
}

.lumio-template__project-row {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--still-line);
}

.lumio-template__project-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.lumio-template__contact-grid {
  margin-top: 0.35rem;
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem 0;
  border-top: 1px solid var(--still-line);
  text-decoration: none;
}

.lumio-template__contact-card:first-child {
  border-top: none;
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--template-color-primary) 12%, transparent);
  color: var(--template-color-primary);
  flex-shrink: 0;
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}

.lumio-template__contact-label {
  color: var(--still-subtle);
}

.lumio-template__contact-value {
  color: var(--still-text);
  font-size: 0.94rem;
  line-height: 1.6;
  word-break: break-word;
}

@media (min-width: 64rem) {
  .lumio-template__hero-grid,
  .lumio-template__section {
    grid-template-columns: minmax(0, 1.12fr) 19rem;
    gap: 1.35rem;
  }

  .lumio-template__aside,
  .lumio-template__note {
    border-top: none;
    border-left: 1px solid var(--still-line);
    padding-top: 0;
    padding-left: 1.35rem;
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem 1.2rem;
  }

  .lumio-template__contact-card {
    border-top: none;
    padding: 0;
  }

  .lumio-template__project-list {
    border-left: 1px solid var(--still-line);
    padding-left: 1.35rem;
  }
}
</style>  