<script setup lang="ts">
definePageMeta({
  layout: 'marketing'
})

useSeoMeta({
  title: 'Portfolio SaaS',
  description:
    'Crie um portfólio profissional com onboarding, templates e editor visual em uma base pronta para evoluir para SaaS.',
  ogTitle: 'Portfolio SaaS',
  ogDescription:
    'Landing pública da plataforma com foco em templates, editor visual e fluxo de entrada do produto.'
})

const heroStats = [
  {
    label: 'Entrada guiada',
    value: 'Onboarding',
    description: 'Fluxo pensado para evitar painel vazio e estruturar os dados públicos.'
  },
  {
    label: 'Personalização',
    value: 'Templates',
    description: 'Base preparada para múltiplos modelos visuais com evolução futura por plano.'
  },
  {
    label: 'Edição',
    value: 'Editor visual',
    description: 'Preview e edição já começaram a ser construídos para o fluxo do produto.'
  }
]

const featureCards = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Templates prontos para escalar',
    description:
      'A plataforma já está sendo organizada para suportar templates diferentes sem misturar dados no layout.'
  },
  {
    icon: 'i-lucide-file-pen-line',
    title: 'Onboarding antes do dashboard',
    description:
      'O usuário entra pelo fluxo guiado e preenche o conteúdo essencial antes de cair no painel.'
  },
  {
    icon: 'i-lucide-monitor-smartphone',
    title: 'Editor visual em evolução',
    description:
      'A base do editor já foi iniciada para permitir preview e edição do conteúdo público.'
  },
  {
    icon: 'i-lucide-chart-column-big',
    title: 'Pronto para analytics',
    description:
      'A arquitetura já considera dashboards, planos e evolução para métricas do portfólio.'
  },
  {
    icon: 'i-lucide-globe',
    title: 'Pensado para publicação',
    description:
      'O produto foi estruturado para evoluir para publicação pública, domínio e fluxo de ativação.'
  },
  {
    icon: 'i-lucide-badge-dollar-sign',
    title: 'Base para SaaS',
    description:
      'O projeto deixou de ser só um portfólio pessoal e está sendo organizado como produto.'
  }
]

const flowSteps = [
  {
    step: '01',
    title: 'Landing pública',
    description: 'A página inicial apresenta o produto e separa claramente a camada pública do sistema interno.'
  },
  {
    step: '02',
    title: 'Login e cadastro',
    description: 'Depois da landing, a próxima camada natural é autenticação.'
  },
  {
    step: '03',
    title: 'Onboarding',
    description: 'O usuário preenche dados da conta e dados públicos do portfólio antes do painel.'
  },
  {
    step: '04',
    title: 'Dashboard e templates',
    description: 'A partir daí entra no painel, escolhe template, edita e publica.'
  }
]

const templatePreviewCards = [
  {
    title: 'Portfólio profissional',
    text: 'Estrutura para projetos, bio, links públicos e apresentação pessoal.',
    badge: 'Free'
  },
  {
    title: 'Template com foco em serviços',
    text: 'Base preparada para evolução futura com posicionamento mais comercial.',
    badge: 'Plus'
  },
  {
    title: 'Template premium',
    text: 'Visuais mais fortes para planos mais altos e experiências mais completas.',
    badge: 'Pro'
  }
]
</script>

