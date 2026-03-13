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
  themeName: 'Noir Signal',
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
  )].slice(0, 10)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter((project) => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const leadProject = computed(() => featuredProjects.value[0] ?? null)
const secondaryProjects = computed(() => featuredProjects.value.slice(1, 4))
const featuredCount = computed(() => props.portfolio.projects.filter((project) => project.featured).length)

const signalStats = computed(() => {
  return [
    { label: 'Projetos', value: String(props.portfolio.projects.length), icon: 'i-lucide-folder-kanban' },
    { label: 'Destaques', value: String(featuredCount.value), icon: 'i-lucide-badge-check' },
    { label: 'Skills', value: String(skills.value.length), icon: 'i-lucide-sparkles' }
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
</script>

<template>
  <article
    class="lumio-template lumio-template--noir-signal"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero">
      <div class="lumio-template__hero-grid">
        <div
          class="lumio-template__hero-main"
          v-reveal="{ distance: '16px', duration: 520 }"
        >
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
          v-reveal="{ delay: 80, distance: '16px', duration: 520 }"
        >
          <div class="lumio-template__summary-card">
            <p class="lumio-template__section-kicker lumio-template__section-kicker--soft">
              Sinal principal
            </p>

            <p class="lumio-template__copy">
              {{ summary }}
            </p>
          </div>

          <div class="lumio-template__signal-grid">
            <article
              v-for="stat in signalStats"
              :key="stat.label"
              class="lumio-template__signal-card"
            >
              <div class="lumio-template__signal-head">
                <UIcon :name="stat.icon" />
                <span>{{ stat.label }}</span>
              </div>

              <strong class="lumio-template__signal-value">
                {{ stat.value }}
              </strong>
            </article>
          </div>

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
        </aside>
      </div>
    </section>

    <div class="lumio-template__body">
      <section class="lumio-template__grid lumio-template__grid--intro">
        <article
          class="lumio-template__panel"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Direção
          </p>

          <h2 class="lumio-template__section-title">
            Um template escuro, afiado e orientado por contraste.
          </h2>

          <p class="lumio-template__copy">
            Noir Signal trabalha a sensação de precisão, silêncio e contraste, mantendo
            o contrato atual do Lumio sem qualquer dependência do tema global.
          </p>
        </article>

        <article
          class="lumio-template__panel"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Camada pública
          </p>

          <p class="lumio-template__copy">
            Hero, about, projetos e contato ficam escopados no próprio componente para
            futura integração no fluxo público real com segurança visual.
          </p>
        </article>
      </section>

      <section
        class="lumio-template__project-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__project-head">
          <div>
            <p class="lumio-template__section-kicker">
              Projeto principal
            </p>

            <h2 class="lumio-template__section-title">
              Bloco central com leitura alta e atmosfera noir.
            </h2>
          </div>
        </div>

        <div class="lumio-template__project-grid">
          <article
            v-if="leadProject"
            class="lumio-template__lead-card"
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

          <div
            v-if="secondaryProjects.length"
            class="lumio-template__side-list"
          >
            <article
              v-for="project in secondaryProjects"
              :key="project.id"
              class="lumio-template__side-card"
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
          </div>
        </div>
      </section>

      <section
        class="lumio-template__panel"
        v-reveal="{ distance: '14px', duration: 500 }"
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
          Nenhum canal público foi informado ainda.
        </p>
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

.lumio-template--noir-signal {
  --noir-shell: #06080d;
  --noir-surface: rgba(255, 255, 255, 0.04);
  --noir-surface-strong: rgba(255, 255, 255, 0.07);
  --noir-border: rgba(255, 255, 255, 0.1);
  --noir-copy: rgba(255, 255, 255, 0.76);
  --noir-copy-soft: rgba(255, 255, 255, 0.5);
  border: 1px solid color-mix(in srgb, var(--template-border) 78%, transparent);
  border-radius: 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-primary) 14%, transparent), transparent 22%),
    radial-gradient(circle at bottom left, color-mix(in srgb, var(--template-color-secondary) 12%, transparent), transparent 26%),
    linear-gradient(180deg, #06080d, #0a1018);
  box-shadow: 0 30px 110px -58px rgba(15, 23, 42, 0.54);
}

.lumio-template--noir-signal.lumio-template--mode-light {
  --noir-shell: #ffffff;
  --noir-surface: rgba(15, 23, 42, 0.04);
  --noir-surface-strong: rgba(15, 23, 42, 0.06);
  --noir-border: rgba(15, 23, 42, 0.08);
  --noir-copy: rgba(15, 23, 42, 0.72);
  --noir-copy-soft: rgba(15, 23, 42, 0.5);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent 22%),
    radial-gradient(circle at bottom left, color-mix(in srgb, var(--template-color-secondary) 8%, transparent), transparent 26%),
    #ffffff;
  box-shadow: 0 30px 110px -58px rgba(15, 23, 42, 0.16);
}

.lumio-template__hero {
  padding: 1.35rem;
  border-bottom: 1px solid var(--noir-border);
}

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__hero-grid,
.lumio-template__grid,
.lumio-template__project-grid,
.lumio-template__side-list,
.lumio-template__contact-grid,
.lumio-template__signal-grid,
.lumio-template__contact-stack {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-main,
.lumio-template__hero-side,
.lumio-template__summary-card,
.lumio-template__signal-card,
.lumio-template__lead-card,
.lumio-template__side-card,
.lumio-template__panel,
.lumio-template__contact-card {
  min-width: 0;
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
  padding: 0.64rem 0.88rem;
  border-radius: 999px;
  border: 1px solid var(--noir-border);
  background: var(--noir-surface);
  font-size: 0.8rem;
  font-weight: 600;
}

.lumio-template__pill--primary,
.lumio-template__tag--highlight {
  color: #ffffff;
  border-color: color-mix(in srgb, var(--template-color-primary) 30%, transparent);
  background: linear-gradient(90deg, color-mix(in srgb, var(--template-color-primary) 20%, transparent), color-mix(in srgb, var(--template-color-secondary) 14%, transparent));
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
.lumio-template__signal-head {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template__slug {
  margin-top: 1rem;
  color: var(--noir-copy-soft);
}

.lumio-template__section-kicker {
  color: var(--template-color-tertiary);
}

.lumio-template__section-kicker--soft {
  color: var(--noir-copy-soft);
}

.lumio-template__name {
  margin: 0.9rem 0 0;
  font-size: clamp(2.35rem, 5.4vw, 4.9rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.lumio-template__headline,
.lumio-template__copy {
  margin: 0.95rem 0 0;
  color: var(--noir-copy);
  font-size: 0.97rem;
  line-height: 1.8;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.68;
}

.lumio-template__summary-card,
.lumio-template__signal-card,
.lumio-template__project-shell,
.lumio-template__lead-card,
.lumio-template__side-card,
.lumio-template__panel,
.lumio-template__contact-card {
  padding: 1.05rem;
  border-radius: 1.6rem;
  border: 1px solid var(--noir-border);
  background: var(--noir-surface);
  backdrop-filter: blur(14px);
}

.lumio-template__project-shell {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 6%, transparent), transparent),
    var(--noir-surface-strong);
}

.lumio-template__signal-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--noir-copy-soft);
}

.lumio-template__signal-value {
  display: block;
  margin-top: 0.6rem;
  font-size: 1.35rem;
  line-height: 1;
}

.lumio-template__project-head {
  display: grid;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.lumio-template__section-title {
  margin: 0.55rem 0 0;
  font-size: clamp(1.5rem, 3vw, 2.3rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.lumio-template__project-title,
.lumio-template__project-card-title {
  margin: 0.85rem 0 0;
  font-size: 1.3rem;
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
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: #07111b;
  text-decoration: none;
  font-weight: 700;
}

.lumio-template__contact-card {
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
  gap: 0.18rem;
  min-width: 0;
}

.lumio-template__contact-label {
  color: var(--noir-copy-soft);
}

.lumio-template__contact-value {
  color: var(--template-text);
  font-size: 0.94rem;
  line-height: 1.6;
  word-break: break-word;
}

@media (min-width: 48rem) {
  .lumio-template__signal-grid,
  .lumio-template__contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 72rem) {
  .lumio-template__hero-grid {
    grid-template-columns: minmax(0, 1.08fr) 21rem;
    gap: 1.3rem;
  }

  .lumio-template__grid--intro {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lumio-template__project-grid {
    grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__signal-grid {
    grid-template-columns: 1fr;
  }
}
</style>