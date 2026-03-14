<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
  themeName: 'Imperial Arc',
  templatePresetId: null,
  templateMode: 'dark'
})

const { themeVars } = usePortfolioTemplateTheme(() => props.templatePresetId)

const publicName = computed(() => {
  return props.portfolio.hero.publicName.trim() || 'Perfil público'
})

const headline = computed(() => {
  return props.portfolio.hero.headline.trim() || 'Apresentação pública com presença editorial, contraste refinado e leitura premium.'
})

const summary = computed(() => {
  return props.portfolio.about.summary.trim() || 'O resumo profissional ainda não foi preenchido.'
})

const roleTitle = computed(() => props.portfolio.hero.roleTitle.trim())
const location = computed(() => props.portfolio.hero.location.trim())

const crestLetters = computed(() => {
  const parts = publicName.value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)

  const initials = parts.map((part) => part[0]?.toUpperCase() ?? '').join('')
  return initials || 'LP'
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

const projectTabs = computed(() => featuredProjects.value.slice(0, 5))
const selectedProjectIndex = ref(0)

watch(projectTabs, (items) => {
  if (!items.length) {
    selectedProjectIndex.value = 0
    return
  }

  if (selectedProjectIndex.value > items.length - 1) {
    selectedProjectIndex.value = 0
  }
}, { immediate: true })

const selectedProject = computed(() => {
  return projectTabs.value[selectedProjectIndex.value] ?? projectTabs.value[0] ?? null
})

const secondaryProjects = computed(() => {
  return featuredProjects.value
    .filter((project) => project.id !== selectedProject.value?.id)
    .slice(0, 3)
})

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

const primaryContacts = computed(() => contactItems.value.slice(0, 3))
</script>

<template>
  <article
    class="lumio-template lumio-template--imperial-arc"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <header class="lumio-template__topbar">
      <div class="lumio-template__crest-wrap">
        <div class="lumio-template__crest">
          <span>{{ crestLetters }}</span>
        </div>

        <div class="lumio-template__crest-divider" />
      </div>

      <div class="lumio-template__topbar-badges">
        <UBadge class="lumio-template__badge lumio-template__badge--status">
          Público
        </UBadge>

        <UBadge class="lumio-template__badge lumio-template__badge--mode">
          {{ props.templateMode === 'dark' ? 'Escuro' : 'Claro' }}
        </UBadge>
      </div>
    </header>

    <section class="lumio-template__hero-shell">
      <div
        class="lumio-template__hero-main"
        v-reveal="{ distance: '18px', duration: 540 }"
      >
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

        <div class="lumio-template__hero-badges">
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
        v-reveal="{ delay: 70, distance: '18px', duration: 540 }"
      >
        <article class="lumio-template__bio-card">
          <p class="lumio-template__section-kicker">
            Sobre
          </p>

          <p class="lumio-template__copy">
            {{ summary }}
          </p>
        </article>

        <div class="lumio-template__stat-grid">
          <article
            v-for="stat in stats"
            :key="stat.label"
            class="lumio-template__stat-card"
          >
            <p class="lumio-template__stat-label">{{ stat.label }}</p>
            <strong class="lumio-template__stat-value">{{ stat.value }}</strong>
          </article>
        </div>
      </aside>
    </section>

    <div class="lumio-template__body">
      <section
        class="lumio-template__gallery-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__gallery-head">
          <div>
            <p class="lumio-template__section-kicker">
              Projetos
            </p>

            <h2 class="lumio-template__section-title">
              {{ selectedProject ? selectedProject.title : 'Projetos em destaque' }}
            </h2>
          </div>

          <div
            v-if="selectedProject"
            class="lumio-template__gallery-badges"
          >
            <UBadge class="lumio-template__badge lumio-template__badge--soft">
              {{ selectedProject.category || 'Projeto selecionado' }}
            </UBadge>

            <UBadge
              v-if="selectedProject.featured"
              class="lumio-template__badge lumio-template__badge--highlight"
            >
              Destaque
            </UBadge>
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
          </button>
        </div>

        <div class="lumio-template__gallery-stage">
          <div class="lumio-template__gallery-copy">
            <p
              v-if="selectedProject"
              class="lumio-template__copy"
            >
              {{ selectedProject.summary || 'Projeto ainda sem descrição pública.' }}
            </p>

            <p
              v-else
              class="lumio-template__copy lumio-template__copy--muted"
            >
              Galeria vazia. Nenhum projeto público finalizado para exibição no momento.
            </p>
          </div>

          <div class="lumio-template__gallery-previews">
            <div class="lumio-template__preview-card lumio-template__preview-card--primary">
              <div class="lumio-template__preview-topbar">
                <span />
                <span />
                <span />
              </div>

              <div class="lumio-template__preview-layout lumio-template__preview-layout--primary">
                <div class="lumio-template__preview-block lumio-template__preview-block--hero" />
                <div class="lumio-template__preview-block lumio-template__preview-block--text" />
                <div class="lumio-template__preview-block lumio-template__preview-block--text short" />
                <div class="lumio-template__preview-block lumio-template__preview-block--card" />
              </div>
            </div>

            <div class="lumio-template__preview-card">
              <div class="lumio-template__preview-layout">
                <div class="lumio-template__preview-block lumio-template__preview-block--frame" />
              </div>
            </div>

            <div class="lumio-template__preview-card">
              <div class="lumio-template__preview-layout">
                <div class="lumio-template__preview-block lumio-template__preview-block--frame" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="selectedProject"
          class="lumio-template__gallery-footer"
        >
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
        </div>

        <div
          v-if="!selectedProject"
          class="lumio-template__empty-strip"
        >
          <p class="lumio-template__copy">
            Nenhum projeto público disponível no momento.
          </p>
        </div>
      </section>

      <div class="lumio-template__lower-grid">
        <section
          class="lumio-template__panel lumio-template__panel--about"
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

          <div
            v-if="secondaryProjects.length"
            class="lumio-template__secondary-projects"
          >
            <article
              v-for="project in secondaryProjects"
              :key="project.id"
              class="lumio-template__secondary-project"
            >
              <UBadge class="lumio-template__badge lumio-template__badge--outline">
                {{ project.category || 'Projeto selecionado' }}
              </UBadge>

              <h3 class="lumio-template__project-card-title">
                {{ project.title }}
              </h3>
            </article>
          </div>
        </section>

        <section
          class="lumio-template__panel lumio-template__panel--contacts"
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

          <p
            v-else
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

.lumio-template--imperial-arc {
  position: relative;
  border: 1px solid color-mix(in srgb, var(--template-border) 92%, transparent);
  border-radius: 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 16%, transparent), transparent 24%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 10%, transparent), transparent 22%),
    linear-gradient(180deg, #09111b 0%, #0b1420 100%);
  box-shadow:
    0 40px 120px -62px rgba(2, 6, 23, 0.72),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.lumio-template--mode-light {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent 24%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--template-color-secondary) 8%, transparent), transparent 22%),
    linear-gradient(180deg, #f9f7fb 0%, #fdfcff 100%);
  box-shadow:
    0 32px 96px -62px rgba(15, 23, 42, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.38);
}

