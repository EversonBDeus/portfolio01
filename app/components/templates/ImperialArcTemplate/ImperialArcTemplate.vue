<script setup lang="ts">
import { computed, ref } from 'vue'
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
  themeName: 'Imperial Arc',
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
  )].slice(0, 10)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter((project) => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const selectedProjectIndex = ref(0)

const selectedProject = computed(() => {
  return featuredProjects.value[selectedProjectIndex.value] ?? featuredProjects.value[0] ?? null
})

const projectTabs = computed(() => {
  return featuredProjects.value.slice(0, 5)
})

const secondaryProjects = computed(() => {
  return featuredProjects.value.filter((_, index) => index !== selectedProjectIndex.value).slice(0, 3)
})

const featuredCount = computed(() => {
  return props.portfolio.projects.filter((project) => project.featured).length
})

const stats = computed(() => {
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

const primaryContacts = computed(() => contactItems.value.slice(0, 3))
</script>

<template>
  <article
    class="lumio-template lumio-template--imperial-arc"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero">
      <div class="lumio-template__hero-grid">
        <div
          class="lumio-template__hero-main"
          v-reveal="{ distance: '16px', duration: 540 }"
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
          v-reveal="{ delay: 80, distance: '16px', duration: 540 }"
        >
          <div class="lumio-template__summary-card">
            <p class="lumio-template__section-kicker">
              Resumo
            </p>

            <p class="lumio-template__copy">
              {{ summary }}
            </p>
          </div>

          <div class="lumio-template__stat-grid">
            <article
              v-for="stat in stats"
              :key="stat.label"
              class="lumio-template__stat-card"
            >
              <div class="lumio-template__stat-head">
                <UIcon :name="stat.icon" />
                <span>{{ stat.label }}</span>
              </div>

              <strong class="lumio-template__stat-value">
                {{ stat.value }}
              </strong>
            </article>
          </div>
        </aside>
      </div>
    </section>

    <div class="lumio-template__body">
      <section
        class="lumio-template__project-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__project-head">
          <div>
            <p class="lumio-template__section-kicker">
              Navegação de destaque
            </p>

            <h2 class="lumio-template__section-title">
              Seleção central para a futura página pública do Lumio.
            </h2>
          </div>
        </div>

        <div
          v-if="projectTabs.length"
          class="lumio-template__selector"
        >
          <button
            v-for="(project, index) in projectTabs"
            :key="project.id"
            type="button"
            class="lumio-template__selector-button"
            :class="index === selectedProjectIndex ? 'lumio-template__selector-button--active' : ''"
            @click="selectedProjectIndex = index"
          >
            <span class="lumio-template__selector-title">{{ project.title }}</span>
            <span class="lumio-template__selector-meta">{{ project.category }}</span>
          </button>
        </div>

        <div class="lumio-template__project-grid">
          <article
            v-if="selectedProject"
            class="lumio-template__lead-card"
          >
            <div class="lumio-template__tag-row">
              <span class="lumio-template__tag">
                {{ selectedProject.category }}
              </span>

              <span
                v-if="selectedProject.featured"
                class="lumio-template__tag lumio-template__tag--highlight"
              >
                Destaque
              </span>
            </div>

            <h3 class="lumio-template__project-title">
              {{ selectedProject.title }}
            </h3>

            <p class="lumio-template__copy">
              {{ selectedProject.summary }}
            </p>

            <a
              v-if="selectedProject.link"
              :href="selectedProject.link"
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

      <section class="lumio-template__grid lumio-template__grid--footer">
        <article
          class="lumio-template__panel"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Direção
          </p>

          <h2 class="lumio-template__section-title">
            Estrutura premium com foco em decisão e curadoria.
          </h2>

          <p class="lumio-template__copy">
            Imperial Arc serve como template de apresentação mais nobre, com navegação de destaques,
            leitura editorial e tokens locais para futura integração real.
          </p>
        </article>

        <article
          class="lumio-template__panel"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">
            Canais públicos
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

          <p
            v-if="primaryContacts.length"
            class="lumio-template__footnote"
          >
            {{ primaryContacts.length }} canal(is) principais sustentam a vitrine pública inicial.
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

.lumio-template--imperial-arc {
  --imperial-shell: #fffaf4;
  --imperial-surface: rgba(255, 255, 255, 0.78);
  --imperial-surface-strong: rgba(255, 255, 255, 0.92);
  --imperial-border: rgba(15, 23, 42, 0.08);
  --imperial-copy: rgba(15, 23, 42, 0.7);
  --imperial-copy-soft: rgba(15, 23, 42, 0.5);
  border: 1px solid color-mix(in srgb, var(--template-border) 66%, rgba(15, 23, 42, 0.08));
  border-radius: 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 16%, transparent), transparent 24%),
    linear-gradient(180deg, #fffaf4, #ffffff);
  box-shadow: 0 30px 100px -54px rgba(15, 23, 42, 0.18);
}

.lumio-template--imperial-arc.lumio-template--mode-dark {
  --imperial-shell: #0a1018;
  --imperial-surface: rgba(255, 255, 255, 0.04);
  --imperial-surface-strong: rgba(255, 255, 255, 0.08);
  --imperial-border: rgba(255, 255, 255, 0.1);
  --imperial-copy: rgba(255, 255, 255, 0.74);
  --imperial-copy-soft: rgba(255, 255, 255, 0.52);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 18%, transparent), transparent 24%),
    linear-gradient(180deg, #0a1018, #08111b);
  box-shadow: 0 30px 100px -54px rgba(15, 23, 42, 0.46);
}

.lumio-template__hero {
  padding: 1.35rem;
  border-bottom: 1px solid var(--imperial-border);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-secondary) 9%, transparent), transparent 46%),
    linear-gradient(180deg, var(--imperial-surface-strong), transparent);
}

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.lumio-template__hero-grid,
.lumio-template__project-grid,
.lumio-template__grid,
.lumio-template__selector,
.lumio-template__side-list,
.lumio-template__contact-grid,
.lumio-template__stat-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-main,
.lumio-template__hero-side,
.lumio-template__summary-card,
.lumio-template__stat-card,
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
  border: 1px solid var(--imperial-border);
  background: var(--imperial-surface);
  font-size: 0.8rem;
  font-weight: 600;
}

