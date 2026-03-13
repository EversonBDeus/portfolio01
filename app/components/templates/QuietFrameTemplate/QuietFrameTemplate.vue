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
  themeName: 'Quiet Frame',
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
const remainingProjects = computed(() => featuredProjects.value.slice(1, 4))
const featuredCount = computed(() => props.portfolio.projects.filter((project) => project.featured).length)

const stats = computed(() => {
  return [
    {
      label: 'Projetos',
      value: String(props.portfolio.projects.length),
      icon: 'i-lucide-folder-kanban'
    },
    {
      label: 'Destaques',
      value: String(featuredCount.value),
      icon: 'i-lucide-sparkles'
    },
    {
      label: 'Skills',
      value: String(skills.value.length),
      icon: 'i-lucide-layers-3'
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

const whatsappItem = computed(() => {
  return contactItems.value.find((item) => item.key === 'whatsapp') ?? null
})
</script>

<template>
  <article
    class="lumio-template lumio-template--quiet-frame"
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
            <span class="lumio-template__eyebrow">
              {{ templateName }}
            </span>

            <span
              class="lumio-template__status"
              :class="isPublished ? 'lumio-template__status--success' : 'lumio-template__status--warning'"
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
          class="lumio-template__hero-side"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Resumo
          </p>

          <p class="lumio-template__copy">
            {{ summary }}
          </p>

          <div class="lumio-template__stats">
            <article
              v-for="stat in stats"
              :key="stat.label"
              class="lumio-template__stat-card"
            >
              <div class="lumio-template__stat-head">
                <UIcon :name="stat.icon" class="lumio-template__stat-icon" />
                <span>{{ stat.label }}</span>
              </div>

              <strong class="lumio-template__stat-value">
                {{ stat.value }}
              </strong>
            </article>
          </div>

          <a
            v-if="whatsappItem"
            :href="whatsappItem.href"
            :target="whatsappItem.external ? '_blank' : undefined"
            :rel="whatsappItem.external ? 'noreferrer noopener' : undefined"
            class="lumio-template__cta"
          >
            <UIcon :name="whatsappItem.icon" />
            Entrar em contato
          </a>
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
            Direção
          </p>

          <h2 class="lumio-template__section-title">
            Minimalismo premium, mais contido e mais editorial.
          </h2>

          <p class="lumio-template__copy">
            Quiet Frame prioriza respiro, contraste sutil e leitura rápida sem abrir mão
            do aspecto vendável necessário para a página pública do Lumio.
          </p>
        </article>

        <article
          class="lumio-template__card"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Escopo atual
          </p>

          <p class="lumio-template__copy">
            O template respeita o contrato atual de hero, about, projects e contact,
            sem introduzir avatar, CV, certificados ou experiências cronológicas.
          </p>
        </article>
      </section>

      <section
        class="lumio-template__grid lumio-template__grid--projects"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <article class="lumio-template__card lumio-template__card--feature">
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
        </article>

        <div
          v-if="remainingProjects.length"
          class="lumio-template__stack"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <article
            v-for="project in remainingProjects"
            :key="project.id"
            class="lumio-template__card"
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

      <section
        class="lumio-template__card lumio-template__card--contacts"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__contacts-head">
          <div>
            <p class="lumio-template__section-kicker">
              Contato
            </p>

            <h2 class="lumio-template__section-title">
              Canais públicos em uma malha calma e pronta para integrar.
            </h2>
          </div>
        </div>

        <div
          v-if="contactItems.length"
          class="lumio-template__contact-grid"
        >
          <a
            v-for="item in contactItems"
            :key="item.key"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="lumio-template__contact-item"
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

.lumio-template--quiet-frame {
  --quiet-shell-bg: #ffffff;
  --quiet-surface: rgba(15, 23, 42, 0.03);
  --quiet-surface-strong: rgba(15, 23, 42, 0.06);
  --quiet-border: rgba(15, 23, 42, 0.08);
  --quiet-text: #0f172a;
  --quiet-muted: rgba(15, 23, 42, 0.68);
  --quiet-subtle: rgba(15, 23, 42, 0.5);
  color: var(--quiet-text);
  border: 1px solid color-mix(in srgb, var(--template-border) 68%, rgba(15, 23, 42, 0.08));
  border-radius: 2rem;
  overflow: hidden;
  background: var(--quiet-shell-bg);
  box-shadow: 0 26px 90px -50px rgba(15, 23, 42, 0.18);
}

.lumio-template--quiet-frame.lumio-template--mode-dark {
  --quiet-shell-bg: #09111b;
  --quiet-surface: rgba(255, 255, 255, 0.04);
  --quiet-surface-strong: rgba(255, 255, 255, 0.07);
  --quiet-border: rgba(255, 255, 255, 0.1);
  --quiet-text: var(--template-text);
  --quiet-muted: rgba(255, 255, 255, 0.72);
  --quiet-subtle: rgba(255, 255, 255, 0.52);
  box-shadow: 0 26px 90px -50px rgba(15, 23, 42, 0.4);
}

.lumio-template__hero,
.lumio-template__body {
  padding: 1.35rem;
}

.lumio-template__hero {
  border-bottom: 1px solid var(--quiet-border);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 12%, transparent), transparent 52%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.66), transparent);
}

.lumio-template--mode-dark .lumio-template__hero {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 18%, transparent), transparent 52%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent);
}

