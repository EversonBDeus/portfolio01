<script setup lang="ts">
import { computed, ref } from 'vue'
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
  return props.portfolio.hero.skills.filter(Boolean).slice(0, 10)
})

const featuredProjects = computed(() => {
  const featured = props.portfolio.projects.filter((project) => project.featured)
  return featured.length ? featured : props.portfolio.projects
})

const selectedProjectIndex = ref(0)

const selectedProject = computed(() => {
  return featuredProjects.value[selectedProjectIndex.value] ?? featuredProjects.value[0] ?? null
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
  return contactItems.value.slice(0, 3)
})

const secondaryContacts = computed(() => {
  return contactItems.value.slice(3)
})
</script>

<template>
  <article class="imperial-arc overflow-hidden rounded-[36px] border border-black/10 bg-white/80 text-slate-900 shadow-[0_30px_120px_-38px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950 dark:text-white">
    <section class="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_20%),linear-gradient(135deg,var(--ui-color-primary-500),var(--ui-color-secondary-500),var(--ui-color-tertiary-500))]" />
      <div class="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 dark:from-black/28 dark:to-black/38" />

      <div class="relative grid gap-6 lg:grid-cols-[minmax(0,1.14fr)_360px] lg:items-end">
        <div
          class="grid gap-5 text-white"
          v-reveal="{ distance: '16px', duration: 540 }"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="solid">
              {{ themeName || 'Imperial Arc' }}
            </UBadge>

            <UBadge
              :color="portfolio.settings.publicationStatus === 'published' ? 'success' : 'warning'"
              variant="solid"
            >
              {{ portfolio.settings.publicationStatus === 'published' ? 'Publicado' : 'Rascunho' }}
            </UBadge>

            <UBadge
              v-if="portfolio.hero.roleTitle"
              color="primary"
              variant="soft"
            >
              <template #leading>
                <UIcon name="i-lucide-crown" class="size-3.5" />
              </template>
              {{ portfolio.hero.roleTitle }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
              /{{ portfolio.settings.publicSlug }}
            </p>

            <h1 class="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {{ portfolio.hero.publicName }}
            </h1>

            <p class="max-w-3xl text-sm leading-7 text-white/86 sm:text-base">
              {{ portfolio.hero.headline }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
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

          <div class="flex flex-wrap gap-3">
            <a
              v-if="whatsappItem"
              :href="whatsappItem.href"
              :target="whatsappItem.external ? '_blank' : undefined"
              :rel="whatsappItem.external ? 'noreferrer noopener' : undefined"
              class="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-400 px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-emerald-300"
            >
              <UIcon :name="whatsappItem.icon" class="size-4.5" />
              Falar no WhatsApp
            </a>

            <a
              v-if="selectedProject?.link"
              :href="selectedProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/14 bg-white/10 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/14"
            >
              <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
              Ver projeto principal
            </a>
          </div>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 90, distance: '16px', duration: 540 }"
        >
          <div class="imperial-arc__panel imperial-arc__panel--glow rounded-[30px] border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
            <div class="mb-4 flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Signature rail
                </p>
                <h2 class="mt-1 text-lg font-semibold">
                  Ações rápidas
                </h2>
              </div>

              <div class="imperial-arc__cut" />
            </div>

            <div class="grid gap-3">
              <a
                v-for="(item, index) in primaryContacts"
                :key="item.key"
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noreferrer noopener' : undefined"
                class="imperial-arc__contact-card group rounded-2xl border border-white/12 bg-black/15 p-4 transition hover:-translate-y-0.5"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="imperial-arc__icon-loop inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white"
                    :style="{ animationDelay: `${index * 0.28}s` }"
                  >
                    <UIcon :name="item.icon" class="size-4.5" />
                  </span>

                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-white">
                      {{ item.label }}
                    </p>

                    <p class="mt-1 break-all text-sm text-white/68">
                      {{ item.value }}
                    </p>
                  </div>

                  <UIcon name="i-lucide-arrow-up-right" class="mt-0.5 size-4 text-white/40 transition group-hover:text-white" />
                </div>
              </a>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="imperial-arc__panel rounded-3xl border border-white/14 bg-white/10 p-4 text-white backdrop-blur-sm"
            >
              <div class="flex items-center gap-2 text-white/62">
                <UIcon :name="stat.icon" class="size-4" />
                <p class="text-xs font-semibold uppercase tracking-[0.16em]">
                  {{ stat.label }}
                </p>
              </div>

              <p class="mt-3 text-2xl font-semibold">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-4 p-4 sm:gap-5 sm:p-6">
      <section class="grid gap-4 lg:grid-cols-[minmax(0,1.14fr)_340px]">
        <div
          class="imperial-arc__panel rounded-[30px] border border-default/50 bg-white/72 p-5 dark:bg-white/[0.04]"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="mb-4 flex flex-wrap gap-2">
            <UBadge color="secondary" variant="soft">
              Sobre
            </UBadge>

            <UBadge color="neutral" variant="soft">
              Premium editorial
            </UBadge>
          </div>

          <div class="space-y-3">
            <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
              Uma presença visual mais refinada, vendável e curada.
            </h2>

            <p class="max-w-3xl text-sm leading-7 text-muted">
              {{ summary || 'O resumo profissional ainda não foi preenchido.' }}
            </p>
          </div>
        </div>

        <div
          class="imperial-arc__panel rounded-[30px] border border-default/50 bg-white/72 p-5 dark:bg-white/[0.04]"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <div class="space-y-3">
            <UBadge color="primary" variant="soft">
              Escopo atual
            </UBadge>

            <UAlert
              icon="i-lucide-shield-check"
              color="neutral"
              variant="outline"
              title="Pronto para preview"
              description="Sem avatar, sem CV, sem certificados e sem experiência cronológica."
            />

            <p class="text-sm leading-7 text-muted">
              Este template foi desenhado para parecer mais high-ticket sem exagerar em efeitos.
            </p>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div
          class="imperial-arc__panel imperial-arc__panel--glow rounded-[30px] border border-default/50 bg-white/72 p-5 dark:bg-white/[0.04]"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="mb-4 flex flex-wrap gap-2">
            <button
              v-for="(project, index) in featuredProjects"
              :key="project.id"
              type="button"
              class="imperial-arc__selector rounded-full border px-3 py-2 text-sm font-medium transition"
              :class="selectedProjectIndex === index
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-default/60 bg-transparent text-muted hover:border-primary/40 hover:text-default'"
              @click="selectedProjectIndex = index"
            >
              {{ project.title }}
            </button>
          </div>

          <template v-if="selectedProject">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                <UBadge color="neutral" variant="soft">
                  <template #leading>
                    <UIcon name="i-lucide-layout-template" class="size-3.5" />
                  </template>
                  {{ selectedProject.category }}
                </UBadge>

                <UBadge
                  v-if="selectedProject.featured"
                  color="success"
                  variant="soft"
                >
                  <template #leading>
                    <UIcon name="i-lucide-badge-check" class="size-3.5" />
                  </template>
                  Destaque
                </UBadge>
              </div>

              <div class="space-y-2">
                <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {{ selectedProject.title }}
                </h2>

                <p class="max-w-2xl text-sm leading-7 text-muted">
                  {{ selectedProject.summary }}
                </p>
              </div>

              <a
                v-if="selectedProject.link"
                :href="selectedProject.link"
                target="_blank"
                rel="noreferrer noopener"
                class="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black"
              >
                <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
                Abrir case selecionado
              </a>
            </div>
          </template>

          <template v-else>
            <p class="text-sm leading-7 text-muted">
              Nenhum projeto público disponível no momento.
            </p>
          </template>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 80, distance: '14px', duration: 500 }"
        >
          <article
            v-for="(project, index) in featuredProjects.slice(0, 3)"
            :key="`mini-${project.id}`"
            class="imperial-arc__panel rounded-3xl border border-default/50 bg-white/72 p-4 dark:bg-white/[0.04]"
            v-reveal="{ delay: 90 + (index * 40), distance: '12px', duration: 450 }"
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

              <span class="inline-flex size-10 items-center justify-center rounded-2xl border border-default/60 bg-black/[0.03] text-primary dark:bg-white/[0.05]">
                <UIcon name="i-lucide-sparkles" class="size-4.5" />
              </span>
            </div>

            <p class="mt-3 text-sm leading-7 text-muted">
              {{ project.summary }}
            </p>
          </article>
        </div>
      </section>

      <section
        class="imperial-arc__panel rounded-[30px] border border-default/50 bg-white/72 p-5 dark:bg-white/[0.04]"
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
              Canais de contato com leitura premium
            </h2>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <a
            v-for="(item, index) in primaryContacts"
            :key="`bottom-${item.key}`"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="imperial-arc__contact-card group rounded-3xl border border-default/60 bg-black/[0.03] p-4 transition hover:-translate-y-0.5 dark:bg-white/[0.04]"
          >
            <div class="flex items-start gap-3">
              <span
                class="imperial-arc__icon-loop inline-flex size-11 items-center justify-center rounded-2xl border border-default/60 bg-white/80 text-primary dark:bg-black/20"
                :style="{ animationDelay: `${index * 0.32}s` }"
              >
                <UIcon :name="item.icon" class="size-4.5" />
              </span>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold">
                  {{ item.label }}
                </p>

                <p class="mt-1 break-all text-sm text-muted">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </a>
        </div>

        <div
          v-if="secondaryContacts.length"
          class="mt-4 flex flex-wrap gap-2"
        >
          <UBadge
            v-for="item in secondaryContacts"
            :key="`extra-${item.key}`"
            color="neutral"
            variant="soft"
          >
            <template #leading>
              <UIcon :name="item.icon" class="size-3.5" />
            </template>
            {{ item.label }}
          </UBadge>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.imperial-arc__panel {
  position: relative;
  overflow: hidden;
}