.lumio-template__pill--primary,
.lumio-template__tag--highlight,
.lumio-template__selector-button--active {
  color: color-mix(in srgb, var(--template-color-primary) 74%, var(--template-text));
  border-color: color-mix(in srgb, var(--template-color-primary) 30%, transparent);
  background: color-mix(in srgb, var(--template-color-primary) 12%, transparent);
}

.lumio-template__pill--success {
  color: #166534;
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.18);
}

.lumio-template__pill--warning {
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.18);
}

.lumio-template__slug,
.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-head {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template__slug {
  margin-top: 1rem;
  color: var(--imperial-copy-soft);
}

.lumio-template__section-kicker {
  color: var(--template-color-secondary);
}

.lumio-template__name {
  margin: 0.9rem 0 0;
  font-size: clamp(2.35rem, 5.4vw, 4.9rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__footnote {
  margin: 0.95rem 0 0;
  color: var(--imperial-copy);
  font-size: 0.97rem;
  line-height: 1.82;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.7;
}

.lumio-template__summary-card,
.lumio-template__stat-card,
.lumio-template__project-shell,
.lumio-template__lead-card,
.lumio-template__side-card,
.lumio-template__panel,
.lumio-template__contact-card {
  padding: 1.05rem;
  border-radius: 1.6rem;
  border: 1px solid var(--imperial-border);
  background: var(--imperial-surface);
}

.lumio-template__project-shell {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 7%, transparent), transparent),
    var(--imperial-surface);
}

.lumio-template__stat-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--imperial-copy-soft);
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.6rem;
  font-size: 1.35rem;
  line-height: 1;
}

.lumio-template__project-head {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__selector-button {
  display: grid;
  gap: 0.2rem;
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 1.2rem;
  border: 1px solid var(--imperial-border);
  background: var(--imperial-surface);
  text-align: left;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.lumio-template__selector-button:hover,
.lumio-template__action:hover,
.lumio-template__contact-card:hover {
  transform: translateY(-2px);
}

.lumio-template__selector-title {
  font-weight: 700;
}

.lumio-template__selector-meta {
  color: var(--imperial-copy-soft);
  font-size: 0.84rem;
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
  background: var(--template-color-primary);
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
  color: var(--imperial-copy-soft);
}

.lumio-template__contact-value {
  color: var(--template-text);
  font-size: 0.94rem;
  line-height: 1.6;
  word-break: break-word;
}

@media (min-width: 48rem) {
  .lumio-template__selector,
  .lumio-template__contact-grid,
  .lumio-template__stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 72rem) {
  .lumio-template__hero-grid {
    grid-template-columns: minmax(0, 1.08fr) 21rem;
    gap: 1.3rem;
  }

  .lumio-template__project-grid {
    grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
  }

  .lumio-template__grid--footer {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lumio-template__selector {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>