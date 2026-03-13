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

const skills = computed(() => {
  return props.portfolio.hero.skills.filter(Boolean).slice(0, 8)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter((project) => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const leadProject = computed(() => {
  return featuredProjects.value[0] ?? null
})

const remainingProjects = computed(() => {
  return featuredProjects.value.slice(1, 4)
})

const stats = computed(() => {
  return [
    {
      label: 'Projetos',
      value: String(props.portfolio.projects.length),
      icon: 'i-lucide-folder-kanban'
    },
    {
      label: 'Destaques',
      value: String(props.portfolio.projects.filter((project) => project.featured).length),
      icon: 'i-lucide-badge-check'
    },
    {
      label: 'Skills',
      value: String(skills.value.length),
      icon: 'i-lucide-sparkles'
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
      key: 'whatsapp',
      label: 'WhatsApp',
      value: props.portfolio.contact.whatsapp,
      href: normalizeWhatsapp(props.portfolio.contact.whatsapp),
      icon: 'i-lucide-message-circle',
      external: true,
      featured: true
    },
    {
      key: 'publicEmail',
      label: 'Email',
      value: props.portfolio.contact.publicEmail,
      href: props.portfolio.contact.publicEmail ? `mailto:${props.portfolio.contact.publicEmail}` : '',
      icon: 'i-lucide-mail',
      external: false,
      featured: false
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: props.portfolio.contact.linkedin,
      href: normalizeWebsite(props.portfolio.contact.linkedin),
      icon: 'i-lucide-linkedin',
      external: true,
      featured: false
    },
    {
      key: 'github',
      label: 'GitHub',
      value: props.portfolio.contact.github,
      href: normalizeWebsite(props.portfolio.contact.github),
      icon: 'i-lucide-github',
      external: true,
      featured: false
    },
    {
      key: 'website',
      label: 'Website',
      value: props.portfolio.contact.website,
      href: normalizeWebsite(props.portfolio.contact.website),
      icon: 'i-lucide-globe',
      external: true,
      featured: false
    }
  ].filter((item) => item.value && item.href)
})

const whatsappItem = computed(() => {
  return contactItems.value.find((item) => item.key === 'whatsapp') ?? null
})

const primaryContacts = computed(() => {
  return contactItems.value.slice(0, 4)
})
</script>

<template>
  <article class="overflow-hidden rounded-[32px] border border-black/10 bg-white/85 text-slate-950 shadow-[0_30px_90px_-42px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950 dark:text-white">
    <section class="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.42),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.32),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_48%)]" />

      <div class="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:items-end">
        <div
          class="grid gap-5"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="soft">
              {{ themeName || 'Quiet Frame' }}
            </UBadge>

            <UBadge
              :color="portfolio.settings.publicationStatus === 'published' ? 'success' : 'warning'"
              variant="soft"
            >
              {{ portfolio.settings.publicationStatus === 'published' ? 'Publicado' : 'Rascunho' }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/52">
              /{{ portfolio.settings.publicSlug }}
            </p>

            <h1 class="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {{ portfolio.hero.publicName }}
            </h1>

            <p class="max-w-3xl text-sm leading-7 text-slate-600 dark:text-white/70 sm:text-base">
              {{ portfolio.hero.headline }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-if="portfolio.hero.roleTitle"
              color="primary"
              variant="soft"
            >
              <template #leading>
                <UIcon name="i-lucide-briefcase-business" class="size-3.5" />
              </template>
              {{ portfolio.hero.roleTitle }}
            </UBadge>

            <UBadge
              v-if="portfolio.hero.location"
              color="neutral"
              variant="soft"
            >
              <template #leading>
                <UIcon name="i-lucide-map-pin" class="size-3.5" />
              </template>
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
              <template #leading>
                <UIcon name="i-lucide-sparkles" class="size-3.5" />
              </template>
              {{ skill }}
            </UBadge>
          </div>
        </div>

        <aside
          class="grid gap-3"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <div class="rounded-[28px] border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
              Resumo rápido
            </p>

            <div class="mt-4 grid gap-3">
              <div
                v-for="stat in stats"
                :key="stat.label"
                class="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-black/20"
              >
                <div class="flex items-center gap-2">
                  <UIcon :name="stat.icon" class="size-4 text-primary" />
                  <span class="text-sm font-medium">
                    {{ stat.label }}
                  </span>
                </div>

                <span class="text-lg font-semibold">
                  {{ stat.value }}
                </span>
              </div>
            </div>
          </div>

          <a
            v-if="whatsappItem"
            :href="whatsappItem.href"
            :target="whatsappItem.external ? '_blank' : undefined"
            :rel="whatsappItem.external ? 'noreferrer noopener' : undefined"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            <UIcon :name="whatsappItem.icon" class="size-4.5" />
            Entrar em contato
          </a>
        </aside>
      </div>
    </section>

    <div class="grid gap-4 p-4 sm:gap-5 sm:p-6">
      <section class="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_320px]">
        <div
          class="rounded-[30px] border border-black/10 bg-white/78 p-5 dark:border-white/10 dark:bg-white/[0.04]"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <UBadge color="secondary" variant="soft">
                Sobre
              </UBadge>

              <UBadge color="neutral" variant="soft">
                Minimal premium
              </UBadge>
            </div>

            <h2 class="text-2xl font-semibold tracking-tight">
              Clareza visual, menos ruído e leitura mais elegante.
            </h2>

            <p class="max-w-3xl text-sm leading-7 text-slate-600 dark:text-white/70">
              {{ summary || 'O resumo profissional ainda não foi preenchido.' }}
            </p>
          </div>
        </div>

        <div
          class="rounded-[30px] border border-black/10 bg-white/78 p-5 dark:border-white/10 dark:bg-white/[0.04]"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <div class="space-y-3">
            <UBadge color="neutral" variant="soft">
              Escopo atual
            </UBadge>

            <UAlert
              icon="i-lucide-shield-check"
              color="neutral"
              variant="outline"
              title="Preview limpo"
              description="Sem avatar, sem CV, sem certificados e sem experiência cronológica."
            />
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_360px]">
        <div
          class="rounded-[30px] border border-black/10 bg-white/78 p-5 dark:border-white/10 dark:bg-white/[0.04]"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <template v-if="leadProject">
            <div class="mb-4 flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft">
                Projeto principal
              </UBadge>

              <UBadge color="neutral" variant="soft">
                <template #leading>
                  <UIcon name="i-lucide-layout-template" class="size-3.5" />
                </template>
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

            <div class="space-y-3">
              <h2 class="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                {{ leadProject.title }}
              </h2>

              <p class="max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/70">
                {{ leadProject.summary }}
              </p>
            </div>

            <a
              v-if="leadProject.link"
              :href="leadProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black"
            >
              <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
              Abrir projeto
            </a>
          </template>

          <template v-else>
            <p class="text-sm leading-7 text-slate-600 dark:text-white/70">
              Nenhum projeto público disponível no momento.
            </p>
          </template>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <article
            v-for="project in remainingProjects"
            :key="project.id"
            class="rounded-3xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-2">
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

                <h3 class="text-lg font-semibold">
                  {{ project.title }}
                </h3>
              </div>

              <span class="inline-flex size-10 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-primary dark:border-white/10 dark:bg-black/20">
                <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
              </span>
            </div>

            <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-white/68">
              {{ project.summary }}
            </p>
          </article>
        </div>
      </section>

      <section
        class="rounded-[30px] border border-black/10 bg-white/78 p-5 dark:border-white/10 dark:bg-white/[0.04]"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex flex-wrap gap-2">
              <UBadge color="secondary" variant="soft">
                Contato
              </UBadge>

              <UBadge color="neutral" variant="soft">
                Canais públicos
              </UBadge>
            </div>

            <h2 class="text-2xl font-semibold tracking-tight">
              Contato direto com leitura limpa
            </h2>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <a
            v-for="item in primaryContacts"
            :key="item.key"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="group rounded-3xl border border-black/10 bg-black/[0.03] p-4 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-black/20"
          >
            <div class="flex items-start gap-3">
              <span class="inline-flex size-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-primary dark:border-white/10 dark:bg-white/[0.06]">
                <UIcon :name="item.icon" class="size-4.5" />
              </span>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold">
                  {{ item.label }}
                </p>

                <p class="mt-1 break-all text-sm text-slate-600 dark:text-white/68">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>
  </article>
</template>