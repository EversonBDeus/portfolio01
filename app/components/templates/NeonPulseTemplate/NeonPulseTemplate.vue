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
  themeName: 'Neon Pulse',
  templatePresetId: null,
  templateMode: 'dark'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Portfólio vibrante, direto e orientado por presença visual.'
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

const primaryContacts = computed(() => contactItems.value.slice(0, 2))
const extraContacts = computed(() => contactItems.value.slice(2))
</script>

<template>
  <article
    class="lumio-template lumio-template--neon-pulse"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__stage">
      <div
        class="lumio-template__hero-card"
        v-reveal="{ distance: '20px', duration: 540 }"
      >
        <div class="lumio-template__hero-copy">
          <h1 class="lumio-template__name">
            {{ publicName }}
          </h1>

          <p class="lumio-template__headline">
            {{ headline }}
          </p>

          <div class="lumio-template__meta-row">
            <span
              v-if="roleTitle"
              class="lumio-template__meta-pill"
            >
              {{ roleTitle }}
            </span>

            <span
              v-if="location"
              class="lumio-template__meta-pill lumio-template__meta-pill--dark"
            >
              {{ location }}
            </span>

            <UBadge
              v-if="featuredCount > 0"
              class="lumio-template__badge lumio-template__badge--success"
            >
              {{ featuredCount }} destaque<span v-if="featuredCount > 1">s</span>
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

        <div class="lumio-template__hero-bottom">
          <div class="lumio-template__stats-grid">
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
            v-if="primaryContacts.length"
            class="lumio-template__contact-shell"
          >
            <p class="lumio-template__section-kicker">
              Contato principal
            </p>

            <div class="lumio-template__contact-stack">
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
          </div>
        </div>
      </div>
    </section>

    <div class="lumio-template__body">
      <section
        class="lumio-template__grid"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <article class="lumio-template__panel lumio-template__panel--about">
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

        <article class="lumio-template__panel lumio-template__panel--project">
          <p class="lumio-template__section-kicker">
            Projeto principal
          </p>

          <template v-if="leadProject">
            <div class="lumio-template__project-head">
              <UBadge class="lumio-template__badge lumio-template__badge--soft">
                {{ leadProject.category || 'Projeto selecionado' }}
              </UBadge>

              <UBadge
                v-if="leadProject.featured"
                class="lumio-template__badge lumio-template__badge--success"
              >
                Destaque
              </UBadge>
            </div>

            <h2 class="lumio-template__section-title">
              {{ leadProject.title }}
            </h2>

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

          <p
            v-else
            class="lumio-template__copy"
          >
            Nenhum projeto público disponível no momento.
          </p>
        </article>
      </section>

      <section
        v-if="secondaryProjects.length || extraContacts.length"
        class="lumio-template__lower-strip"
        v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
      >
        <div
          v-if="secondaryProjects.length"
          class="lumio-template__mini-grid"
        >
          <article
            v-for="project in secondaryProjects"
            :key="project.id"
            class="lumio-template__mini-card"
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
      </section>
    </div>
  </article>
</template>

<style scoped>
.lumio-template {
  font-family: var(--template-font-body);
  min-width: 0;
  color: var(--template-text);
}

.lumio-template :is(h1, h2, h3) {
  font-family: var(--template-font-heading);
}

.lumio-template--neon-pulse {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--template-color-primary) 14%, transparent), transparent 28%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 16%, transparent), transparent 26%),
    linear-gradient(180deg, #0b1020 0%, #11162a 100%);
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  box-shadow:
    0 36px 110px -58px rgba(2, 6, 23, 0.66),
    inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.lumio-template--mode-light {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent 28%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 12%, transparent), transparent 26%),
    linear-gradient(180deg, #f5f4fa 0%, #fbfbff 100%);
  box-shadow:
    0 28px 96px -58px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.34);
}

.lumio-template__stage {
  display: flex;
  justify-content: center;
  padding: 1.2rem 1rem 0.9rem;
}

.lumio-template__hero-card {
  width: min(100%, 68rem);
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1.9rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--template-color-primary) 34%, transparent),
      color-mix(in srgb, var(--template-color-secondary) 30%, transparent)
    ),
    linear-gradient(180deg, color-mix(in srgb, var(--template-surface-elevated) 62%, rgba(255, 255, 255, 0.08)), color-mix(in srgb, var(--template-surface) 52%, rgba(255, 255, 255, 0.04)));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.18),
    0 28px 54px -34px color-mix(in srgb, var(--template-color-primary) 34%, transparent);
  backdrop-filter: blur(18px);
}

.lumio-template--mode-light .lumio-template__hero-card {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--template-color-primary) 28%, white),
      color-mix(in srgb, var(--template-color-secondary) 26%, white)
    ),
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.72));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.44),
    0 22px 44px -34px color-mix(in srgb, var(--template-color-primary) 24%, transparent);
}

.lumio-template__meta-row,
.lumio-template__project-head,
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

