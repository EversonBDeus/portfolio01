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
const summary = computed(() => {
  return props.portfolio.about.summary.trim()
})

const skills = computed(() => {
  return props.portfolio.hero.skills.filter(Boolean).slice(0, 10)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter((project) => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const leadProject = computed(() => {
  return featuredProjects.value[0] ?? null
})

const secondaryProjects = computed(() => {
  return featuredProjects.value.slice(1, 5)
})

const stats = computed(() => {
  return [
    {
      label: 'Projetos',
      value: String(props.portfolio.projects.length)
    },
    {
      label: 'Destaques',
      value: String(props.portfolio.projects.filter((project) => project.featured).length)
    },
    {
      label: 'Skills',
      value: String(skills.value.length)
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

const topContacts = computed(() => {
  return contactItems.value.slice(0, 3)
})

const moreContacts = computed(() => {
  return contactItems.value.slice(3)
})
</script>

<template>
  <article class="surface-panel overflow-hidden rounded-[32px]">
    <section class="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_30%),linear-gradient(135deg,var(--ui-color-primary-500),var(--ui-color-secondary-500),var(--ui-color-tertiary-500))]" />
      <div class="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/30 dark:from-black/30 dark:to-black/45" />

      <div class="relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-end">
        <div
          class="grid gap-5 text-white"
          v-reveal="{ distance: '16px', duration: 550 }"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="solid">
              {{ themeName || 'Velvet Stage' }}
            </UBadge>

            <UBadge
              :color="portfolio.settings.publicationStatus === 'published' ? 'success' : 'warning'"
              variant="solid"
            >
              {{ portfolio.settings.publicationStatus === 'published' ? 'Publicado' : 'Rascunho' }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              /{{ portfolio.settings.publicSlug }}
            </p>

            <h1 class="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {{ portfolio.hero.publicName }}
            </h1>

            <p class="max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
              {{ portfolio.hero.headline }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-if="portfolio.hero.roleTitle"
              color="primary"
              variant="soft"
            >
              {{ portfolio.hero.roleTitle }}
            </UBadge>

            <UBadge
              v-if="portfolio.hero.location"
              color="neutral"
              variant="soft"
            >
              {{ portfolio.hero.location }}
            </UBadge>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="skill in skills"
              :key="skill"
              color="neutral"
              variant="soft"
            >
              {{ skill }}
            </UBadge>
          </div>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 90, distance: '16px', duration: 550 }"
        >
          <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="rounded-3xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                {{ stat.label }}
              </p>

              <p class="mt-2 text-2xl font-semibold">
                {{ stat.value }}
              </p>
            </div>
          </div>

          <div class="rounded-3xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
              Contato principal
            </p>

            <div class="mt-3 grid gap-2">
              <a
                v-for="item in topContacts"
                :key="item.key"
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noreferrer noopener' : undefined"
                class="rounded-2xl border border-white/12 bg-black/15 px-3 py-3 text-sm transition hover:-translate-y-0.5 hover:bg-black/20"
              >
                <span class="block text-white/60">
                  {{ item.label }}
                </span>

                <span class="mt-1 block break-all font-medium text-white">
                  {{ item.value }}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-4 p-4 sm:gap-5 sm:p-6">
      <section
        class="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]"
      >
        <div
          class="rounded-[28px] border border-default/50 bg-white/70 p-5 dark:bg-white/[0.04]"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <UBadge color="secondary" variant="soft">
                Sobre
              </UBadge>

              <UBadge color="neutral" variant="soft">
                Landing premium
              </UBadge>
            </div>

            <h2 class="text-2xl font-semibold tracking-tight">
              Uma apresentação mais vendável e mais “hero-first”.
            </h2>

            <p class="text-sm leading-7 text-muted">
              {{ summary || 'O resumo profissional ainda não foi preenchido.' }}
            </p>
          </div>
        </div>

        <div
          class="rounded-[28px] border border-default/50 bg-white/70 p-5 dark:bg-white/[0.04]"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft">
                Escopo
              </UBadge>
            </div>

            <UAlert
              icon="i-lucide-shield-check"
              color="neutral"
              variant="outline"
              title="Pronto para o fluxo atual"
              description="Sem avatar, sem CV, sem certificados e sem experiência cronológica."
            />

            <p class="text-sm leading-7 text-muted">
              Ideal para validar estética, hierarquia e impacto visual antes de integrar no fluxo público real.
            </p>
          </div>
        </div>
      </section>

      <section
        v-if="leadProject"
        class="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]"
      >
        <div
          class="rounded-[28px] border border-default/50 bg-gradient-to-br from-black/[0.04] via-transparent to-black/[0.02] p-5 dark:from-white/[0.05] dark:to-white/[0.02]"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft">
                Projeto principal
              </UBadge>

              <UBadge color="neutral" variant="soft">
                {{ leadProject.category }}
              </UBadge>

              <UBadge
                v-if="leadProject.featured"
                color="success"
                variant="soft"
              >
                Destaque
              </UBadge>
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                {{ leadProject.title }}
              </h2>

              <p class="max-w-2xl text-sm leading-7 text-muted">
                {{ leadProject.summary }}
              </p>
            </div>

            <a
              v-if="leadProject.link"
              :href="leadProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black"
            >
              Ver projeto em destaque
            </a>
          </div>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 80, distance: '14px', duration: 500 }"
        >
          <article
            v-for="(project, index) in secondaryProjects"
            :key="project.id"
            class="rounded-3xl border border-default/50 bg-white/70 p-4 dark:bg-white/[0.04]"
            v-reveal="{ delay: 100 + (index * 50), distance: '12px', duration: 450 }"
          >
            <div class="flex flex-wrap gap-2">
              <UBadge color="neutral" variant="soft">
                {{ project.category }}
              </UBadge>

              <UBadge
                v-if="project.featured"
                color="success"
                variant="soft"
              >
                Destaque
              </UBadge>
            </div>

            <h3 class="mt-3 text-lg font-semibold">
              {{ project.title }}
            </h3>

            <p class="mt-2 text-sm leading-7 text-muted">
              {{ project.summary }}
            </p>

            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noreferrer noopener"
              class="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Abrir projeto
            </a>
          </article>
        </div>
      </section>

      <section
        class="rounded-[30px] border border-default/50 bg-white/70 p-5 dark:bg-white/[0.04]"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex flex-wrap gap-2">
              <UBadge color="secondary" variant="soft">
                Conexão
              </UBadge>

              <UBadge color="neutral" variant="soft">
                CTA público
              </UBadge>
            </div>

            <h2 class="text-2xl font-semibold tracking-tight">
              Vamos conversar sobre produto, interface e execução.
            </h2>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <a
            v-for="item in contactItems"
            :key="item.key"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="rounded-3xl border border-default/50 bg-black/[0.02] p-4 transition hover:-translate-y-0.5 dark:bg-black/20"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {{ item.label }}
            </p>

            <p class="mt-2 break-all text-sm font-medium">
              {{ item.value }}
            </p>
          </a>
        </div>

        <div
          v-if="moreContacts.length"
          class="mt-4 flex flex-wrap gap-2"
        >
          <UBadge
            v-for="item in moreContacts"
            :key="`extra-${item.key}`"
            color="neutral"
            variant="soft"
          >
            {{ item.label }}
          </UBadge>
        </div>
      </section>
    </div>
  </article>
</template>