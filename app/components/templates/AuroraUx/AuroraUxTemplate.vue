<script setup lang="ts">
import { computed } from 'vue'
import type { PortfolioPublicViewModel } from '~/types/portfolio-public-view-model'
import { usePortfolioTemplateTheme } from '~/composables/usePortfolioTemplateTheme'

const props = defineProps<{
  portfolio: PortfolioPublicViewModel
  themeName?: string
  templatePresetId?: string | null
}>()
const { themeVars } = usePortfolioTemplateTheme(props.templatePresetId)
const summary = computed(() => props.portfolio.about.summary.trim())

const publicationLabel = computed(() => {
  return props.portfolio.settings.publicationStatus === 'published' ? 'Publicado' : 'Rascunho'
})

const skills = computed(() => {
  return props.portfolio.hero.skills.filter(Boolean).slice(0, 6)
})

const projectsToRender = computed(() => {
  const featuredProjects = props.portfolio.projects.filter((project) => project.featured)
  return featuredProjects.length ? featuredProjects : props.portfolio.projects
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
  return [
    {
      key: 'publicEmail',
      label: 'Email',
      value: props.portfolio.contact.publicEmail,
      href: props.portfolio.contact.publicEmail ? `mailto:${props.portfolio.contact.publicEmail}` : '',
      external: false
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: props.portfolio.contact.linkedin,
      href: normalizeWebsite(props.portfolio.contact.linkedin),
      external: true
    },
    {
      key: 'github',
      label: 'GitHub',
      value: props.portfolio.contact.github,
      href: normalizeWebsite(props.portfolio.contact.github),
      external: true
    },
    {
      key: 'website',
      label: 'Website',
      value: props.portfolio.contact.website,
      href: normalizeWebsite(props.portfolio.contact.website),
      external: true
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      value: props.portfolio.contact.whatsapp,
      href: normalizeWhatsapp(props.portfolio.contact.whatsapp),
      external: true
    }
  ].filter((item) => item.value && item.href)
})
</script>

<template>
  <article class="aurora-template">
    <section class="aurora-template__hero">
      <div class="aurora-template__hero-backdrop" />

      <div
        class="aurora-template__hero-content"
        v-reveal="{ distance: '18px', duration: 650 }"
      >
        <div class="aurora-template__eyebrow">
          <span class="aurora-template__pill aurora-template__pill--ghost">
            {{ themeName || 'Aurora UX' }}
          </span>

          <span class="aurora-template__pill aurora-template__pill--accent">
            {{ publicationLabel }}
          </span>
        </div>

        <div class="aurora-template__heading">
          <p class="aurora-template__kicker">
            /{{ portfolio.settings.publicSlug }}
          </p>

          <h1 class="aurora-template__title">
            {{ portfolio.hero.publicName }}
          </h1>

          <p v-if="portfolio.hero.headline" class="aurora-template__headline">
            {{ portfolio.hero.headline }}
          </p>
        </div>

        <div class="aurora-template__meta">
          <span v-if="portfolio.hero.roleTitle" class="aurora-template__meta-item">
            {{ portfolio.hero.roleTitle }}
          </span>

          <span v-if="portfolio.hero.location" class="aurora-template__meta-item">
            {{ portfolio.hero.location }}
          </span>
        </div>

        <ul v-if="skills.length" class="aurora-template__skills" aria-label="Principais habilidades">
          <li
            v-for="skill in skills"
            :key="skill"
            class="aurora-template__skill"
          >
            {{ skill }}
          </li>
        </ul>
      </div>
    </section>

    <div class="aurora-template__body">
      <section
        class="aurora-template__section aurora-template__section--about"
        v-reveal="{ delay: 80, distance: '16px', duration: 600 }"
      >
        <div class="aurora-template__section-heading">
          <p class="aurora-template__section-label">
            Sobre
          </p>

          <h2 class="aurora-template__section-title">
            Resumo profissional
          </h2>
        </div>

        <p v-if="summary" class="aurora-template__copy">
          {{ summary }}
        </p>

        <p v-else class="aurora-template__empty">
          O resumo profissional ainda não foi preenchido.
        </p>
      </section>

      <section
        class="aurora-template__section aurora-template__section--projects"
        v-reveal="{ delay: 120, distance: '16px', duration: 600 }"
      >
        <div class="aurora-template__section-heading">
          <p class="aurora-template__section-label">
            Projetos
          </p>

          <h2 class="aurora-template__section-title">
            Trabalhos em destaque
          </h2>
        </div>

        <div class="aurora-template__projects">
          <article
            v-for="(project, index) in projectsToRender"
            :key="project.id"
            class="aurora-template__project-card"
            v-reveal="{ delay: 140 + (index * 90), distance: '16px', duration: 600 }"
          >
            <div class="aurora-template__project-top">
              <span class="aurora-template__project-category">
                {{ project.category }}
              </span>

              <span
                v-if="project.featured"
                class="aurora-template__project-badge"
              >
                Destaque
              </span>
            </div>

            <h3 class="aurora-template__project-title">
              {{ project.title }}
            </h3>

            <p class="aurora-template__project-summary">
              {{ project.summary }}
            </p>

            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noreferrer noopener"
              class="aurora-template__project-link"
            >
              Ver projeto
            </a>
          </article>
        </div>
      </section>

      <section
        class="aurora-template__section aurora-template__section--contact"
        v-reveal="{ delay: 180, distance: '16px', duration: 600 }"
      >
        <div class="aurora-template__section-heading">
          <p class="aurora-template__section-label">
            Contato
          </p>

          <h2 class="aurora-template__section-title">
            Canais públicos
          </h2>
        </div>

        <div class="aurora-template__contacts">
          <a
            v-for="item in contactItems"
            :key="item.key"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="aurora-template__contact-card"
          >
            <span class="aurora-template__contact-label">
              {{ item.label }}
            </span>

            <span class="aurora-template__contact-value">
              {{ item.value }}
            </span>
          </a>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.aurora-template {
  --aurora-font-family: 'Manrope', system-ui, sans-serif;
  --aurora-display-family: 'Manrope', system-ui, sans-serif;
  --aurora-bg: rgba(255, 255, 255, 0.82);
  --aurora-bg-elevated: rgba(255, 255, 255, 0.72);
  --aurora-border: rgba(15, 23, 42, 0.1);
  --aurora-border-strong: rgba(15, 23, 42, 0.16);
  --aurora-shadow: 0 24px 80px -48px rgba(15, 23, 42, 0.45);
  --aurora-shadow-soft: 0 14px 40px -32px rgba(15, 23, 42, 0.32);
  --aurora-text: var(--ui-text, #0f172a);
  --aurora-text-muted: rgba(15, 23, 42, 0.7);
  --aurora-hero-text: #ffffff;
  --aurora-primary: var(--ui-color-primary-500, #7c3aed);
  --aurora-secondary: var(--ui-color-secondary-500, #06b6d4);
  --aurora-tertiary: var(--ui-color-tertiary-500, #38bdf8);
  --aurora-ring: rgba(255, 255, 255, 0.18);

  display: block;
  overflow: hidden;
  border: 1px solid var(--aurora-border);
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.56) 100%);
  box-shadow: var(--aurora-shadow);
  color: var(--aurora-text);
  font-family: var(--aurora-font-family);
  backdrop-filter: blur(18px);
}

.aurora-template__hero {
  position: relative;
  overflow: hidden;
  padding: 1.25rem;
  border-bottom: 1px solid var(--aurora-border);
}

.aurora-template__hero-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.24) 0%, transparent 38%),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.12) 0%, transparent 32%),
    linear-gradient(135deg, var(--aurora-primary) 0%, var(--aurora-secondary) 55%, var(--aurora-tertiary) 100%);
}

