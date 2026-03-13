<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PortfolioPublicViewModel } from '~/types/portfolio-public-view-model'
import { usePortfolioTemplateTheme } from '~/composables/usePortfolioTemplateTheme'
type PreviewTab = 'overview' | 'projects' | 'contact'

const props = defineProps<{
  portfolio: PortfolioPublicViewModel
  themeName?: string
  templatePresetId?: string | null
}>()
const { themeVars } = usePortfolioTemplateTheme(props.templatePresetId)
const activeTab = ref<PreviewTab>('overview')

const tabItems = [
  {
    label: 'Overview',
    value: 'overview',
    icon: 'i-lucide-layout-grid'
  },
  {
    label: 'Projetos',
    value: 'projects',
    icon: 'i-lucide-folder-kanban'
  },
  {
    label: 'Contato',
    value: 'contact',
    icon: 'i-lucide-send'
  }
]

function handleTabChange(value: string | number) {
  if (value === 'overview' || value === 'projects' || value === 'contact') {
    activeTab.value = value
  }
}

const summary = computed(() => props.portfolio.about.summary.trim())

const skills = computed(() => {
  return props.portfolio.hero.skills.filter(Boolean).slice(0, 8)
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
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      value: props.portfolio.contact.whatsapp,
      href: normalizeWhatsapp(props.portfolio.contact.whatsapp),
      icon: 'i-lucide-message-circle',
      external: true
    }
  ].filter((item) => item.value && item.href)
})

const overviewAccordionItems = computed(() => {
  return [
    {
      label: 'Headline pública',
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
      content: skills.value.length ? skills.value.join(' • ') : 'Sem skills públicas visíveis.'
    }
  ]
})

const projectAccordionItems = computed(() => {
  return props.portfolio.projects.map((project) => ({
    label: project.title,
    icon: project.featured ? 'i-lucide-star' : 'i-lucide-folder',
    category: project.category,
    summary: project.summary,
    link: project.link,
    featured: project.featured
  }))
})
</script>

