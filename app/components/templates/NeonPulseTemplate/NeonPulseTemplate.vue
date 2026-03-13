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
  themeName: 'Neon Pulse',
  templatePresetId: null,
  templateMode: 'dark'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Direção mais tech, modular e contrastada para a vitrine pública.'
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
const supportingProjects = computed(() => featuredProjects.value.slice(1, 5))
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

const heroContacts = computed(() => contactItems.value.slice(0, 2))
</script>

<template>
  <article
    class="lumio-template lumio-template--neon-pulse"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <div class="lumio-template__shell">
      <section class="lumio-template__hero">
        <div class="lumio-template__hero-grid">
          <div
            class="lumio-template__hero-main"
            v-reveal="{ distance: '16px', duration: 500 }"
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
            v-reveal="{ delay: 70, distance: '16px', duration: 500 }"
          >
            <div class="lumio-template__rail-card">
              <div class="lumio-template__stats">
                <article
                  v-for="stat in stats"
                  :key="stat.label"
                  class="lumio-template__stat-card"
                >
                  <span class="lumio-template__stat-label">{{ stat.label }}</span>
                  <strong class="lumio-template__stat-value">{{ stat.value }}</strong>
                </article>
              </div>

              <div
                v-if="heroContacts.length"
                class="lumio-template__hero-contact-list"
              >
                <a
                  v-for="item in heroContacts"
                  :key="item.key"
                  :href="item.href"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noreferrer noopener' : undefined"
                  class="lumio-template__hero-contact"
                >
                  <span class="lumio-template__hero-contact-icon">
                    <UIcon :name="item.icon" />
                  </span>

                  <span class="lumio-template__hero-contact-label">
                    {{ item.value }}
                  </span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="lumio-template__content">
        <div class="lumio-template__intro-grid">
          <article
            class="lumio-template__panel"
            v-reveal="{ distance: '16px', duration: 500 }"
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
            class="lumio-template__panel"
            v-reveal="{ delay: 70, distance: '16px', duration: 500 }"
          >
            <p class="lumio-template__section-kicker">
              Projeto principal
            </p>

            <template v-if="leadProject">
              <h2 class="lumio-template__section-title lumio-template__section-title--compact">
                {{ leadProject.title }}
              </h2>

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
                Abrir projeto
              </a>
            </template>

            <p v-else class="lumio-template__copy">
              Nenhum projeto público disponível no momento.
            </p>
          </article>
        </div>

        <section
          class="lumio-template__project-section"
          v-reveal="{ distance: '16px', duration: 500 }"
        >
          <div class="lumio-template__section-head">
            <div>
              <p class="lumio-template__section-kicker">
                Módulos
              </p>

              <h2 class="lumio-template__section-title lumio-template__section-title--compact">
                Painéis menores e leitura mais equilibrada no fluxo real.
              </h2>
            </div>
          </div>

          <div
            v-if="supportingProjects.length"
            class="lumio-template__project-grid"
          >
            <article
              v-for="project in supportingProjects"
              :key="project.id"
              class="lumio-template__project-card"
            >
              <p class="lumio-template__project-category">
                {{ project.category || 'Projeto selecionado' }}
              </p>

              <h3 class="lumio-template__project-title">
                {{ project.title }}
              </h3>

              <p class="lumio-template__project-summary">
                {{ project.summary }}
              </p>
            </article>
          </div>
        </section>

        <section
          v-if="contactItems.length"
          class="lumio-template__panel"
          v-reveal="{ delay: 80, distance: '16px', duration: 500 }"
        >
          <div class="lumio-template__sectionio-template__section-head">
            <div>
              <p class="lumio-template__section-kicker">
                Todos os canais públicos
              </p>

              <h2 class="lumio-template__section-title lumio-template__section-title--compact">
                Contato completo sem sobrecarregar o hero.
              </h2>
            </div>
          </div>

          <div class="lumio-template__contact-grid">
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

              <span class="lumio-template__contact-content">
                <span class="lumio-template__contact-label">{{ item.label }}</span>
                <span class="lumio-template__contact-value">{{ item.value }}</span>
              </span>
            </a>
          </div>
        </section>
      </section>
    </div>
  </article>
</template>

<style scoped>
.lumio-template {
  color: var(--template-text);
  font-family: var(--template-font-body);
  background:
    radial-gradient(circle at top left, var(--template-color-primary) 0%, transparent 28%),
    radial-gradient(circle at top right, var(--template-color-secondary) 0%, transparent 24%),
    linear-gradient(180deg, rgba(3, 8, 18, 0.98) 0%, rgba(3, 8, 18, 0.94) 100%);
}

.lumio-template__shell {
  width: min(100%, 1380px);
  margin: 0 auto;
  padding: clamp(0.9rem, 2vw, 1.4rem);
}