.lumio-template__hero-grid,
.lumio-template__grid,
.lumio-template__contact-grid,
.lumio-template__stats,
.lumio-template__stack {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-main,
.lumio-template__hero-side,
.lumio-template__card,
.lumio-template__contact-item {
  min-width: 0;
}

.lumio-template__header-row,
.lumio-template__meta,
.lumio-template__project-tags,
.lumio-template__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__eyebrow,
.lumio-template__status,
.lumio-template__tag,
.lumio-template__meta-pill,
.lumio-template__skill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 0.88rem;
  border-radius: 999px;
  border: 1px solid var(--quiet-border);
  background: var(--quiet-surface);
  font-size: 0.8rem;
  font-weight: 600;
}

.lumio-template__status--success,
.lumio-template__tag--highlight {
  color: color-mix(in srgb, var(--template-color-primary) 70%, var(--quiet-text));
  border-color: color-mix(in srgb, var(--template-color-primary) 38%, transparent);
  background: color-mix(in srgb, var(--template-color-primary) 12%, transparent);
}

.lumio-template__status--warning {
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.18);
}

.lumio-template__slug,
.lumio-template__section-kicker {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template__slug {
  margin-top: 1rem;
  color: var(--quiet-subtle);
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
  color: var(--quiet-muted);
  font-size: 0.98rem;
  line-height: 1.8;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.72;
}

.lumio-template__hero-side {
  padding-top: 0.25rem;
}

.lumio-template__stats {
  margin-top: 0.5rem;
}

.lumio-template__stat-card,
.lumio-template__card,
.lumio-template__contact-item {
  padding: 1rem;
  border-radius: 1.6rem;
  border: 1px solid var(--quiet-border);
  background: var(--quiet-surface);
}

.lumio-template__stat-head {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--quiet-muted);
  font-size: 0.88rem;
  font-weight: 600;
}

.lumio-template__stat-icon {
  color: var(--template-color-primary);
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.6rem;
  font-size: 1.35rem;
  line-height: 1;
}

.lumio-template__cta,
.lumio-template__link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.35rem;
  padding: 0.92rem 1.05rem;
  border-radius: 999px;
  background: var(--template-color-primary);
  color: #07111b;
  text-decoration: none;
  font-weight: 700;
  transition: transform 180ms ease, filter 180ms ease;
}

.lumio-template__link {
  margin-top: 1rem;
}

.lumio-template__cta:hover,
.lumio-template__link:hover,
.lumio-template__contact-item:hover {
  transform: translateY(-2px);
}

.lumio-template__grid--projects {
  margin-top: 1rem;
}

.lumio-template__card--feature,
.lumio-template__card--contacts {
  background: var(--quiet-surface-strong);
}

.lumio-template__section-title {
  margin: 0.6rem 0 0;
  font-size: clamp(1.45rem, 2.8vw, 2.3rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.lumio-template__project-title {
  margin: 0.85rem 0 0;
  font-size: 1.08rem;
  line-height: 1.2;
}

.lumio-template__contact-grid {
  margin-top: 1rem;
}

.lumio-template__contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  text-decoration: none;
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--template-color-primary) 14%, transparent);
  color: var(--template-color-primary);
  flex-shrink: 0;
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

.lumio-template__contact-label {
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--quiet-subtle);
}

.lumio-template__contact-value {
  color: var(--quiet-text);
  font-size: 0.94rem;
  line-height: 1.6;
  word-break: break-word;
}

@media (min-width: 48rem) {
  .lumio-template__stats,
  .lumio-template__contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .lumio-template__hero-grid {
    grid-template-columns: minmax(0, 1.08fr) 20rem;
    gap: 1.35rem;
  }

  .lumio-template__grid--intro {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lumio-template__grid--projects {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .lumio-template__stats {
    grid-template-columns: 1fr;
  }
}
</style>