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

const otherProjects = computed(() => {
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
      key: 'whatsapp',
      label: 'WhatsApp',
      value: props.portfolio.contact.whatsapp,
      href: normalizeWhatsapp(props.portfolio.contact.whatsapp),
      icon: 'i-lucide-message-circle',
      external: true
    },
    {
      key: 'publicEmail',
      label: 'Email',
      value: props.portfolio.contact.publicEmail,
      href: props.portfolio.contact.publicEmail ? `mailto:${props.portfolio.contact.publicEmail}` : '',
      icon: 'i-lucide-mail',
      external: false
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: props.portfolio.contact.linkedin,
      href: normalizeWebsite(props.portfolio.contact.linkedin),
      icon: 'i-lucide-linkedin',
      external: true
    },
    {
      key: 'github',
      label: 'GitHub',
      value: props.portfolio.contact.github,
      href: normalizeWebsite(props.portfolio.contact.github),
      icon: 'i-lucide-github',
      external: true
    },
    {
      key: 'website',
      label: 'Website',
      value: props.portfolio.contact.website,
      href: normalizeWebsite(props.portfolio.contact.website),
      icon: 'i-lucide-globe',
      external: true
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
  <article class="overflow-hidden rounded-[32px] border border-black/10 bg-white/90 text-slate-950 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950 dark:text-white">
    <section class="px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_300px]">
        <div
          class="grid gap-6"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="soft">
              {{ themeName || 'Still Form' }}
            </UBadge>

            <UBadge
              :color="portfolio.settings.publicationStatus === 'published' ? 'success' : 'warning'"
              variant="soft"
            >
              {{ portfolio.settings.publicationStatus === 'published' ? 'Publicado' : 'Rascunho' }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/48">
              /{{ portfolio.settings.publicSlug }}
            </p>

            <h1 class="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {{ portfolio.hero.publicName }}
            </h1>

            <p class="max-w-3xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base">
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
              {{ skill }}
            </UBadge>
          </div>
        </div>

        <aside
          class="grid gap-4 self-start border-t border-black/10 pt-5 dark:border-white/10 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/48">
              Resumo
            </p>

            <div class="grid gap-3">
              <div
                v-for="stat in stats"
                :key="stat.label"
                class="flex items-center justify-between gap-3 border-b border-black/10 pb-3 last:border-b-0 last:pb-0 dark:border-white/10"
              >
                <span class="text-sm text-slate-600 dark:text-white/68">
                  {{ stat.label }}
                </span>

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
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black"
          >
            <UIcon :name="whatsappItem.icon" class="size-4.5" />
            WhatsApp
          </a>
        </aside>
      </div>
    </section>

    <div class="grid gap-0 border-t border-black/10 dark:border-white/10">
      <section class="grid gap-4 px-5 py-6 sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1.12fr)_320px] lg:px-9">
        <div
          class="space-y-4"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/48">
              Sobre
            </p>

            <h2 class="text-2xl font-semibold tracking-tight">
              Um template mais calmo, limpo e preciso.
            </h2>
          </div>

          <p class="max-w-3xl text-sm leading-7 text-slate-600 dark:text-white/68">
            {{ summary || 'O resumo profissional ainda não foi preenchido.' }}
          </p>
        </div>

        <div
          class="border-t border-black/10 pt-5 dark:border-white/10 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <UAlert
            icon="i-lucide-shield-check"
            color="neutral"
            variant="outline"
            title="Escopo atual"
            description="Sem avatar, sem CV, sem certificados e sem experiência cronológica."
          />
        </div>
      </section>

      <section class="grid gap-4 border-t border-black/10 px-5 py-6 sm:px-7 sm:py-7 xl:grid-cols-[minmax(0,1.15fr)_360px] lg:px-9 dark:border-white/10">
        <div
          class="space-y-5"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/48">
              Projeto principal
            </p>

            <template v-if="leadProject">
              <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                {{ leadProject.title }}
              </h2>

              <div class="flex flex-wrap gap-2">
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

              <p class="max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/68">
                {{ leadProject.summary }}
              </p>

              <a
                v-if="leadProject.link"
                :href="leadProject.link"
                target="_blank"
                rel="noreferrer noopener"
                class="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 px-5 text-sm font-semibold transition hover:-translate-y-0.5 dark:border-white/10"
              >
                <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
                Abrir projeto
              </a>
            </template>

            <template v-else>
              <p class="text-sm leading-7 text-slate-600 dark:text-white/68">
                Nenhum projeto público disponível no momento.
              </p>
            </template>
          </div>
        </div>

        <div
          class="grid gap-3 border-t border-black/10 pt-5 dark:border-white/10 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <article
            v-for="project in otherProjects"
            :key="project.id"
            class="space-y-2 border-b border-black/10 pb-4 last:border-b-0 last:pb-0 dark:border-white/10"
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

            <h3 class="text-lg font-semibold">
              {{ project.title }}
            </h3>

            <p class="text-sm leading-7 text-slate-600 dark:text-white/68">
              {{ project.summary }}
            </p>
          </article>
        </div>
      </section>

      <section class="grid gap-4 border-t border-black/10 px-5 py-6 sm:px-7 sm:py-7 lg:px-9 dark:border-white/10">
        <div
          class="space-y-2"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/48">
            Contato
          </p>

          <h2 class="text-2xl font-semibold tracking-tight">
            Canais públicos em uma estrutura mais silenciosa
          </h2>
        </div>

        <div
          class="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
          v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
        >
          <a
            v-for="item in primaryContacts"
            :key="item.key"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="group rounded-[24px] border border-black/10 bg-black/[0.02] p-4 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div class="flex items-start gap-3">
              <span class="inline-flex size-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-primary dark:border-white/10 dark:bg-black/20">
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