.lumio-template__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--template-border) 82%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 78%, rgba(8, 15, 24, 0.92));
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.02);
}

.lumio-template--mode-light .lumio-template__topbar {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 6%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 86%, #ffffff);
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.26);
}

.lumio-template__crest-wrap,
.lumio-template__topbar-badges,
.lumio-template__hero-badges,
.lumio-template__gallery-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.lumio-template__crest {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 1rem;
  border: 1px solid color-mix(in srgb, var(--template-color-primary) 24%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 18%, transparent), transparent 58%),
    color-mix(in srgb, var(--template-surface-elevated) 84%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 14px 26px -20px rgba(0, 0, 0, 0.38);
}

.lumio-template__crest span {
  font-family: var(--template-font-heading);
  font-size: 1.55rem;
  line-height: 1;
  color: var(--template-hero-text);
  letter-spacing: -0.06em;
}

.lumio-template--mode-light .lumio-template__crest span {
  color: color-mix(in srgb, var(--template-color-secondary) 30%, #1f2937);
}

.lumio-template__crest-divider {
  width: 1px;
  height: 2.2rem;
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--template-border) 94%, transparent), transparent);
}

.lumio-template__badge {
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lumio-template__badge--status {
  color: var(--template-hero-text);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--template-color-primary) 26%, transparent), color-mix(in srgb, var(--template-color-secondary) 18%, transparent)),
    color-mix(in srgb, var(--template-surface-elevated) 84%, rgba(255, 255, 255, 0.03));
}

.lumio-template__badge--mode,
.lumio-template__badge--outline {
  color: var(--template-text-muted);
  background: color-mix(in srgb, var(--template-surface) 78%, transparent);
}

.lumio-template__badge--soft {
  color: var(--template-text);
  background: color-mix(in srgb, var(--template-color-primary) 12%, var(--template-surface-elevated));
}

.lumio-template__badge--highlight {
  color: var(--template-hero-text);
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__hero-shell {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--template-border) 82%, transparent);
}