.lumio-template__hero,
.lumio-template__panel,
.lumio-template__project-card {
  border: 1px solid var(--template-border);
  background: linear-gradient(180deg, rgba(7, 14, 28, 0.92) 0%, rgba(8, 14, 24, 0.82) 100%);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.lumio-template__hero,
.lumio-template__panel {
  border-radius: 30px;
}

.lumio-template__hero {
  padding: clamp(1.3rem, 3vw, 2.3rem);
}

.lumio-template__hero-grid,
.lumio-template__intro-grid,
.lumio-template__project-grid,
.lumio-template__contact-grid,
.lumio-template__stats {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-main {
  display: grid;
  gap: 0.95rem;
  min-width: 0;
}

.lumio-template__pill-row,
.lumio-template__meta,
.lumio-template__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-label,
.lumio-template__project-category {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-label {
  color: var(--template-text-muted);
}

.lumio-template__name,
.lumio-template__section-title,
.lumio-template__project-title {
  margin: 0;
  font-family: var(--template-font-heading);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__name {
  color: var(--template-hero-text);
  font-size: clamp(3rem, 6vw, 5.4rem);
  line-height: 0.94;
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__project-summary,
.lumio-template__contact-value,
.lumio-template__hero-contact-label {
  margin: 0;
  line-height: 1.7;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__headline {
  max-width: 24ch;
  color: rgba(255, 255, 255, 0.84);
  font-size: clamp(1.1rem, 1.9vw, 1.35rem);
}

.lumio-template__meta-pill,
.lumio-template__skill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.6rem;
  padding: 0 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--template-border);
  background: rgba(255, 255, 255, 0.04);
}

.lumio-template__hero-side {
  display: grid;
}

.lumio-template__rail-card {
  display: grid;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 24px;
  border: 1px solid var(--template-border);
  background: linear-gradient(180deg, rgba(8, 16, 30, 0.88) 0%, rgba(8, 16, 30, 0.7) 100%);
}

.lumio-template__stats {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.lumio-template__stat-card {
  display: grid;
  gap: 0.25rem;
  padding: 0.9rem;
  border-radius: 18px;
  border: 1px solid var(--template-border);
  background: rgba(255, 255, 255, 0.03);
  min-width: 0;
}

.lumio-template__stat-value {
  color: var(--template-hero-text);
  font-size: 1.45rem;
  line-height: 1;
}

.lumio-template__hero-contact-list {
  display: grid;
  gap: 0.75rem;
}

.lumio-template__hero-contact {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3rem;
  padding: 0 0.95rem;
  border-radius: 18px;
  border: 1px solid var(--template-border);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  text-decoration: none;
  max-width: 100%;
  min-width: 0;
}

.lumio-template__hero-contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.07);
  color: var(--template-color-primary);
  flex-shrink: 0;
}

.lumio-template__content {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.lumio-template__panel {
  display: grid;
  gap: 1rem;
  padding: 1.35rem;
  min-width: 0;
}

.lumio-template__section-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
}

.lumio-template__section-title {
  color: var(--template-hero-text);
  font-size: clamp(1.8rem, 3.4vw, 3rem);
  line-height: 1.02;
}

.lumio-template__section-title--compact {
  font-size: clamp(1.2rem, 1.9vw, 1.8rem);
  line-height: 1.14;
}

.lumio-template__project-grid,
.lumio-template__contact-grid,
.lumio-template__intro-grid {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.lumio-template__project-card {
  display: grid;
  gap: 0.8rem;
  padding: 1.25rem;
  border-radius: 24px;
  min-width: 0;
}

.lumio-template__project-category {
  color: var(--template-color-tertiary);
}

.lumio-template__link {
  display: inline-flex;
  align-items: center;
  min-height: 2.6rem;
  width: fit-content;
  padding: 0 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--template-border);
  color: var(--template-hero-text);
  text-decoration: none;
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  min-width: 0;
  padding: 1rem;
  border-radius: 22px;
  border: 1px solid var(--template-border);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  text-decoration: none;
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.9rem;
  height: 2.9rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--template-color-primary);
  flex-shrink: 0;
}

.lumio-template__contact-content {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
  flex: 1;
}

.lumio-template--mode-light {
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.2) 0%, transparent 28%),
    linear-gradient(180deg, rgba(240, 249, 255, 0.84) 0%, rgba(230, 241, 255, 0.82) 100%);
}

.lumio-template--mode-light .lumio-template__hero,
.lumio-template--mode-light .lumio-template__panel,
.lumio-template--mode-light .lumio-template__project-card {
  background: linear-gradient(180deg, rgba(11, 17, 32, 0.84) 0%, rgba(10, 16, 28, 0.76) 100%);
}

@media (min-width: 900px) {
  .lumio-template__hero-grid {
    grid-template-columns: minmax(0, 1.14fr) minmax(320px, 0.86fr);
    align-items: start;
  }

  .lumio-template__intro-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .lumio-template__project-grid,
  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>