<script setup lang="ts">
import { computed } from 'vue'
import type { TemplateTier } from '~/data/templates'
import { PORTFOLIO_TEMPLATES } from '~/data/templates'

definePageMeta({
  layout: 'marketing'
})

useSeoMeta({
  title: 'Portfolio SaaS — Landing pública',
  description:
    'Crie um portfólio profissional com onboarding, templates, editor visual e base pronta para evoluir para SaaS.',
  ogTitle: 'Portfolio SaaS — Landing pública',
  ogDescription:
    'Landing pública do projeto em Nuxt 4 + Nuxt UI 4 com foco em templates, editor visual e onboarding.'
})

const heroStats = [
  {
    label: 'Fluxo guiado',
    value: 'Onboarding',
    description: 'Entrada mais clara para o usuário preencher os dados essenciais.'
  },
  {
    label: 'Preview em tempo real',
    value: 'Editor visual',
    description: 'Base do editor já conectada ao template selecionado.'
  },
  {
    label: 'Evolução futura',
    value: 'SaaS-ready',
    description: 'Arquitetura preparada para login, planos, domínio e analytics.'
  }
]

const promiseItems = [
  'Nuxt UI 4 como base visual',
  'ScrollReveal nas seções públicas',
  'Onboarding por etapas',
  'Templates desbloqueados por plano',
  'Editor visual com preview',
  'Domínio e analytics na evolução do produto'
]

const featureCards = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Templates prontos para escalar',
    description:
      'A vitrine pública nasce organizada para depois receber múltiplos templates e regras por plano.'
  },
  {
    icon: 'i-lucide-scan-text',
    title: 'Onboarding orientado a conteúdo',
    description:
      'Os dados públicos do portfólio são coletados em etapas antes de chegar no dashboard.'
  },
  {
    icon: 'i-lucide-panel-right-open',
    title: 'Editor visual com preview',
    description:
      'A experiência de edição já foi iniciada para funcionar como base do editor do produto.'
  },
  {
    icon: 'i-lucide-chart-column-big',
    title: 'Pronto para analytics',
    description:
      'A arquitetura já prevê áreas de métricas e desbloqueio por planos superiores.'
  },
  {
    icon: 'i-lucide-globe',
    title: 'Preparado para domínio próprio',
    description:
      'O fluxo futuro contempla publicação em subdomínio padrão e domínio personalizado.'
  },
  {
    icon: 'i-lucide-badge-dollar-sign',
    title: 'Caminho natural para monetização',
    description:
      'A plataforma já está sendo pensada com Free, Plus e Pro desde a camada visual.'
  }
]

const flowSteps = [
  {
    step: '01',
    title: 'Usuário entra na plataforma',
    description:
      'A landing apresenta a proposta do produto e prepara a entrada no fluxo público.'
  },
  {
    step: '02',
    title: 'Preenche o onboarding',
    description:
      'Os dados do perfil e do conteúdo profissional alimentam templates e editor.'
  },
  {
    step: '03',
    title: 'Escolhe um template',
    description:
      'A seleção do template organiza a próxima etapa visual da experiência.'
  },
  {
    step: '04',
    title: 'Edita e publica',
    description:
      'Depois o usuário ajusta o conteúdo, personaliza o visual e publica o portfólio.'
  }
]

const previewTemplates = computed(() => PORTFOLIO_TEMPLATES.slice(0, 6))

function tierColor(tier: TemplateTier) {
  switch (tier) {
    case 'plus':
      return 'warning'
    case 'pro':
      return 'primary'
    default:
      return 'neutral'
  }
}

function tierLabel(tier: TemplateTier) {
  switch (tier) {
    case 'plus':
      return 'Plus'
    case 'pro':
      return 'Pro'
    default:
      return 'Free'
  }
}
</script>