.lumio-template__hero-main,
.lumio-template__hero-side,
.lumio-template__bio-card,
.lumio-template__stat-card,
.lumio-template__gallery-shell,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__secondary-project,
.lumio-template__empty-strip {
  min-width: 0;
}

.lumio-template__hero-main {
  display: grid;
  gap: 1rem;
  align-content: start;
  padding: 1.15rem 1.2rem;
  border-radius: 1.75rem;
  border: 1px solid color-mix(in srgb, var(--template-color-primary) 18%, transparent);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 12%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface-elevated) 82%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 28px 58px -44px rgba(2, 6, 23, 0.44);
}

.lumio-template--mode-light .lumio-template__hero-main {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    0 22px 48px -42px rgba(15, 23, 42, 0.14);
}

.lumio-template__hero-side {
  display: grid;
  gap: 1rem;
  align-content: start;
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
  font-size: clamp(3rem, 7vw, 6rem);
  line-height: 0.92;
  letter-spacing: -0.065em;
  color: var(--template-hero-text);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.08);
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
.lumio-template__contact-value,
.lumio-template__selector-title {
  margin: 0;
  color: var(--template-text);
  line-height: 1.8;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.lumio-template--mode-light .lumio-template__headline,
.lumio-template--mode-light .lumio-template__copy,
.lumio-template--mode-light .lumio-template__contact-value,
.lumio-template--mode-light .lumio-template__selector-title {
  color: color-mix(in srgb, var(--template-text) 84%, #475569);
}

.lumio-template__headline {
  max-width: 34ch;
  font-size: 1.02rem;
}

.lumio-template__copy--compact,
.lumio-template__copy--muted {
  font-size: 0.92rem;
  line-height: 1.68;
}

.lumio-template__copy--muted {
  color: var(--template-text-muted);
}

.lumio-template__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lumio-template__skill {
  display: inline-flex;
  align-items: center;
  min-height: 2.2rem;
  padding: 0.5rem 0.82rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  background: color-mix(in srgb, var(--template-surface) 74%, transparent);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--template-text);
}

.lumio-template__bio-card,
.lumio-template__stat-card,
.lumio-template__gallery-shell,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__secondary-project,
.lumio-template__empty-strip {
  border-radius: 1.6rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 84%, rgba(255, 255, 255, 0.02));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 24px 58px -46px rgba(2, 6, 23, 0.42);
}

.lumio-template--mode-light .lumio-template__bio-card,
.lumio-template--mode-light .lumio-template__stat-card,
.lumio-template--mode-light .lumio-template__gallery-shell,
.lumio-template--mode-light .lumio-template__panel,
.lumio-template--mode-light .lumio-template__contact-card,
.lumio-template--mode-light .lumio-template__secondary-project,
.lumio-template--mode-light .lumio-template__empty-strip {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.32),
    0 18px 46px -42px rgba(15, 23, 42, 0.12);
}

.lumio-template__bio-card,
.lumio-template__stat-card,
.lumio-template__gallery-shell,
.lumio-template__panel,
.lumio-template__contact-card,
.lumio-template__secondary-project,
.lumio-template__empty-strip {
  padding: 1.05rem;
}

.lumio-template__stat-grid,
.lumio-template__contact-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__stat-card {
  position: relative;
  overflow: hidden;
}

.lumio-template__stat-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: linear-gradient(180deg, var(--template-color-primary), var(--template-color-secondary));
}

.lumio-template__section-kicker,
.lumio-template__contact-label,
.lumio-template__stat-label,
.lumio-template__selector-meta {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--template-text-muted);
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.38rem;
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

.lumio-template__gallery-shell {
  display: grid;
  gap: 1rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 8%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface) 86%, rgba(255, 255, 255, 0.02));
}

.lumio-template--mode-light .lumio-template__gallery-shell {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 5%, transparent), transparent 52%),
    color-mix(in srgb, var(--template-surface-elevated) 88%, #ffffff);
}

.lumio-template__gallery-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.lumio-template__section-title {
  margin-top: 0.45rem;
  font-size: clamp(1.55rem, 3vw, 2.34rem);
  line-height: 1.06;
  letter-spacing: -0.045em;
}

.lumio-template__section-title--compact {
  font-size: clamp(1.12rem, 2vw, 1.52rem);
}

.lumio-template__selector {
  display: grid;
  gap: 0.9rem;
}

.lumio-template__selector-button {
  display: grid;
  gap: 0.25rem;
  padding: 0.9rem 1rem;
  border-radius: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 86%, transparent);
  background: color-mix(in srgb, var(--template-surface) 72%, transparent);
  text-align: left;
  min-width: 0;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.lumio-template__selector-button--active {
  border-color: color-mix(in srgb, var(--template-color-primary) 28%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 10%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 82%, rgba(255, 255, 255, 0.03));
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--template-color-primary) 16%, transparent),
    0 14px 28px -24px rgba(0, 0, 0, 0.3);
}