<template>
  <article class="overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 text-white shadow-2xl">
    <section class="relative overflow-hidden border-b border-white/10 p-5 sm:p-7">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_35%),linear-gradient(135deg,#09090b_0%,#111827_40%,#0f172a_100%)]" />
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.08),transparent,rgba(168,85,247,0.08))]" />

      <div class="relative grid gap-5">
        <div class="flex flex-wrap gap-2">
          <UBadge color="primary" variant="soft">
            {{ themeName || 'Neon Pulse' }}
          </UBadge>

          <UBadge
            :color="portfolio.settings.publicationStatus === 'published' ? 'success' : 'warning'"
            variant="soft"
          >
            {{ portfolio.settings.publicationStatus === 'published' ? 'Publicado' : 'Rascunho' }}
          </UBadge>

          <UBadge color="neutral" variant="soft">
            {{ portfolio.hero.roleTitle || 'Portfolio Público' }}
          </UBadge>
        </div>

        <div class="grid gap-2">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
            /{{ portfolio.settings.publicSlug }}
          </p>

          <h1 class="text-3xl font-semibold tracking-tight sm:text-5xl">
            {{ portfolio.hero.publicName }}
          </h1>

          <p class="max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
            {{ portfolio.hero.headline }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UBadge
            v-if="portfolio.hero.location"
            color="neutral"
            variant="outline"
          >
            {{ portfolio.hero.location }}
          </UBadge>

          <UBadge
            v-for="skill in skills"
            :key="skill"
            color="neutral"
            variant="outline"
          >
            {{ skill }}
          </UBadge>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
              {{ stat.label }}
            </p>

            <p class="mt-2 text-2xl font-semibold text-cyan-300">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="p-4 sm:p-6">
      <UTabs
        :items="tabItems"
        :model-value="activeTab"
        class="w-full"
        @update:model-value="handleTabChange"
      >
        <template #content="{ item }">
          <div
            v-if="item.value === 'overview'"
            class="grid gap-4 pt-4 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <section
              class="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              v-reveal="{ distance: '14px', duration: 500 }"
            >
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-2">
                    <UBadge color="primary" variant="soft">
                      Sobre
                    </UBadge>

                    <UBadge color="secondary" variant="soft">
                      Overview
                    </UBadge>
                  </div>

                  <h2 class="text-xl font-semibold">
                    Resumo profissional
                  </h2>

                  <p class="whitespace-pre-line text-sm leading-7 text-white/70">
                    {{ summary || 'O resumo profissional ainda não foi preenchido.' }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="skill in skills"
                    :key="`overview-${skill}`"
                    color="neutral"
                    variant="outline"
                  >
                    {{ skill }}
                  </UBadge>
                </div>
              </div>
            </section>

            <section
              class="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
            >
              <div class="space-y-4">
                <div class="space-y-1">
                  <UBadge color="secondary" variant="soft">
                    Accordion
                  </UBadge>

                  <h2 class="text-xl font-semibold">
                    Leitura rápida
                  </h2>

                  <p class="text-sm text-white/65">
                    Visão condensada do perfil público.
                  </p>
                </div>

                <UAccordion
                  :items="overviewAccordionItems"
                  :ui="{
                    item: 'rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] mb-3',
                    trigger: 'group flex w-full items-center gap-3 px-4 py-3 text-left',
                    leadingIcon: 'size-4 text-cyan-300',
                    label: 'font-medium text-white',
                    trailingIcon: 'size-4 ms-auto transition-transform duration-200 group-data-[state=open]:rotate-180 text-white/60',
                    content: 'px-4',
                    body: 'pb-4 pt-0'
                  }"
                >
                  <template #content="{ item: accordionItem }">
                    <p class="text-sm leading-7 text-white/70">
                      {{ accordionItem.content }}
                    </p>
                  </template>
                </UAccordion>
              </div>
            </section>
          </div>

          <div
            v-else-if="item.value === 'projects'"
            class="grid gap-4 pt-4"
          >
            <section
              class="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              v-reveal="{ distance: '14px', duration: 500 }"
            >
              <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold">
                    Projetos em destaque
                  </h2>

                  <p class="text-sm text-white/65">
                    Layout mais modular e mais denso que o Aurora.
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <UBadge color="primary" variant="soft">
                    {{ portfolio.projects.length }} no total
                  </UBadge>

                  <UBadge color="success" variant="soft">
                    {{ featuredProjects.length }} exibidos
                  </UBadge>
                </div>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <article
                  v-for="(project, index) in featuredProjects"
                  :key="project.id"
                  class="rounded-3xl border border-white/10 bg-black/20 p-4"
                  v-reveal="{ delay: 70 + (index * 60), distance: '14px', duration: 500 }"
                >
                  <div class="flex flex-wrap gap-2">
                    <UBadge color="neutral" variant="outline">
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

                  <p class="mt-2 text-sm leading-7 text-white/70">
                    {{ project.summary }}
                  </p>

                  <a
                    v-if="project.link"
                    :href="project.link"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="mt-4 inline-flex text-sm font-medium text-cyan-300 hover:underline"
                  >
                    Ver projeto
                  </a>
                </article>
              </div>
            </section>

            <section
              class="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              v-reveal="{ delay: 90, distance: '14px', duration: 500 }"
            >
              <div class="space-y-1">
                <UBadge color="secondary" variant="soft">
                  Accordion
                </UBadge>

                <h2 class="text-xl font-semibold">
                  Exploração completa
                </h2>

                <p class="text-sm text-white/65">
                  Boa opção para muito conteúdo sem estourar o layout.
                </p>
              </div>

              <div class="mt-4">
                <UAccordion
                  :items="projectAccordionItems"
                  :ui="{
                    item: 'rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] mb-3',
                    trigger: 'group flex w-full items-center gap-3 px-4 py-3 text-left',
                    leadingIcon: 'size-4 text-cyan-300',
                    label: 'font-medium text-white',
                    trailingIcon: 'size-4 ms-auto transition-transform duration-200 group-data-[state=open]:rotate-180 text-white/60',
                    content: 'px-4',
                    body: 'pb-4 pt-0'
                  }"
                >
                  <template #content="{ item: accordionItem }">
                    <div class="space-y-3">
                      <div class="flex flex-wrap gap-2">
                        <UBadge color="neutral" variant="outline">
                          {{ accordionItem.category }}
                        </UBadge>

                        <UBadge
                          v-if="accordionItem.featured"
                          color="success"
                          variant="soft"
                        >
                          Destaque
                        </UBadge>
                      </div>

                      <p class="text-sm leading-7 text-white/70">
                        {{ accordionItem.summary }}
                      </p>

                      <a
                        v-if="accordionItem.link"
                        :href="accordionItem.link"
                        target="_blank"
                        rel="noreferrer noopener"
                        class="inline-flex text-sm font-medium text-cyan-300 hover:underline"
                      >
                        Abrir link do projeto
                      </a>
                    </div>
                  </template>
                </UAccordion>
              </div>
            </section>
          </div>

          <div
            v-else
            class="grid gap-4 pt-4 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <section
              class="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              v-reveal="{ distance: '14px', duration: 500 }"
            >
              <div class="space-y-3">
                <div class="space-y-1">
                  <UBadge color="primary" variant="soft">
                    Contato
                  </UBadge>

                  <h2 class="text-xl font-semibold">
                    Canais públicos
                  </h2>

                  <p class="text-sm text-white/65">
                    Template secundário com leitura mais tech e mais compacta.
                  </p>
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
              class="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              v-reveal="{ delay: 70, distance: '14px', duration: 500 }"
            >
              <div class="grid gap-3">
                <a
                  v-for="item in contactItems"
                  :key="item.key"
                  :href="item.href"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noreferrer noopener' : undefined"
                  class="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/30"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                      <p class="text-sm font-semibold text-white">
                        {{ item.label }}
                      </p>

                      <p class="break-all text-sm text-white/65">
                        {{ item.value }}
                      </p>
                    </div>

                    <UBadge color="neutral" variant="outline">
                      Link
                    </UBadge>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </template>
      </UTabs>
    </div>
  </article>
</template>