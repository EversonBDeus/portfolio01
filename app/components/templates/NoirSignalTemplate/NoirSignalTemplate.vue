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

const leadProject = computed(() => {
  return featuredProjects.value[0] ?? null
})

const secondaryProjects = computed(() => {
  return featuredProjects.value.slice(1, 4)
})

const signalStats = computed(() => {
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
      icon: 'i-lucide-message-circle-more',
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
  return contactItems.value.slice(0, 3)
})

const extraContacts = computed(() => {
  return contactItems.value.slice(3)
})

const projectFocusPoints = computed(() => {
  return [
    {
      label: 'Leitura premium',
      value: 'Composição com hero, rail e cards de venda.'
    },
    {
      label: 'Conversão',
      value: 'WhatsApp e contatos públicos em destaque.'
    },
    {
      label: 'Entrega',
      value: 'Template isolado, pronto para plugar depois no fluxo real.'
    }
  ]
})

const isContactModalOpen = ref(false)
</script>

<template>
  <article class="noir-signal overflow-hidden rounded-[34px] border border-white/10 bg-neutral-950 text-white shadow-[0_30px_130px_-42px_rgba(0,0,0,0.82)]">
    <section class="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_20%),linear-gradient(145deg,#04050a_0%,#0b1120_35%,#111827_100%)]" />
      <div class="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02),transparent_28%,rgba(255,255,255,0.05)_52%,transparent_78%)]" />

      <div class="relative grid gap-5 lg:grid-cols-[minmax(0,1.18fr)_390px]">
        <div
          class="grid gap-5"
          v-reveal="{ distance: '16px', duration: 540 }"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="solid">
              {{ themeName || 'Noir Signal' }}
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
                <UIcon name="i-lucide-briefcase-business" class="size-3.5" />
              </template>
              {{ portfolio.hero.roleTitle }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
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
                <UIcon name="i-lucide-scan-search" class="size-3.5" />
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
              class="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              <UIcon :name="whatsappItem.icon" class="size-4.5" />
              Chamar no WhatsApp
            </a>

            <button
              type="button"
              class="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
              @click="isContactModalOpen = true"
            >
              <UIcon name="i-lucide-panel-right-open" class="size-4.5" />
              Abrir contato rápido
            </button>
          </div>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 90, distance: '16px', duration: 540 }"
        >
          <div class="noir-signal__panel noir-signal__panel--shimmer rounded-[30px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
            <div class="mb-4 flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  Signal stats
                </p>
                <h2 class="mt-1 text-lg font-semibold">
                  Indicadores rápidos
                </h2>
              </div>

              <div class="noir-signal__notch" />
            </div>

            <div class="grid gap-3">
              <div
                v-for="stat in signalStats"
                :key="stat.label"
                class="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div class="flex items-center gap-2 text-white/60">
                  <UIcon :name="stat.icon" class="size-4" />
                  <p class="text-xs font-semibold uppercase tracking-[0.16em]">
                    {{ stat.label }}
                  </p>
                </div>

                <p class="mt-3 text-2xl font-semibold text-sky-300">
                  {{ stat.value }}
                </p>
              </div>
            </div>
          </div>

          <div class="noir-signal__panel rounded-[30px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <UBadge color="secondary" variant="soft">
                  Sobre
                </UBadge>

                <UBadge color="neutral" variant="soft">
                  Dossiê premium
                </UBadge>
              </div>

              <p class="text-sm leading-7 text-white/72">
                {{ summary || 'O resumo profissional ainda não foi preenchido.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-4 p-4 sm:gap-5 sm:p-6">
      <section class="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
        <div
          class="noir-signal__panel noir-signal__panel--shimmer rounded-[30px] border border-white/10 bg-white/[0.04] p-5"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <div class="mb-4 flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft">
              Spotlight
            </UBadge>

            <UBadge
              v-if="leadProject"
              color="neutral"
              variant="outline"
            >
              <template #leading>
                <UIcon name="i-lucide-layout-template" class="size-3.5" />
              </template>
              {{ leadProject.category }}
            </UBadge>
          </div>

          <template v-if="leadProject">
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
                class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
                @click="isContactModalOpen = true"
              >
                <UIcon name="i-lucide-send" class="size-4.5" />
                Falar sobre este projeto
              </button>
            </div>
          </template>

          <template v-else>
            <p class="text-sm leading-7 text-white/70">
              Nenhum projeto público disponível no momento.
            </p>
          </template>
        </div>

        <div
          class="grid gap-3"
          v-reveal="{ delay: 80, distance: '14px', duration: 500 }"
        >
          <div class="noir-signal__panel rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <UBadge color="secondary" variant="soft">
                  Foco do template
                </UBadge>
              </div>

              <div class="grid gap-3">
                <div
                  v-for="(point, index) in projectFocusPoints"
                  :key="point.label"
                  class="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div class="flex items-start gap-3">
                    <span
                      class="noir-signal__signal-dot inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sky-300"
                      :style="{ animationDelay: `${index * 0.3}s` }"
                    >
                      <UIcon name="i-lucide-orbit" class="size-4.5" />
                    </span>

                    <div>
                      <p class="text-sm font-semibold text-white">
                        {{ point.label }}
                      </p>

                      <p class="mt-1 text-sm leading-7 text-white/65">
                        {{ point.value }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="noir-signal__panel rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
            <div class="space-y-3">
              <UBadge color="neutral" variant="soft">
                Escopo atual
              </UBadge>

              <UAlert
                icon="i-lucide-shield-check"
                color="neutral"
                variant="outline"
                title="Compatível com o preview atual"
                description="Sem avatar, sem CV, sem certificados e sem experiência cronológica."
              />
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div
          class="grid gap-3 md:grid-cols-2"
          v-reveal="{ distance: '14px', duration: 500 }"
        >
          <article
            v-for="(project, index) in secondaryProjects"
            :key="project.id"
            class="noir-signal__panel rounded-3xl border border-white/10 bg-black/20 p-4"
            v-reveal="{ delay: 90 + (index * 50), distance: '12px', duration: 450 }"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <UBadge color="neutral" variant="outline">
                    <template #leading>
                      <UIcon name="i-lucide-box" class="size-3.5" />
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

              <span class="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sky-300">
                <UIcon name="i-lucide-arrow-up-right" class="size-4.5" />
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
              class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:underline"
            >
              <UIcon name="i-lucide-external-link" class="size-4" />
              Ver projeto
            </a>
          </article>
        </div>

        <div
          class="noir-signal__panel noir-signal__panel--shimmer rounded-[30px] border border-white/10 bg-white/[0.04] p-5"
          v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
        >
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Acesso rápido
              </p>
              <h2 class="mt-1 text-xl font-semibold">
                Contato e redes
              </h2>
            </div>

            <div class="noir-signal__notch" />
          </div>

          <div class="grid gap-3">
            <a
              v-for="(item, index) in primaryContacts"
              :key="item.key"
              :href="item.href"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noreferrer noopener' : undefined"
              class="noir-signal__contact-card group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-sky-400/30"
            >
              <div class="flex items-start gap-3">
                <span
                  class="noir-signal__signal-dot inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sky-300"
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

          <div
            v-if="extraContacts.length"
            class="mt-4 flex flex-wrap gap-2"
          >
            <UBadge
              v-for="item in extraContacts"
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
        </div>
      </section>
    </div>

    <Teleport to="body">
      <div
        v-if="isContactModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm"
        @click.self="isContactModalOpen = false"
      >
        <div class="noir-signal__modal relative w-full max-w-2xl rounded-[32px] border border-white/10 bg-neutral-950 p-5 text-white shadow-[0_40px_140px_-40px_rgba(0,0,0,0.82)] sm:p-6">
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 transition hover:bg-white/[0.1]"
            @click="isContactModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4.5" />
          </button>

          <div class="space-y-4">
            <div class="flex flex-wrap gap-2 pr-12">
              <UBadge color="primary" variant="soft">
                Contato rápido
              </UBadge>

              <UBadge color="neutral" variant="outline">
                Nível Pro/Plus
              </UBadge>
            </div>

            <div class="space-y-2">
              <h3 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                Vamos transformar essa conversa em oportunidade.
              </h3>

              <p class="text-sm leading-7 text-white/72">
                Este modal dá uma camada mais premium ao template e concentra os principais canais de contato sem poluir a leitura principal da página.
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <a
                v-for="item in primaryContacts"
                :key="`modal-${item.key}`"
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noreferrer noopener' : undefined"
                class="rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5"
              >
                <div class="flex items-start gap-3">
                  <span class="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-sky-300">
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

            <div class="flex flex-wrap gap-3">
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

              <button
                type="button"
                class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
                @click="isContactModalOpen = false"
              >
                <UIcon name="i-lucide-check" class="size-4.5" />
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </article>
</template>

<style scoped>
.noir-signal__panel {
  position: relative;
  overflow: hidden;
}

.noir-signal__panel--shimmer::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(115deg, transparent 10%, rgba(255, 255, 255, 0.12) 28%, transparent 42%);
  transform: translateX(-120%);
  animation: noir-signal-shimmer 7s linear infinite;
  pointer-events: none;
}

.noir-signal__contact-card {
  position: relative;
  overflow: hidden;
}

.noir-signal__contact-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.24), transparent 30%, rgba(168, 85, 247, 0.24) 72%, transparent);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 180ms ease;
}

.noir-signal__contact-card:hover::after {
  opacity: 1;
}

.noir-signal__contact-card:hover .noir-signal__signal-dot {
  animation-name: noir-signal-pulse, noir-signal-shake;
  animation-duration: 3.8s, 360ms;
  animation-timing-function: ease-in-out, ease-in-out;
  animation-iteration-count: infinite, 1;
}

.noir-signal__signal-dot {
  animation: noir-signal-pulse 3.8s ease-in-out infinite;
}

.noir-signal__notch {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: radial-gradient(circle at center, rgba(56, 189, 248, 0.28), transparent 62%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
  opacity: 0.95;
}

.noir-signal__modal {
  overflow: hidden;
}

.noir-signal__modal::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 24%),
    radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.12), transparent 22%);
  pointer-events: none;
}

@keyframes noir-signal-shimmer {
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(140%);
  }
}

@keyframes noir-signal-pulse {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 rgba(56, 189, 248, 0);
  }

  35% {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 0 18px rgba(56, 189, 248, 0.14);
  }

  60% {
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 rgba(56, 189, 248, 0);
  }
}

@keyframes noir-signal-shake {
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