.aurora-template__hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
  color: var(--aurora-hero-text);
}

.aurora-template__eyebrow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.aurora-template__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  padding: 0 0.875rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.aurora-template__pill--ghost {
  background: rgba(255, 255, 255, 0.14);
  border-color: var(--aurora-ring);
}

.aurora-template__pill--accent {
  background: rgba(15, 23, 42, 0.22);
  border-color: rgba(255, 255, 255, 0.14);
}

.aurora-template__heading {
  display: grid;
  gap: 0.625rem;
}

.aurora-template__kicker {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.82;
}

.aurora-template__title {
  margin: 0;
  font-family: var(--aurora-display-family);
  font-size: clamp(2rem, 7vw, 4.4rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.aurora-template__headline {
  max-width: 56rem;
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.94;
}

.aurora-template__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.aurora-template__meta-item {
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  padding: 0 0.875rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 0.9rem;
  font-weight: 600;
}

.aurora-template__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.aurora-template__skill {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.875rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 0.85rem;
  font-weight: 600;
}

.aurora-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.aurora-template__section {
  display: grid;
  gap: 1rem;
  padding: 1.125rem;
  border: 1px solid var(--aurora-border);
  border-radius: 24px;
  background: var(--aurora-bg);
  box-shadow: var(--aurora-shadow-soft);
  backdrop-filter: blur(16px);
}

.aurora-template__section-heading {
  display: grid;
  gap: 0.25rem;
}

.aurora-template__section-label {
  margin: 0;
  color: var(--aurora-text-muted);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.aurora-template__section-title {
  margin: 0;
  font-family: var(--aurora-display-family);
  font-size: 1.35rem;
  letter-spacing: -0.02em;
}

.aurora-template__copy,
.aurora-template__empty,
.aurora-template__project-summary,
.aurora-template__contact-value {
  margin: 0;
  line-height: 1.75;
  font-size: 0.97rem;
  color: var(--aurora-text-muted);
  word-break: break-word;
}

.aurora-template__projects {
  display: grid;
  gap: 0.875rem;
}

.aurora-template__project-card {
  display: grid;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 22px;
  background: var(--aurora-bg-elevated);
  border: 1px solid var(--aurora-border);
}

.aurora-template__project-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem;
}

.aurora-template__project-category,
.aurora-template__project-badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.9rem;
  padding: 0 0.75rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.aurora-template__project-category {
  background: rgba(15, 23, 42, 0.06);
  color: var(--aurora-text);
}

.aurora-template__project-badge {
  background: rgba(16, 185, 129, 0.14);
  color: rgb(5, 150, 105);
}

.aurora-template__project-title {
  margin: 0;
  font-family: var(--aurora-display-family);
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.aurora-template__project-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 2.75rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: var(--aurora-text);
  color: #ffffff;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 700;
  transition: transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease;
}

.aurora-template__project-link:hover {
  opacity: 0.94;
  transform: translateY(-1px);
}

.aurora-template__contacts {
  display: grid;
  gap: 0.875rem;
}

.aurora-template__contact-card {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  border-radius: 20px;
  background: var(--aurora-bg-elevated);
  border: 1px solid var(--aurora-border);
  color: inherit;
  text-decoration: none;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
}

.aurora-template__contact-card:hover {
  transform: translateY(-1px);
  border-color: var(--aurora-border-strong);
}

.aurora-template__contact-label {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--aurora-text);
}

:global(.dark) .aurora-template {
  --aurora-bg: rgba(15, 23, 42, 0.62);
  --aurora-bg-elevated: rgba(15, 23, 42, 0.5);
  --aurora-border: rgba(255, 255, 255, 0.1);
  --aurora-border-strong: rgba(255, 255, 255, 0.18);
  --aurora-shadow: 0 28px 100px -56px rgba(0, 0, 0, 0.82);
  --aurora-shadow-soft: 0 20px 44px -32px rgba(0, 0, 0, 0.7);
  --aurora-text: rgba(255, 255, 255, 0.96);
  --aurora-text-muted: rgba(255, 255, 255, 0.72);
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.84) 0%, rgba(2, 6, 23, 0.76) 100%);
}