.lumio-template__gallery-stage {
  display: grid;
  gap: 1.2rem;
  align-items: center;
}

.lumio-template__gallery-copy {
  display: grid;
  gap: 0.7rem;
}

.lumio-template__gallery-previews {
  display: grid;
  gap: 0.95rem;
}

.lumio-template__preview-card {
  padding: 0.75rem;
  border-radius: 1.3rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 88%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 3%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 78%, rgba(255, 255, 255, 0.03));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 18px 36px -30px rgba(2, 6, 23, 0.42);
}

.lumio-template--mode-light .lumio-template__preview-card {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 2%, transparent), transparent),
    color-mix(in srgb, var(--template-surface-elevated) 90%, #ffffff);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    0 14px 30px -28px rgba(15, 23, 42, 0.12);
}

.lumio-template__preview-card--primary {
  min-height: 10.5rem;
}

.lumio-template__preview-topbar {
  display: flex;
  gap: 0.42rem;
  margin-bottom: 0.7rem;
}

.lumio-template__preview-topbar span {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--template-text-muted) 48%, transparent);
}

.lumio-template__preview-layout {
  display: grid;
  gap: 0.6rem;
  height: 100%;
}

.lumio-template__preview-layout--primary {
  grid-template-columns: 1.12fr 0.88fr;
  align-items: start;
}

.lumio-template__preview-block {
  border-radius: 0.9rem;
  border: 1px solid color-mix(in srgb, var(--template-border) 84%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 4%, transparent), transparent),
    color-mix(in srgb, var(--template-surface) 86%, rgba(255, 255, 255, 0.02));
}

.lumio-template__preview-block--hero {
  min-height: 5.2rem;
}

.lumio-template__preview-block--text {
  min-height: 1rem;
}

.lumio-template__preview-block--text.short {
  width: 72%;
}

.lumio-template__preview-block--card {
  min-height: 3.2rem;
  grid-column: 2;
}

.lumio-template__preview-block--frame {
  min-height: 8.8rem;
}

.lumio-template__gallery-footer {
  display: flex;
  justify-content: flex-start;
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
  border-radius: 999px;
  background: linear-gradient(90deg, var(--template-color-primary), var(--template-color-secondary));
  color: var(--template-hero-text);
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 18px 34px -24px color-mix(in srgb, var(--template-color-primary) 56%, transparent);
}

.lumio-template__empty-strip {
  padding-top: 0.9rem;
  padding-bottom: 0.9rem;
}

.lumio-template__lower-grid {
  display: grid;
  gap: 1rem;
}

.lumio-template__panel {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__secondary-projects {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__secondary-project {
  display: grid;
  gap: 0.55rem;
}

.lumio-template__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 0.82rem;
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
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 16%, transparent), color-mix(in srgb, var(--template-color-secondary) 10%, transparent)),
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
  .lumio-template__selector-button:hover,
  .lumio-template__action:hover,
  .lumio-template__contact-card:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 767px) {
  .lumio-template__topbar,
  .lumio-template__hero-shell,
  .lumio-template__body {
    padding: 0.82rem;
  }

  .lumio-template__crest {
    width: 2.8rem;
    height: 2.8rem;
  }

  .lumio-template__name {
    font-size: clamp(2.2rem, 12vw, 3.6rem);
  }

  .lumio-template__headline {
    max-width: none;
  }

  .lumio-template__gallery-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .lumio-template__hero-main,
  .lumio-template__bio-card,
  .lumio-template__stat-card,
  .lumio-template__gallery-shell,
  .lumio-template__panel,
  .lumio-template__contact-card,
  .lumio-template__secondary-project,
  .lumio-template__empty-strip {
    padding: 0.95rem;
  }

  .lumio-template__preview-card--primary {
    min-height: 8.6rem;
  }

  .lumio-template__preview-layout--primary {
    grid-template-columns: 1fr;
  }

  .lumio-template__preview-block--card {
    grid-column: auto;
  }
}

@media (min-width: 900px) {
  .lumio-template__hero-shell {
    grid-template-columns: minmax(0, 1.18fr) minmax(340px, 0.82fr);
    align-items: start;
  }

  .lumio-template__stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lumio-template__selector {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .lumio-template__gallery-stage {
    grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.28fr);
  }

  .lumio-template__gallery-previews {
    grid-template-columns: 1.08fr 0.96fr 0.96fr;
    align-items: stretch;
  }

  .lumio-template__lower-grid {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>