.lumio-template__badge--success {
  color: #ffffff;
  background: linear-gradient(90deg, #10b981, #34d399);
}

.lumio-template__badge--soft {
  color: var(--template-text);
  background: color-mix(in srgb, var(--template-color-primary) 14%, rgba(255, 255, 255, 0.36));
}

.lumio-template__badge--outline {
  color: var(--template-text-muted);
  background: color-mix(in srgb, var(--template-surface) 78%, transparent);
}

.lumio-template__hero-copy {
  display: grid;
  gap: 1rem;
}

.lumio-template__name,
.lumio-template__section-title,
.lumio-template__mini-title {
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template__name {
  font-size: clamp(2.6rem, 8vw, 4.8rem);
  line-height: 0.92;
  letter-spacing: -0.06em;
  color: #ffffff;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.18);
}

.lumio-template--mode-light .lumio-template__name,
.lumio-template--mode-light .lumio-template__section-title,
.lumio-template--mode-light .lumio-template__mini-title {
  color: color-mix(in srgb, var(--template-color-secondary) 24%, #111827);
  text-shadow: none;
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__contact-value {
  margin: 0;
  line-height: 1.76;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: rgba(255, 255, 255, 0.94);
}

.lumio-template--mode-light .lumio-template__headline,
.lumio-template--mode-light .lumio-template__copy,
.lumio-template--mode-light .lumio-template__contact-value {
  color: color-mix(in srgb, var(--template-text) 86%, #475569);
}

.lumio-template__headline {
  font-size: 1.02rem;
  max-width: 38ch;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.68;
}

.lumio-template__meta-pill,
.lumio-template__skill,
.lumio-template__skill-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0.48rem 0.78rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(13, 18, 34, 0.28);
  font-size: 0.78rem;
  font-weight: 600;
  color: #ffffff;
  backdrop-filter: blur(10px);
}

.lumio-template__meta-pill--dark {
  background: rgba(10, 14, 26, 0.42);
}

.lumio-template__skills,
.lumio-template__skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lumio-template__hero-bottom {
  display: grid;
  gap: 1rem;
}

.lumio-template__stats-grid {
  display: grid;
  gap: 0.85rem;
}

.lumio-template__stat-card,
.lumio-template__contact-shell,
.lumio-template__panel,
.lumio-template__mini-card {
  border-radius: 1.35rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background: color-mix(in srgb, var(--template-surface) 64%, rgba(255, 255, 255, 0.08));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 18px 36px -32px rgba(2, 6, 23, 0.34);
  backdrop-filter: blur(16px);
}

.lumio-template--mode-light .lumio-template__stat-card,
.lumio-template--mode-light .lumio-template__contact-shell,
.lumio-template--mode-light .lumio-template__panel,
.lumio-template--mode-light .lumio-template__mini-card {
  background: color-mix(in srgb, var(--template-surface-elevated) 86%, rgba(255, 255, 255, 0.8));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.32),
    0 16px 32px -30px rgba(15, 23, 42, 0.12);
}

.lumio-template__stat-card,
.lumio-template__contact-shell,
.lumio-template__panel,
.lumio-template__mini-card {
  padding: 0.95rem;
}

.lumio-template__stat-label,
.lumio-template__section-kicker,
.lumio-template__contact-label {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.lumio-template--mode-light .lumio-template__stat-label,
.lumio-template--mode-light .lumio-template__section-kicker,
.lumio-template--mode-light .lumio-template__contact-label {
  color: color-mix(in srgb, var(--template-text-muted) 88%, #64748b);
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.45rem;
  line-height: 1;
  color: #ffffff;
}

.lumio-template--mode-light .lumio-template__stat-value {
  color: color-mix(in srgb, var(--template-color-secondary) 26%, #111827);
}

.lumio-template__contact-shell {
  display: grid;
  gap: 0.9rem;
}

.lumio-template__contact-stack,
.lumio-template__contact-grid,
.lumio-template__mini-grid {
  display: grid;
  gap: 0.85rem;
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.82rem;
  padding: 0.9rem;
  border-radius: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background: color-mix(in srgb, var(--template-surface) 72%, rgba(255, 255, 255, 0.06));
  text-decoration: none;
  color: inherit;
}

.lumio-template--mode-light .lumio-template__contact-card {
  background: color-mix(in srgb, var(--template-surface-elevated) 88%, rgba(255, 255, 255, 0.84));
}

.lumio-template__contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.95rem;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--template-color-primary) 18%, transparent);
  color: #ffffff;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--template-color-primary) 20%, transparent);
}

.lumio-template--mode-light .lumio-template__contact-icon {
  color: color-mix(in srgb, var(--template-color-secondary) 28%, #111827);
}

.lumio-template__contact-copy {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 0 1rem 1rem;
}

.lumio-template__grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__project-head {
  justify-content: space-between;
}

.lumio-template__action {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.86rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 18px 34px -24px color-mix(in srgb, var(--template-color-primary) 54%, transparent);
}

.lumio-template__lower-strip {
  display: grid;
  gap: 1rem;
}

.lumio-template__mini-title {
  font-size: 1rem;
  line-height: 1.16;
}

@media (hover: hover) {
  .lumio-template__action:hover,
  .lumio-template__contact-card:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 767px) {
  .lumio-template__stage {
    padding: 0.82rem 0.82rem 0.72rem;
  }

  .lumio-template__body {
    padding: 0 0.82rem 0.82rem;
  }

  .lumio-template__hero-card,
  .lumio-template__stat-card,
  .lumio-template__contact-shell,
  .lumio-template__panel,
  .lumio-template__mini-card {
    padding: 0.9rem;
  }

  .lumio-template__name {
    font-size: clamp(2.15rem, 11vw, 3.9rem);
  }

  .lumio-template__headline {
    font-size: 0.94rem;
    line-height: 1.68;
  }
}

@media (min-width: 900px) {
  .lumio-template__hero-card {
    padding: 1.3rem;
  }

  .lumio-template__hero-copy {
    max-width: 44rem;
  }

  .lumio-template__hero-bottom {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    align-items: start;
  }

  .lumio-template__stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }

  .lumio-template__mini-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>