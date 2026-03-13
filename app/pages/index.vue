<script setup lang="ts">
definePageMeta({
  layout: 'marketing'
})

useSeoMeta({
  title: 'Lumio',
  description:
    'Crie, personalize e publique seu portfólio profissional com a Lumio.',
  ogTitle: 'Lumio',
  ogDescription:
    'Organize seu conteúdo, escolha sua base visual e publique uma página profissional com mais clareza e presença.'
})

const heroStats = [
  {
    label: 'Entrada guiada',
    value: 'Configuração inicial',
    description: 'Comece com o essencial e avance com mais clareza desde o primeiro acesso.'
  },
  {
    label: 'Personalização',
    value: 'Templates',
    description: 'Escolha uma base visual pronta para destacar seu trabalho com mais consistência.'
  },
  {
    label: 'Publicação',
    value: 'Página profissional',
    description: 'Organize seu conteúdo e deixe sua apresentação pronta para compartilhar.'
  }
]

const featureCards = [
  {
    icon: 'i-lucide-layout-template',
    title: 'Templates prontos para começar',
    description:
      'Escolha uma base visual clara e profissional para apresentar seu conteúdo com mais presença.'
  },
  {
    icon: 'i-lucide-file-pen-line',
    title: 'Configuração guiada',
    description:
      'Preencha suas informações principais em poucos passos e monte sua base inicial com mais agilidade.'
  },
  {
    icon: 'i-lucide-monitor-smartphone',
    title: 'Edição visual',
    description:
      'Ajuste seus textos, links e seções em uma experiência pensada para revisão rápida.'
  },
  {
    icon: 'i-lucide-folders',
    title: 'Projetos organizados',
    description:
      'Apresente seus trabalhos, organize seus destaques e mantenha tudo fácil de atualizar.'
  },
  {
    icon: 'i-lucide-globe',
    title: 'Página pronta para compartilhar',
    description:
      'Transforme seu conteúdo em uma página pública com aparência profissional e leitura objetiva.'
  },
  {
    icon: 'i-lucide-refresh-cw',
    title: 'Atualizações simples',
    description:
      'Edite sua apresentação sempre que precisar, sem complicar seu fluxo de trabalho.'
  }
]

const flowSteps = [
  {
    step: '01',
    title: 'Crie sua conta',
    description: 'Comece sua presença profissional com uma base clara e pronta para evoluir.'
  },
  {
    step: '02',
    title: 'Preencha suas informações',
    description: 'Adicione os dados principais do seu perfil e organize sua apresentação.'
  },
  {
    step: '03',
    title: 'Ajuste sua página',
    description: 'Escolha sua base visual e refine os conteúdos que vão aparecer para o público.'
  },
  {
    step: '04',
    title: 'Publique quando estiver pronto',
    description: 'Deixe sua página pronta para compartilhar com recrutadores, clientes e contatos.'
  }
]

const templatePreviewCards = [
  {
    title: 'Portfólio profissional',
    text: 'Estrutura ideal para apresentar projetos, trajetória, links e presença profissional.',
    badge: 'Essencial'
  },
  {
    title: 'Página com foco em serviços',
    text: 'Base visual pensada para quem quer apresentar atuação, proposta e posicionamento.',
    badge: 'Business'
  },
  {
    title: 'Apresentação premium',
    text: 'Composições mais marcantes para destacar percepção de valor e identidade visual.',
    badge: 'Premium'
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
              Portfólios profissionais
            </UBadge>

            <UBadge color="neutral" variant="soft">
              Design claro
            </UBadge>

            <UBadge color="neutral" variant="soft">
              Publicação simples
            </UBadge>
          </div>

          <div class="space-y-4">
            <h1 class="max-w-[11ch] text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl xl:text-[4.6rem] xl:leading-[0.92]">
              Crie, personalize e publique seu portfólio com a Lumio.
            </h1>

            <p class="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Organize seu conteúdo, escolha sua base visual e publique uma página profissional com mais clareza e presença.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              to="/portfolio"
              size="xl"
              icon="i-lucide-eye"
            >
              Ver demonstração
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
                Tudo em um só lugar
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Conta, conteúdo e página pública
              </p>
            </div>

            <UBadge color="primary" variant="subtle">
              Lumio
            </UBadge>
          </div>

          <div class="grid gap-4 pt-5">
            <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/5">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">
                    Página pública
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Sua apresentação online
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
                      Configuração inicial
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Dados principais da sua conta
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
                      Conteúdo e apresentação
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
                  Perfil
                </UBadge>
                <UBadge color="neutral" variant="soft">
                  Editor
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
              Uma base clara para montar sua presença profissional.
            </h2>
            <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              A Lumio reúne o essencial para organizar seu conteúdo, ajustar sua apresentação e publicar sua página com mais segurança.
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
              Monte sua página em poucos passos.
            </h2>
            <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Crie sua conta, organize seu conteúdo, ajuste sua apresentação e publique quando estiver pronto.
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
                Bases visuais para diferentes estilos de apresentação.
              </h2>
              <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Escolha a direção visual que combina com seu perfil e ajuste sua página com mais personalidade.
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
                  Visual pronto para receber seu conteúdo
                </p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Escolha a base que faz mais sentido para sua apresentação e refine sua página com tranquilidade.
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
                Comece agora
              </UBadge>

              <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Deixe sua apresentação pronta para mostrar seu trabalho com mais força.
              </h2>

              <p class="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Crie sua conta, organize seu conteúdo e avance para uma página profissional com mais clareza, consistência e presença.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <UButton
                to="/portfolio"
                size="lg"
                icon="i-lucide-eye"
              >
                Ver demonstração
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