<template>
  <div class="pb-16 sm:pb-24">
    <div class="mx-auto max-w-[1560px] space-y-12 px-4 sm:px-6 lg:px-8 sm:space-y-16">
      <!--  =========== Hero ================ -->
      <!--  ----------- Proposta principal -------------- -->

      <section class="grid gap-8 xl:min-h-[calc(100vh-10rem)] xl:grid-cols-[minmax(0,1.02fr)_minmax(560px,0.98fr)] xl:items-center">
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
            <h1 class="max-w-[11ch] text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl xl:text-[4.6rem] xl:leading-[0.92]">
              Monte seu portfólio com templates, onboarding e editor visual.
            </h1>

            <p class="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Esta landing inaugura a camada pública do produto sem misturar o visual do dashboard nem o template do portfólio.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              to="/portfolio"
              size="xl"
              icon="i-lucide-eye"
            >
              Ver portfólio atual
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
              class="rounded-[1.25rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
            >
              <p class="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {{ item.label }}
              </p>
              <p class="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {{ item.value }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-reveal="{ delay: 120 }"
          class="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:p-6"
        >
          <div class="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-white/10">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-slate-900 dark:text-white">
                Visão do produto
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Entrada pública + fluxo interno
              </p>
            </div>

            <UBadge color="primary" variant="subtle">
              MVP
            </UBadge>
          </div>

          <div class="grid gap-4 pt-5">
            <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/5">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">
                    Camada pública
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Landing, vitrine e descoberta
                  </p>
                </div>

                <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
              </div>

              <div class="mt-4 rounded-2xl bg-gradient-to-br from-primary/15 via-sky-200/30 to-emerald-200/30 p-4 dark:from-primary/10 dark:via-sky-400/10 dark:to-emerald-400/10">
                <div class="space-y-2">
                  <div class="h-3 w-28 rounded-full bg-primary/30" />
                  <div class="h-3 w-44 rounded-full bg-primary/20" />
                  <div class="h-3 w-36 rounded-full bg-primary/15" />
                </div>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/5">
                <div class="flex items-center gap-3">
                  <span class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <UIcon name="i-lucide-list-checks" class="size-5" />
                  </span>

                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-white">
                      Onboarding
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Conta e dados públicos
                    </p>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/5">
                <div class="flex items-center gap-3">
                  <span class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <UIcon name="i-lucide-monitor-smartphone" class="size-5" />
                  </span>

                  <div>
                    <p class="text-sm font-medium text-slate-900 dark:text-white">
                      Editor
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Preview e personalização
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/5">
              <div class="flex flex-wrap gap-2">
                <UBadge color="neutral" variant="soft">
                  Templates
                </UBadge>
                <UBadge color="neutral" variant="soft">
                  Dashboard
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

      <!--  =========== Recursos ================ -->
      <!--  ----------- Blocos principais -------------- -->

      <section id="recursos" class="space-y-6">
        <div v-reveal class="space-y-3">
          <UBadge color="primary" variant="subtle">
            Recursos
          </UBadge>

          <div class="space-y-2">
            <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              A landing organiza a entrada do produto sem misturar portfólio, editor e painel.
            </h2>
            <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Nesta etapa, a página pública apresenta o produto e prepara o terreno para login, cadastro e testes reais com templates.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="(feature, index) in featureCards"
            :key="feature.title"
            v-reveal="{ delay: index * 70 }"
            class="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
          >
            <div class="space-y-4">
              <span class="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <UIcon :name="feature.icon" class="size-6" />
              </span>

              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ feature.title }}
                </h3>
                <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
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
            <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              O fluxo público do projeto já está bem definido.
            </h2>
            <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              A landing vem antes de login, cadastro, onboarding e dashboard.
            </p>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-4">
          <div
            v-for="(step, index) in flowSteps"
            :key="step.step"
            v-reveal="{ delay: index * 80 }"
            class="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
          >
            <div class="space-y-4">
              <span class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary ring-1 ring-primary/20">
                {{ step.step }}
              </span>

              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ step.title }}
                </h3>
                <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
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
              <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                A vitrine pública prepara o próximo passo sem hardcode no template.
              </h2>
              <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                O template público deve apenas renderizar dados, sem misturar regras do sistema ou conteúdo fixo nele.
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
            v-for="(item, index) in templatePreviewCards"
            :key="item.title"
            v-reveal="{ delay: index * 70 }"
            class="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
          >
            <div class="h-32 w-full bg-gradient-to-br from-primary/15 via-sky-200/30 to-emerald-200/30 dark:from-primary/10 dark:via-sky-400/10 dark:to-emerald-400/10" />

            <div class="space-y-4 p-5">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <p class="text-lg font-semibold text-slate-900 dark:text-white">
                    {{ item.title }}
                  </p>
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    {{ item.text }}
                  </p>
                </div>

                <UBadge color="neutral" variant="soft">
                  {{ item.badge }}
                </UBadge>
              </div>

              <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/5">
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  Estrutura visual separada dos dados
                </p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  A próxima etapa vai plugar dados reais do portfólio sem transformar o template em conteúdo hardcoded.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!--  =========== CTA final ================ -->
      <!--  ----------- Próximo passo -------------- -->

      <section v-reveal>
        <div class="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div class="space-y-3">
              <UBadge color="primary" variant="subtle">
                Próximo passo
              </UBadge>

              <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Depois da landing, o próximo bloco natural é login e cadastro.
              </h2>

              <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                O fluxo já foi consolidado nessa ordem: landing pública, autenticação, onboarding e dashboard.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <UButton
                to="/portfolio"
                size="lg"
                icon="i-lucide-eye"
              >
                Ver demo atual
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
    </div>
  </div>
</template>