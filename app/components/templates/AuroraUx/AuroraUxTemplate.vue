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
  themeName: 'Aurora UX',
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
const extraContacts = computed(() => contactItems.value.slice(3))
</script>

<template>
  <article
    class="lumio-template lumio-template--aurora"
    :class="`lumio-template--mode-${props.templateMode}`"
    :style="themeVars"
  >
    <section class="lumio-template__hero">
      <div class="lumio-template__hero-grid">
        <div
          class="lumio-template__hero-main"
          v-reveal="{ distance: '14px', duration: 500 }"
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
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
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

          <div class="lumio-template__card">
            <p class="lumio-template__section-kicker">Resumo</p>
            <p class="lumio-template__copy lumio-template__copy--compact">
              {{ summary }}
            </p>
          </div>
        </aside>
      </div>
    </section>

    <div class="lumio-template__body">
      <section class="lumio-template__grid lumio-template__grid--intro">
        <article
          class="lumio-template__card"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">Direção</p>

          <h2 class="lumio-template__section-title">
            Preview isolado com hero amplo, leitura limpa e preset local.
          </h2>

          <p class="lumio-template__copy">
            Aurora UX fica como template-base mais claro do Lumio: direto, comercial e preparado
            para o fluxo público real sem contaminar o tema global do sistema.
          </p>
        </article>

        <article
          class="lumio-template__card"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <p class="lumio-template__section-kicker">Contato principal</p>

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

          <p
            v-else
            class="lumio-template__copy lumio-template__copy--compact"
          >
            Nenhum canal público foi informado ainda.
          </p>
        </article>
      </section>

      <section
        class="lumio-template__feature-shell"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__feature-header">
          <div>
            <p class="lumio-template__section-kicker">Projeto principal</p>
            <h2 class="lumio-template__section-title">Peça central da vitrine pública</h2>
          </div>

          <span
            v-if="secondaryProjects.length"
            class="lumio-template__support-count"
          >
            +{{ secondaryProjects.length }} projetos auxiliares
          </span>
        </div>

        <div class="lumio-template__feature-grid">
          <article
            v-if="leadProject"
            class="lumio-template__feature-card"
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
            class="lumio-template__project-list"
          >
            <article
              v-for="project in secondaryProjects"
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
          </div>
        </div>
      </section>

      <section
        class="lumio-template__card"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="lumio-template__feature-header">
          <div>
            <p class="lumio-template__section-kicker">Canais públicos</p>
            <h2 class="lumio-template__section-title">Grade pronta para integração futura</h2>
          </div>
        </div>

        <div
          v-if="contactItems.length"
          class="lumio-template__contact-grid"
        >
          <a
            v-for="item in contactItems"
            :key="`contact-${item.key}`"
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
          v-if="extraContacts.length"
          class="lumio-template__footnote"
        >
          {{ extraContacts.length }} canal(is) adicional(is) seguem disponíveis no conjunto completo.
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

.lumio-template--aurora {
  --aurora-surface: #ffffff;
  --aurora-surface-soft: rgba(255, 255, 255, 0.76);
  --aurora-surface-muted: rgba(15, 23, 42, 0.04);
  --aurora-border: rgba(15, 23, 42, 0.08);
  --aurora-copy: rgba(15, 23, 42, 0.72);
  --aurora-copy-soft: rgba(15, 23, 42, 0.52);
  border: 1px solid var(--aurora-border);
  border-radius: 2rem;
  overflow: hidden;
  background: var(--aurora-surface);
  box-shadow: 0 28px 90px -48px rgba(15, 23, 42, 0.18);
}

.lumio-template--aurora.lumio-template--mode-dark {
  --aurora-surface: #08111b;
  --aurora-surface-soft: rgba(8, 17, 27, 0.88);
  --aurora-surface-muted: rgba(255, 255, 255, 0.04);
  --aurora-border: rgba(255, 255, 255, 0.1);
  --aurora-copy: rgba(255, 255, 255, 0.74);
  --aurora-copy-soft: rgba(255, 255, 255, 0.52);
  box-shadow: 0 28px 90px -48px rgba(15, 23, 42, 0.42);
}

.lumio-template__hero {
  padding: 1.35rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--template-color-primary) 16%, transparent), transparent 45%),
    linear-gradient(180deg, var(--aurora-surface-soft), transparent);
  border-bottom: 1px solid var(--aurora-border);
}

.lumio-template__body {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background: var(--aurora-surface);
}

.lumio-template__hero-grid,
.lumio-template__grid,
.lumio-template__feature-grid,
.lumio-template__project-list,
.lumio-template__contact-grid,
.lumio-template__stat-grid,
.lumio-template__contact-stack {
  display: grid;
  gap: 1rem;
}

.lumio-template__hero-main,
.lumio-template__hero-side,
.lumio-template__card,
.lumio-template__feature-card,
.lumio-template__project-card,
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
  border: 1px solid var(--aurora-border);
  background: var(--aurora-surface-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.lumio-template__pill--primary,
.lumio-template__tag--highlight {
  color: color-mix(in srgb, var(--template-color-primary) 70%, var(--template-text));
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
.lumio-template__stat-label {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.lumio-template__slug {
  margin-top: 1rem;
  color: var(--aurora-copy-soft);
}

.lumio-template__section-kicker {
  color: var(--template-color-secondary);
}

.lumio-template__name {
  margin: 0.9rem 0 0;
  font-size: clamp(2.25rem, 5vw, 4.75rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.lumio-template__headline,
.lumio-template__copy,
.lumio-template__footnote {
  margin: 0.95rem 0 0;
  color: var(--aurora-copy);
  font-size: 0.97rem;
  line-height: 1.8;
}

.lumio-template__copy--compact {
  font-size: 0.92rem;
  line-height: 1.7;
}

.lumio-template__stat-card,
.lumio-template__card,
.lumio-template__feature-card,
.lumio-template__project-card,
.lumio-template__contact-card,
.lumio-template__feature-shell {
  padding: 1.05rem;
  border-radius: 1.6rem;
  border: 1px solid var(--aurora-border);
  background: var(--aurora-surface-muted);
}

.lumio-template__stat-value {
  display: block;
  margin-top: 0.55rem;
  font-size: 1.35rem;
  line-height: 1;
}

.lumio-template__feature-shell {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--template-color-primary) 6%, transparent), transparent),
    var(--aurora-surface-muted);
}

.lumio-template__feature-header {
  display: grid;
  gap: 0.8rem;
}

.lumio-template__support-count {
  color: var(--aurora-copy-soft);
  font-size: 0.9rem;
}

.lumio-template__section-title {
  margin: 0.55rem 0 0;
  font-size: clamp(1.45rem, 3vw, 2.25rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.lumio-template__project-title,
.lumio-template__project-card-title {
  margin: 0.85rem 0 0;
  font-size: 1.25rem;
  line-height: 1.18;
}

.lumio-template__project-card-title {
  font-size: 1.02rem;
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
  color: var(--aurora-copy-soft);
}

.lumio-template__contact-value {
  color: var(--template-text);
  font-size: 0.94rem;
  line-height: 1.6;
  word-break: break-word;
}

@media (min-width: 48rem) {
  .lumio-template__stat-grid,
  .lumio-template__contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .lumio-template__hero-grid {
    grid-template-columns: minmax(0, 1.08fr) 21rem;
    gap: 1.25rem;
  }

  .lumio-template__grid--intro {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lumio-template__feature-grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  }

  .lumio-template__contact-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .lumio-template__stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>