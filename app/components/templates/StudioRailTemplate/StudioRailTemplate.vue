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
  themeName: 'Studio Rail',
  templatePresetId: null,
  templateMode: 'dark'
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
const railProjects = computed(() => featuredProjects.value.slice(1, 5))
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
</script>

<template>
  <article
    class="lumio-template lumio-template--studio-rail"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <div class="lumio-template__layout">
      <aside
        class="lumio-template__rail"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__rail-top">
          <div class="lumio-template__pill-row">
            <span class="lumio-template__pill lumio-template__pill--primary">
              {{ templateName }}
            </span>

            <span
              class="lumio-template__pill"
              :class="isPublished ? 'lumio-template__pill--success' : 'lumio-template__pill--warning'"
            >
              {{ isPublished ? 'Publicado' : 'Rascunho' }}
            </span>
          </div>

          <p class="lumio-template__slug">
            /{{ portfolio.settings.publicSlug }}
          </p>

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
        </div>

        <div class="lumio-template__rail-block">
          <p class="lumio-template__section-kicker lumio-template__section-kicker--soft">
            Contato direto
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
            class="lumio-template__copy lumio-template__copy--compact"
          >
            Nenhum canal público foi informado ainda.
          </p>
        </div>
      </aside>

      <div class="lumio-template__content">
        <section
          class="lumio-template__hero"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
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
        </section>

        <section class="lumio-template__grid lumio-template__grid--intro">
          <article
            class="lumio-template__card"
            v-reveal="{ distance: '14px', duration: 500 }"
          >
            <p class="lumio-template__section-kicker">
              Sobre
            </p>

            <h2 class="lumio-template__section-title">
              Estrutura editorial com rail lateral forte e leitura premium.
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
              Escopo atual
            </p>

            <p class="lumio-template__copy">
              Studio Rail mantém hero, sobre, projetos e contato em composição mais curada,
              sem depender do cookie global nem do tema principal do Lumio.
            </p>
          </article>
        </section>

        <section
          class="lumio-template__feature"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="lumio-template__feature-head">
            <div>
              <p class="lumio-template__section-kicker">
                Projeto principal
              </p>

              <h2 class="lumio-template__section-title">
                Bloco central da vitrine pública
              </h2>
            </div>
          </div>

          <article
            v-if="leadProject"
            class="lumio-template__lead-project"
          >
            <div class="lumio-template__tag-row">
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
              <UIcon name="i-lucide-arrow-up-right" />
              Abrir projeto
            </a>
          </article>
        </section>

        <section
          v-if="railProjects.length"
          class="lumio-template__project-list"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <article
            v-for="project in railProjects"
            :key="project.id"
            class="lumio-template__project-card"
          >
            <div class="lumio-template__tag-row">
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

            <h3 class="lumio-template__project-card-title">
              {{ project.title }}
            </h3>

            <p class="lumio-template__copy lumio-template__copy--compact">
              {{ project.summary }}
            </p>
          </article>
        </section>

        <section
          class="lumio-template__card"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Todos os canais
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
        </section>
      </div>
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

.lumio-template--studio-rail {
  --studio-shell: #07111b;
  --studio-rail: rgba(255, 255, 255, 0.04);
  --studio-panel: rgba(255, 255, 255, 0.05);
  --studio-panel-strong: rgba(255, 255, 255, 0.08);
  --studio-border: rgba(255, 255, 255, 0.1);
  --studio-copy: rgba(255, 255, 255, 0.74);
  --studio-copy-soft: rgba(255, 255, 255, 0.52);
  border: 1px solid var(--studio-border);
  border-radius: 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.1), transparent 28%),
    var(--studio-shell);
  box-shadow: 0 28px 90px -48px rgba(15, 23, 42, 0.44);
}

.lumio-template--studio-rail.lumio-template--mode-light {
  --studio-shell: #ffffff;
  --studio-rail: rgba(15, 23, 42, 0.03);
  --studio-panel: rgba(15, 23, 42, 0.04);
  --studio-panel-strong: rgba(15, 23, 42, 0.06);
  --studio-border: rgba(15, 23, 42, 0.08);
  --studio-copy: rgba(15, 23, 42, 0.72);
  --studio-copy-soft: rgba(15, 23, 42, 0.5);
  box-shadow: 0 28px 90px -48px rgba(15, 23, 42, 0.16);
}

