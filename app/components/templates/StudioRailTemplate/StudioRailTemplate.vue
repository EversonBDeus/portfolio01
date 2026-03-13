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

const profileAccordionItems = computed(() => {
  return [
    {
      label: 'Posicionamento público',
      icon: 'i-lucide-badge-info',
      content: props.portfolio.hero.headline || 'Sem headline pública definida.'
    },
    {
      label: 'Resumo profissional',
      icon: 'i-lucide-file-text',
      content: summary.value || 'Sem resumo profissional no momento.'
    },
    {
      label: 'Stack principal',
      icon: 'i-lucide-layers-3',
      content: skills.value.length ? skills.value.join(' • ') : 'Sem habilidades públicas visíveis.'
    }
  ]
})
</script>

<template>
  <article class="overflow-hidden rounded-[30px] border border-black/10 bg-white/75 text-slate-900 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:bg-neutral-950 dark:text-white">
    <div class="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
      <aside class="border-b border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03] lg:border-b-0 lg:border-r">
        <div class="grid gap-5">
          <div
            class="grid gap-3"
            v-reveal="{ distance: '14px', duration: 500 }"
          >
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft">
                {{ themeName || 'Studio Rail' }}
              </UBadge>

              <UBadge
                :color="portfolio.settings.publicationStatus === 'published' ? 'success' : 'warning'"
                variant="soft"
              >
                {{ portfolio.settings.publicationStatus === 'published' ? 'Publicado' : 'Rascunho' }}
              </UBadge>
            </div>

            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-white/55">
                /{{ portfolio.settings.publicSlug }}
              </p>

              <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                {{ portfolio.hero.publicName }}
              </h1>

              <p class="text-sm leading-7 text-slate-600 dark:text-white/70">
                {{ portfolio.hero.roleTitle || 'Portfolio Público' }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-if="portfolio.hero.location"
                color="neutral"
                variant="soft"
              >
                {{ portfolio.hero.location }}
              </UBadge>
            </div>
          </div>

          <div
            class="grid gap-3"
            v-reveal="{ delay: 60, distance: '14px', duration: 500 }"
          >
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="rounded-2xl border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/50">
                {{ stat.label }}
              </p>

              <p class="mt-2 text-2xl font-semibold">
                {{ stat.value }}
              </p>
            </div>
          </div>

          <div
            class="grid gap-2"
            v-reveal="{ delay: 100, distance: '14px', duration: 500 }"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
              Skills públicas
            </p>

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
        </div>
      </aside>

      <main class="border-b border-black/10 p-5 dark:border-white/10 lg:border-b-0">
        <div class="grid gap-5">
          <section
            class="rounded-[26px] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]"
            v-reveal="{ distance: '14px', duration: 500 }"
          >
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <UBadge color="secondary" variant="soft">
                  Hero
                </UBadge>

                <UBadge color="neutral" variant="soft">
                  Layout com rail lateral
                </UBadge>
              </div>

              <h2 class="text-2xl font-semibold tracking-tight">
                {{ portfolio.hero.headline }}
              </h2>

              <p class="max-w-3xl text-sm leading-7 text-slate-600 dark:text-white/70">
                {{ summary || 'O resumo profissional ainda não foi preenchido.' }}
              </p>
            </div>
          </section>

          <section
            class="rounded-[26px] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]"
            v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
          >
            <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-1">
                <h2 class="text-xl font-semibold">
                  Projetos em destaque
                </h2>

                <p class="text-sm text-slate-600 dark:text-white/65">
                  Estrutura com cards mais editoriais e leitura guiada.
                </p>
              </div>

              <UBadge color="primary" variant="soft">
                {{ featuredProjects.length }} exibidos
              </UBadge>
            </div>

            <div class="grid gap-4 xl:grid-cols-2">
              <article
                v-for="(project, index) in featuredProjects"
                :key="project.id"
                class="rounded-3xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-black/20"
                v-reveal="{ delay: 90 + (index * 50), distance: '14px', duration: 500 }"
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

                <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-white/70">
                  {{ project.summary }}
                </p>

                <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  rel="noreferrer noopener"
                  class="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Ver projeto
                </a>
              </article>
            </div>
          </section>
        </div>
      </main>

      <aside class="p-5">
        <div class="grid gap-5">
          <section
            class="rounded-[26px] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]"
            v-reveal="{ delay: 40, distance: '14px', duration: 500 }"
          >
            <div class="space-y-3">
              <div class="space-y-1">
                <UBadge color="primary" variant="soft">
                  Contato
                </UBadge>

                <h2 class="text-xl font-semibold">
                  Canais públicos
                </h2>
              </div>

              <UAlert
                icon="i-lucide-shield-check"
                color="neutral"
                variant="outline"
                title="Escopo atual"
                description="Sem avatar, sem CV, sem certificados e sem experiência cronológica."
              />
            </div>
          </section>

          <section
            class="rounded-[26px] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]"
            v-reveal="{ delay: 80, distance: '14px', duration: 500 }"
          >
            <div class="grid gap-3">
              <a
                v-for="item in contactItems"
                :key="item.key"
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noreferrer noopener' : undefined"
                class="rounded-2xl border border-black/10 bg-black/[0.02] p-4 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-black/20"
              >
                <p class="text-sm font-semibold">
                  {{ item.label }}
                </p>

                <p class="mt-1 break-all text-sm text-slate-600 dark:text-white/65">
                  {{ item.value }}
                </p>
              </a>
            </div>
          </section>

          <section
            class="rounded-[26px] border border-black/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]"
            v-reveal="{ delay: 120, distance: '14px', duration: 500 }"
          >
            <div class="space-y-3">
              <div class="space-y-1">
                <UBadge color="secondary" variant="soft">
                  Perfil
                </UBadge>

                <h2 class="text-xl font-semibold">
                  Leitura detalhada
                </h2>
              </div>

              <UAccordion
                :items="profileAccordionItems"
                :ui="{
                  item: 'rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/20 mb-3',
                  trigger: 'group flex w-full items-center gap-3 px-4 py-3 text-left',
                  leadingIcon: 'size-4',
                  label: 'font-medium',
                  trailingIcon: 'size-4 ms-auto transition-transform duration-200 group-data-[state=open]:rotate-180',
                  content: 'px-4',
                  body: 'pb-4 pt-0'
                }"
              >
                <template #content="{ item: accordionItem }">
                  <p class="text-sm leading-7 text-slate-600 dark:text-white/70">
                    {{ accordionItem.content }}
                  </p>
                </template>
              </UAccordion>
            </div>
          </section>
        </div>
      </aside>
    </div>
  </article>
</template>