<template>
  <div class="pb-16 sm:pb-24">
    <UContainer class="space-y-10 sm:space-y-14">
      <!--  =========== Hero ================ -->
      <!--  ----------- Proposta principal -------------- -->

      <section class="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center">
        <div v-reveal class="space-y-6">
          <div class="flex flex-wrap gap-2">
            <UBadge color="primary" variant="subtle">
              Landing pública
            </UBadge>

            <UBadge color="neutral" variant="soft">
              Nuxt UI 4
            </UBadge>

            <UBadge color="neutral" variant="soft">
              ScrollReveal
            </UBadge>
          </div>

          <div class="space-y-4">
            <h1 class="max-w-4xl text-4xl font-semibold tracking-tight text-highlighted sm:text-5xl lg:text-6xl">
              Transforme currículo e projetos em um portfólio publicável com
              editor visual e templates prontos.
            </h1>

            <p class="max-w-2xl text-base leading-7 text-toned sm:text-lg">
              Esta landing apresenta a camada pública do produto: entrada clara,
              proposta profissional, templates e visão de evolução para a
              plataforma SaaS.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              to="/onboarding?preview=1"
              size="xl"
              icon="i-lucide-play"
            >
              Testar fluxo atual
            </UButton>

            <UButton
              to="/dashboard/templates"
              size="xl"
              color="neutral"
              variant="subtle"
              icon="i-lucide-layout-template"
            >
              Explorar templates
            </UButton>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div
              v-for="(item, index) in heroStats"
              :key="item.label"
              v-reveal="{ delay: index * 70 }"
              class="surface-panel p-4"
            >
              <p class="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                {{ item.label }}
              </p>
              <p class="mt-2 text-lg font-semibold text-highlighted">
                {{ item.value }}
              </p>
              <p class="mt-2 text-sm leading-6 text-toned">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <div v-reveal="{ delay: 120 }" class="surface-panel overflow-hidden p-5 sm:p-6">
          <div class="flex items-center justify-between gap-3 border-b border-default/50 pb-4">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-highlighted">
                Preview do produto
              </p>
              <p class="text-sm text-muted">
                Entrada pública + vitrine de templates
              </p>
            </div>

            <UBadge color="primary" variant="subtle">
              MVP público
            </UBadge>
          </div>

          <div class="grid gap-4 pt-5">
            <div class="rounded-2xl border border-default/50 bg-white/70 p-4 dark:bg-white/5">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-highlighted">
                    Landing
                  </p>
                  <p class="text-xs text-muted">
                    Proposta, recursos e templates
                  </p>
                </div>

                <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
              </div>

              <div class="mt-4 h-28 rounded-2xl bg-gradient-to-br from-primary/15 via-secondary/10 to-tertiary/10 p-4">
                <div class="space-y-2">
                  <div class="h-3 w-28 rounded-full bg-primary/30" />
                  <div class="h-3 w-44 rounded-full bg-primary/20" />
                  <div class="h-3 w-36 rounded-full bg-primary/15" />
                </div>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-default/50 bg-white/70 p-4 dark:bg-white/5">
                <div class="flex items-center gap-3">
                  <span class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <UIcon name="i-lucide-list-checks" class="size-5" />
                  </span>

                  <div>
                    <p class="text-sm font-medium text-highlighted">
                      Onboarding
                    </p>
                    <p class="text-xs text-muted">
                      Conta, perfil e conteúdo
                    </p>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-default/50 bg-white/70 p-4 dark:bg-white/5">
                <div class="flex items-center gap-3">
                  <span class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <UIcon name="i-lucide-monitor-smartphone" class="size-5" />
                  </span>

                  <div>
                    <p class="text-sm font-medium text-highlighted">
                      Editor
                    </p>
                    <p class="text-xs text-muted">
                      Preview desktop e mobile
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-default/50 bg-white/70 p-4 dark:bg-white/5">
              <div class="flex flex-wrap gap-2">
                <UBadge color="neutral" variant="soft">
                  Templates por plano
                </UBadge>
                <UBadge color="neutral" variant="soft">
                  Domínio
                </UBadge>
                <UBadge color="neutral" variant="soft">
                  Analytics
                </UBadge>
                <UBadge color="neutral" variant="soft">
                  Publicação
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!--  =========== Faixa de promessas ================ -->
      <!--  ----------- Marquee institucional -------------- -->

      <section v-reveal>
        <div class="surface-panel px-3 py-3 sm:px-4">
          <UMarquee pause-on-hover>
            <div
              v-for="item in promiseItems"
              :key="item"
              class="mx-2 flex items-center gap-2 rounded-full border border-default/60 bg-white/70 px-3 py-2 text-sm text-toned dark:bg-white/5"
            >
              <UIcon name="i-lucide-check" class="size-4 text-primary" />
              <span>{{ item }}</span>
            </div>
          </UMarquee>
        </div>
      </section>

      <!--  =========== Recursos ================ -->
      <!--  ----------- Blocos principais -------------- -->

      <section id="recursos" class="space-y-6">
        <div v-reveal class="space-y-3">
          <UBadge color="primary" variant="subtle">
            Recursos
          </UBadge>

          <div class="space-y-2">
            <h2 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
              A base pública do produto já conversa com o resto da plataforma.
            </h2>
            <p class="max-w-3xl text-base leading-7 text-toned">
              A landing não é uma peça isolada: ela prepara o usuário para auth,
              onboarding, templates, editor visual e publicação.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="(feature, index) in featureCards"
            :key="feature.title"
            v-reveal="{ delay: index * 70 }"
            class="surface-panel p-6"
          >
            <div class="space-y-4">
              <span class="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <UIcon :name="feature.icon" class="size-6" />
              </span>

              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-highlighted">
                  {{ feature.title }}
                </h3>
                <p class="text-sm leading-6 text-toned">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!--  =========== Como funciona ================ -->
      <!--  ----------- Fluxo do produto -------------- -->

      <section id="como-funciona" class="space-y-6">
        <div v-reveal class="space-y-3">
          <UBadge color="primary" variant="subtle">
            Como funciona
          </UBadge>

          <div class="space-y-2">
            <h2 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
              O fluxo da experiência já está desenhado do início até o dashboard.
            </h2>
            <p class="max-w-3xl text-base leading-7 text-toned">
              Nesta etapa a landing explica a jornada, sem misturar a visualização
              do sistema interno com a camada pública de marketing.
            </p>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-4">
          <div
            v-for="(step, index) in flowSteps"
            :key="step.step"
            v-reveal="{ delay: index * 80 }"
            class="surface-panel p-5"
          >
            <div class="space-y-4">
              <span class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary ring-1 ring-primary/20">
                {{ step.step }}
              </span>

              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-highlighted">
                  {{ step.title }}
                </h3>
                <p class="text-sm leading-6 text-toned">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!--  =========== Templates ================ -->
      <!--  ----------- Vitrine inicial -------------- -->

      <section id="templates" class="space-y-6">
        <div v-reveal class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="space-y-3">
            <UBadge color="primary" variant="subtle">
              Templates
            </UBadge>

            <div class="space-y-2">
              <h2 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
                A landing já prepara a vitrine que será testada com dados reais.
              </h2>
              <p class="max-w-3xl text-base leading-7 text-toned">
                Nesta etapa mostramos a intenção visual dos templates sem acoplar
                conteúdo fixo dentro deles.
              </p>
            </div>
          </div>

          <UButton
            to="/dashboard/templates"
            color="neutral"
            variant="subtle"
            icon="i-lucide-arrow-right"
          >
            Abrir galeria atual
          </UButton>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(template, index) in previewTemplates"
            :key="template.id"
            v-reveal="{ delay: index * 60 }"
            class="surface-panel overflow-hidden"
          >
            <div
              class="h-32 w-full bg-linear-to-br"
              :class="template.gradient"
            />

            <div class="space-y-4 p-5">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <p class="text-lg font-semibold text-highlighted">
                    {{ template.name }}
                  </p>
                  <p class="text-sm text-muted">
                    {{ template.category }}
                  </p>
                </div>

                <UBadge
                  :color="tierColor(template.tier)"
                  variant="subtle"
                >
                  {{ tierLabel(template.tier) }}
                </UBadge>
              </div>

              <p class="text-sm leading-6 text-toned">
                {{ template.description }}
              </p>

              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in template.tags"
                  :key="tag"
                  color="neutral"
                  variant="soft"
                >
                  {{ tag }}
                </UBadge>
              </div>

              <div class="rounded-2xl border border-default/60 bg-white/70 p-4 dark:bg-white/5">
                <p class="text-sm font-medium text-highlighted">
                  {{ template.previewTitle }}
                </p>
                <p class="mt-1 text-sm text-muted">
                  {{ template.previewSubtitle }}
                </p>
                <p class="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  {{ template.statsLabel }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!--  =========== CTA final ================ -->
      <!--  ----------- Próximo passo público -------------- -->

      <section v-reveal>
        <div class="surface-panel overflow-hidden p-6 sm:p-8">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div class="space-y-3">
              <UBadge color="primary" variant="subtle">
                Próximo passo
              </UBadge>

              <h2 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
                A landing fica pronta agora para receber login, cadastro e o
                restante do fluxo público.
              </h2>

              <p class="max-w-3xl text-base leading-7 text-toned">
                Depois desta etapa, o caminho mais coerente é conectar auth mock,
                redirecionamentos e então testar os templates com dados reais do
                portfólio.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <UButton
                to="/onboarding?preview=1"
                size="lg"
                icon="i-lucide-rocket"
              >
                Abrir demo atual
              </UButton>

              <UButton
                to="/dashboard/templates"
                size="lg"
                color="neutral"
                variant="subtle"
                icon="i-lucide-layout-dashboard"
              >
                Ver templates
              </UButton>
            </div>
          </div>
        </div>
      </section>
    </UContainer>
  </div>
</template>