.imperial-arc__panel--glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(115deg, transparent 10%, rgba(255, 255, 255, 0.14) 28%, transparent 42%);
  transform: translateX(-120%);
  animation: imperial-arc-shimmer 7.2s linear infinite;
  pointer-events: none;
}

.imperial-arc__contact-card {
  position: relative;
  overflow: hidden;
}

.imperial-arc__contact-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.22), transparent 30%, rgba(255, 255, 255, 0.12) 72%, transparent);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 180ms ease;
}

.imperial-arc__contact-card:hover::after {
  opacity: 1;
}

.imperial-arc__icon-loop {
  animation: imperial-arc-float 4s ease-in-out infinite;
}

.imperial-arc__contact-card:hover .imperial-arc__icon-loop {
  animation-name: imperial-arc-float, imperial-arc-shake;
  animation-duration: 4s, 360ms;
  animation-timing-function: ease-in-out, ease-in-out;
  animation-iteration-count: infinite, 1;
}

.imperial-arc__cut {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.28), transparent 62%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  opacity: 0.95;
}

@keyframes imperial-arc-shimmer {
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(140%);
  }
}

@keyframes imperial-arc-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }

  35% {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 0 18px rgba(255, 255, 255, 0.12);
  }

  60% {
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
}

@keyframes imperial-arc-shake {
  0%, 100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-1px);
  }

  40% {
    transform: translateX(1.5px);
  }

  60% {
    transform: translateX(-1px);
  }

  80% {
    transform: translateX(1px);
  }
}
</style>