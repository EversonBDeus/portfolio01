<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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

const leadProject = computed(() => {
  return featuredProjects.value[0] ?? null
})

const secondaryProjects = computed(() => {
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
      icon: 'i-lucide-star'
    },
    {
      label: 'Skills',
      value: String(skills.value.length),
      icon: 'i-lucide-layers-3'
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

const topContacts = computed(() => {
  return contactItems.value.slice(0, 4)
})

const isProjectModalOpen = ref(false)

const typedSummary = ref('')
let typingInterval: ReturnType<typeof setInterval> | null = null
let typingRestartTimeout: ReturnType<typeof setTimeout> | null = null

function clearTypingTimers() {
  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }

  if (typingRestartTimeout) {
    clearTimeout(typingRestartTimeout)
    typingRestartTimeout = null
  }
}

function startTypewriter() {
  clearTypingTimers()

  const fullText = summary.value

  if (!fullText) {
    typedSummary.value = ''
    return
  }

  typedSummary.value = ''
  let currentIndex = 0

  typingInterval = setInterval(() => {
    currentIndex += 1
    typedSummary.value = fullText.slice(0, currentIndex)

    if (currentIndex >= fullText.length) {
      clearTypingTimers()

      typingRestartTimeout = setTimeout(() => {
        startTypewriter()
      }, 2600)
    }
  }, 24)
}

onMounted(() => {
  startTypewriter()
})

onBeforeUnmount(() => {
  clearTypingTimers()
})
</script>

<template>
  <article class="obsidian-prime overflow-hidden rounded-[34px] border border-white/10 bg-neutral-950 text-white shadow-[0_30px_120px_-42px_rgba(0,0,0,0.75)]">
    <section class="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_26%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_22%),linear-gradient(145deg,#050816_0%,#0b1120_38%,#111827_100%)]" />
      <div class="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.03),transparent_30%,rgba(255,255,255,0.05)_58%,transparent_80%)]" />

      <div class="relative grid gap-5 lg:grid-cols-[minmax(0,1.18fr)_380px] lg:items-stretch">
        <div
          class="grid gap-5"
          v-reveal="{ distance: '16px', duration: 550 }"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="solid">
              {{ themeName || 'Obsidian Prime' }}
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
              {{ portfolio.hero.roleTitle }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
              /{{ portfolio.settings.publicSlug }}
            </p>

            <h1 class="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {{ portfolio.hero.publicName }}
            </h1>

            <p class="max-w-3xl text-sm leading-7 text-white/76 sm:text-base">
              {{ portfolio.hero.headline }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-if="portfolio.hero.location"
              color="neutral"
              variant="outline"
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
              variant="outline"
            >
              <template #leading>
                <UIcon name="i-lucide-sparkles" class="size-3.5" />
              </template>
              {{ skill }}
            </UBadge>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="obsidian-prime__panel obsidian-prime__panel--shimmer rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm"
            >
              <div class="flex items-center gap-2 text-white/65">
                <UIcon :name="stat.icon" class="size-4" />
                <p class="text-xs font-semibold uppercase tracking-[0.18em]">
                  {{ stat.label }}
                </p>
              </div>

              <p class="mt-3 text-2xl font-semibold text-cyan-300">
                {{ stat.value }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <a
              v-if="whatsappItem"
              :href="whatsappItem.href"
              :target="whatsappItem.external ? '_blank' : undefined"
              :rel="whatsappItem.external ? 'noreferrer noopener' : undefined"
              class="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              <UIcon :name="whatsappItem.icon" class="size-4.5" />
              Entrar em contato no WhatsApp
            </a>

            <button
              v-if="leadProject"
              type="button"
              class="hidden min-h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.09] lg:inline-flex"
              @click="isProjectModalOpen = true"
            >
              <UIcon name="i-lucide-expand" class="size-4.5" />
              Ver spotlight do projeto
            </button>
          </div>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 90, distance: '16px', duration: 550 }"
        >
          <div class="obsidian-prime__panel rounded-[30px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
            <div class="mb-3 flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  Acesso rápido
                </p>
                <h2 class="mt-1 text-lg font-semibold">
                  Canais públicos
                </h2>
              </div>

              <div class="obsidian-prime__corner-cut" />
            </div>

            <div class="grid gap-3">
              <a
                v-for="(item, index) in topContacts"
                :key="item.key"
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noreferrer noopener' : undefined"
                class="obsidian-prime__contact-card group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/30"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="obsidian-prime__icon-loop inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyan-300"
                    :style="{ animationDelay: `${index * 0.28}s` }"
                  >
                    <UIcon :name="item.icon" class="size-4.5" />
                  </span>

                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-white">
                      {{ item.label }}
                    </p>

                    <p class="mt-1 break-all text-sm text-white/62">
                      {{ item.value }}
                    </p>
                  </div>

                  <UIcon name="i-lucide-arrow-up-right" class="mt-0.5 size-4 text-white/35 transition group-hover:text-cyan-300" />
                </div>
              </a>
            </div>
          </div>

          <div class="obsidian-prime__panel obsidian-prime__panel--shimmer rounded-[30px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
            <div class="space-y-2">
              <UBadge color="secondary" variant="soft">
                Sobre
              </UBadge>

              <h2 class="text-lg font-semibold">
                Texto com sensação mais premium
              </h2>

              <p class="min-h-[126px] text-sm leading-7 text-white/72">
                {{ typedSummary || '...' }}
                <span class="obsidian-prime__cursor">|</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-4 p-4 sm:gap-5 sm:p-6">
      <section
        v-if="leadProject"
        class="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]"
      >
        <div
          class="obsidian-prime__panel obsidian-prime__panel--shimmer rounded-[30px] border border-white/10 bg-white/[0.04] p-5"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="mb-4 flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft">
              Spotlight
            </UBadge>

            <UBadge color="neutral" variant="outline">
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
              <template #leading>
                <UIcon name="i-lucide-badge-check" class="size-3.5" />
              </template>
              Destaque
            </UBadge>
          </div>

          <div class="space-y-3">
            <h2 class="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {{ leadProject.title }}
            </h2>

            <p class="max-w-2xl text-sm leading-7 text-white/72">
              {{ leadProject.summary }}
            </p>
          </div>

          <div class="mt-5 flex flex-wrap gap-3">
            <a
              v-if="leadProject.link"
              :href="leadProject.link"
              target="_blank"
              rel="noreferrer noopener"
              class="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
              Abrir projeto
            </a>

            <button
              type="button"
              class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.09] lg:hidden"
              @click="isProjectModalOpen = true"
            >
              <UIcon name="i-lucide-expand" class="size-4.5" />
              Ver detalhes
            </button>
          </div>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 80, distance: '14px', duration: 500 }"
        >
          <article
            v-for="(project, index) in secondaryProjects"
            :key="project.id"
            class="obsidian-prime__panel rounded-3xl border border-white/10 bg-black/20 p-4"
            v-reveal="{ delay: 100 + (index * 50), distance: '12px', duration: 450 }"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <UBadge color="neutral" variant="outline">
                    <template #leading>
                      <UIcon name="i-lucide-panel-top" class="size-3.5" />
                    </template>
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

              <span class="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-300">
                <UIcon name="i-lucide-sparkles" class="size-4.5" />
              </span>
            </div>

            <p class="mt-3 text-sm leading-7 text-white/68">
              {{ project.summary }}
            </p>

            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noreferrer noopener"
              class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:underline"
            >
              <UIcon name="i-lucide-arrow-up-right" class="size-4" />
              Ver projeto
            </a>
          </article>
        </div>
      </section>

      <section
        class="obsidian-prime__panel rounded-[30px] border border-white/10 bg-white/[0.04] p-5"
        v-reveal="{ distance: '14px', duration: 500 }"
      >
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft">
                Contato
              </UBadge>

              <UBadge color="neutral" variant="soft">
                CTA premium
              </UBadge>
            </div>

            <h2 class="text-2xl font-semibold tracking-tight">
              Canais prontos para conversão
            </h2>
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <a
            v-for="(item, index) in topContacts"
            :key="`bottom-${item.key}`"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="obsidian-prime__contact-card group rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/30"
          >
            <div class="flex items-start gap-3">
              <span
                class="obsidian-prime__icon-loop inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan-300"
                :style="{ animationDelay: `${index * 0.32}s` }"
              >
                <UIcon :name="item.icon" class="size-4.5" />
              </span>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-white">
                  {{ item.label }}
                </p>

                <p class="mt-1 break-all text-sm text-white/62">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>

    <Teleport to="body">
      <div
        v-if="isProjectModalOpen && leadProject"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm"
        @click.self="isProjectModalOpen = false"
      >
        <div class="obsidian-prime__modal relative w-full max-w-3xl rounded-[32px] border border-white/10 bg-neutral-950 p-5 text-white shadow-[0_40px_140px_-40px_rgba(0,0,0,0.82)] sm:p-6">
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 transition hover:bg-white/[0.1]"
            @click="isProjectModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4.5" />
          </button>

          <div class="space-y-4">
            <div class="flex flex-wrap gap-2 pr-12">
              <UBadge color="primary" variant="soft">
                Detalhe expandido
              </UBadge>

              <UBadge color="neutral" variant="outline">
                {{ leadProject.category }}
              </UBadge>
            </div>

            <div class="space-y-2">
              <h3 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                {{ leadProject.title }}
              </h3>

              <p class="text-sm leading-7 text-white/72">
                {{ leadProject.summary }}
              </p>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Posicionamento do bloco
              </p>

              <p class="mt-3 text-sm leading-7 text-white/70">
                Este modal ajuda a dar sensação de nível Pro/Plus em telas maiores, destacando um case principal sem poluir a leitura da landing.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                v-if="leadProject.link"
                :href="leadProject.link"
                target="_blank"
                rel="noreferrer noopener"
                class="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              >
                <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
                Abrir projeto
              </a>

              <a
                v-if="whatsappItem"
                :href="whatsappItem.href"
                :target="whatsappItem.external ? '_blank' : undefined"
                :rel="whatsappItem.external ? 'noreferrer noopener' : undefined"
                class="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              >
                <UIcon :name="whatsappItem.icon" class="size-4.5" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </article>
</template>

<style scoped>
.obsidian-prime__panel {
  position: relative;
  overflow: hidden;
}

.obsidian-prime__panel--shimmer::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(115deg, transparent 10%, rgba(255, 255, 255, 0.12) 28%, transparent 42%);
  transform: translateX(-120%);
  animation: obsidian-shimmer 6.8s linear infinite;
  pointer-events: none;
}