.lumio-template__layout {
  display: grid;
}

.lumio-template__rail {
  display: grid;
  gap: 1rem;
  padding: 1.15rem;
  border-bottom: 1px solid var(--studio-border);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent),
    var(--studio-rail);
}

.lumio-template__rail-top,
.lumio-template__rail-block,
.lumio-template__content,
.lumio-template__grid,
.lumio-template__project-list,
.lumio-template__contact-grid,
.lumio-template__contact-stack {
  display: grid;
  gap: 1rem;
}

.lumio-template__content {
  padding: 1.15rem;
}

.lumio-template__pill-row,
.lumio-template__meta,
.lumio-template__skills,
.lumio-template__tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.lumio-template__pill,
.lumio-template__meta-pill,
.lumio-template__skill,
.lumio-template__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.62rem 0.86rem;
  border-radius: 999px;
  border: 1px solid var(--studio-border);
  background: var(--studio-panel);
  font-size: 0.8rem;
  font-weight: 600;
}

.lumio-template__pill--primary,
.lumio-template__tag--highlight {
  color: color-mix(in srgb, var(--template-color-primary) 76%, var(--template-text));
  border-color: color-mix(in srgb, var(--template-color-primary) 34%, transparent);
  background: color-mix(in srgb, var(--template-color-primary) 12%, transparent);
}

.lumio-template__pill--success {
  color: #dcfce7;
  background: rgba(34, 197, 94, 0.16);
  border-color: rgba(34, 197, 94, 0.22);
}

.lumio-template__pill--warning {
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.18);
  border-color: rgba(245, 158, 11, 0.24);
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
  color: var(--studio-copy-soft);
}

.lumio-template__section-kicker {
  color: var(--template-color-tertiary);
}

.lumio-template__section-kicker--soft {
  color: var(--studio-copy-soft);
}

.lumio-template__name {
  margin: 0;
  font-size: clamp(2.15rem, 5vw, 4.25rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.lumio-template__headline,
.lumio-template__copy {
  margin: 0.95rem 0 0;
  color: var(--studio-copy);
  font-size: 0.97rem;
  line-height: 1.8;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.68;
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
  border-bottom: 1px solid var(--studio-border);
}

.lumio-template__stat-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.lumio-template__stat-value {
  font-size: 1.12rem;
}

.lumio-template__hero,
.lumio-template__card,
.lumio-template__feature,
.lumio-template__lead-project,
.lumio-template__project-card,
.lumio-template__contact-item {
  min-width: 0;
  padding: 1.05rem;
  border-radius: 1.6rem;
  border: 1px solid var(--studio-border);
  background: var(--studio-panel);
}

.lumio-template__feature {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-secondary) 8%, transparent), transparent),
    var(--studio-panel-strong);
}

.lumio-template__feature-head {
  display: grid;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.lumio-template__section-title {
  margin: 0.55rem 0 0;
  font-size: clamp(1.45rem, 3vw, 2.2rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.lumio-template__project-title,
.lumio-template__project-card-title {
  margin: 0.85rem 0 0;
  font-size: 1.2rem;
  line-height: 1.18;
}

.lumio-template__project-card-title {
  font-size: 1rem;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1rem;
  padding: 0.88rem 1rem;
  border-radius: 999px;
  background: var(--template-color-primary);
  color: #07111b;
  text-decoration: none;
  font-weight: 700;
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
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--template-color-primary) 14%, transparent);
  color: var(--template-color-primary);
  flex-shrink: 0;
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}

.lumio-template__contact-label {
  color: var(--studio-copy-soft);
}

.lumio-template__contact-value {
  color: var(--template-text);
  font-size: 0.94rem;
  line-height: 1.6;
  word-break: break-word;
}

@media (min-width: 48rem) {
  .lumio-template__contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 72rem) {
  .lumio-template__layout {
    grid-template-columns: 21rem minmax(0, 1fr);
  }

  .lumio-template__rail {
    border-right: 1px solid var(--studio-border);
    border-bottom: none;
    min-height: 100%;
  }

  .lumio-template__grid--intro {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>