:global(.dark) .aurora-template__project-category {
  background: rgba(255, 255, 255, 0.08);
  color: var(--aurora-text);
}

:global(.dark) .aurora-template__project-badge {
  background: rgba(16, 185, 129, 0.16);
  color: rgb(110, 231, 183);
}

:global(html[data-preset='ux-mastery']) .aurora-template {
  --aurora-font-family: 'Manrope', system-ui, sans-serif;
  --aurora-display-family: 'Manrope', system-ui, sans-serif;
}

:global(html[data-preset='neon-spectrum']) .aurora-template,
:global(html[data-preset='cyber-lime']) .aurora-template {
  --aurora-font-family: 'Space Grotesk', system-ui, sans-serif;
  --aurora-display-family: 'Space Grotesk', system-ui, sans-serif;
}

:global(html[data-preset='pastel-pop']) .aurora-template,
:global(html[data-preset='rose-wine']) .aurora-template {
  --aurora-font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  --aurora-display-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

:global(html[data-preset='aquatech-minimal']) .aurora-template,
:global(html[data-preset='minty-dark']) .aurora-template {
  --aurora-font-family: 'Inter', system-ui, sans-serif;
  --aurora-display-family: 'Inter', system-ui, sans-serif;
}

:global(html[data-preset='lava-sunset']) .aurora-template,
:global(html[data-preset='sunset-lava']) .aurora-template,
:global(html[data-preset='ux-elite']) .aurora-template {
  --aurora-font-family: 'Sora', system-ui, sans-serif;
  --aurora-display-family: 'Sora', system-ui, sans-serif;
}

@media (min-width: 768px) {
  .aurora-template__hero {
    padding: 2rem;
  }

  .aurora-template__hero-content {
    gap: 1.25rem;
  }

  .aurora-template__headline {
    font-size: 1.08rem;
  }

  .aurora-template__body {
    gap: 1.25rem;
    padding: 1.25rem;
  }

  .aurora-template__section {
    padding: 1.4rem;
  }

  .aurora-template__projects,
  .aurora-template__contacts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .aurora-template__hero {
    padding: 2.25rem;
  }

  .aurora-template__body {
    padding: 1.5rem;
  }

  .aurora-template__section--about {
    padding-right: 2rem;
  }

  .aurora-template__projects {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@supports (color: color-mix(in srgb, white 10%, black)) {
  .aurora-template {
    --aurora-bg: color-mix(in srgb, white 80%, transparent);
    --aurora-bg-elevated: color-mix(in srgb, white 68%, transparent);
    --aurora-border: color-mix(in srgb, var(--ui-color-neutral-900, #0f172a) 10%, transparent);
    --aurora-border-strong: color-mix(in srgb, var(--ui-color-neutral-900, #0f172a) 16%, transparent);
  }

  :global(.dark) .aurora-template {
    --aurora-bg: color-mix(in srgb, var(--ui-color-neutral-900, #0f172a) 68%, transparent);
    --aurora-bg-elevated: color-mix(in srgb, var(--ui-color-neutral-900, #0f172a) 56%, transparent);
    --aurora-border: color-mix(in srgb, white 10%, transparent);
    --aurora-border-strong: color-mix(in srgb, white 18%, transparent);
  }
}
</style>