.obsidian-prime__contact-card {
  position: relative;
  overflow: hidden;
}

.obsidian-prime__contact-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(120deg, rgba(34, 211, 238, 0.22), transparent 30%, rgba(168, 85, 247, 0.22) 72%, transparent);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 180ms ease;
}

.obsidian-prime__contact-card:hover::after {
  opacity: 1;
}

.obsidian-prime__contact-card:hover .obsidian-prime__icon-loop {
  animation-name: obsidian-loop, obsidian-shake;
  animation-duration: 3.8s, 360ms;
  animation-timing-function: ease-in-out, ease-in-out;
  animation-iteration-count: infinite, 1;
}

.obsidian-prime__icon-loop {
  animation: obsidian-loop 3.8s ease-in-out infinite;
}

.obsidian-prime__cursor {
  display: inline-block;
  margin-left: 2px;
  animation: obsidian-cursor 0.9s steps(1) infinite;
}

.obsidian-prime__corner-cut {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: radial-gradient(circle at center, rgba(34, 211, 238, 0.32), transparent 62%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
  opacity: 0.95;
}

.obsidian-prime__modal {
  overflow: hidden;
}

.obsidian-prime__modal::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(34, 211, 238, 0.14), transparent 24%),
    radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.12), transparent 22%);
  pointer-events: none;
}

@keyframes obsidian-shimmer {
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(140%);
  }
}

@keyframes obsidian-loop {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 rgba(34, 211, 238, 0);
  }

  35% {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 0 18px rgba(34, 211, 238, 0.12);
  }

  60% {
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 rgba(34, 211, 238, 0);
  }
}

@keyframes obsidian-shake {
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

@keyframes obsidian-cursor {
  0%, 50% {
    opacity: 1;
  }

  51%, 100% {
    opacity: 0;
  }
}
</style>