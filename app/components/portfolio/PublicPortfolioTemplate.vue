<script setup lang="ts">
import type { PortfolioTemplate } from '~/data/templates'
import type { PublicPortfolioPayload } from '~/types/public-portfolio'

defineProps<{
  template: PortfolioTemplate
  portfolio: PublicPortfolioPayload
}>()
</script>

<template>
  <div class="min-h-screen bg-(--ui-bg) text-(--ui-text)">
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <article class="overflow-hidden rounded-[28px] border border-default bg-default shadow-sm">
        <!--  =========== Hero Pública ================ -->
        <!--  ----------- Cabeçalho do Portfólio -------------- -->

        <section
          v-if="portfolio.visibility.hero"
          class="relative overflow-hidden p-8 sm:p-10"
        >
          <div
            class="absolute inset-0 bg-linear-to-br"
            :class="template.gradient"
          />

          <div class="absolute inset-0 bg-black/25" />

          <div class="relative space-y-5 text-white">
            <div class="flex flex-wrap gap-2">
              <UBadge color="neutral" variant="solid">
                {{ template.name }}
              </UBadge>

              <UBadge color="primary" variant="solid">
                {{ portfolio.publicSlug }}
              </UBadge>

              <UBadge v-if="portfolio.roleTitle" color="success" variant="solid">
                {{ portfolio.roleTitle }}
              </UBadge>
            </div>

            <div class="space-y-2">
              <h1 class="break-words text-3xl font-semibold sm:text-4xl">
                {{ portfolio.publicName }}
              </h1>

              <p v-if="portfolio.headline" class="break-words text-sm text-white/85 sm:text-base">
                {{ portfolio.headline }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-if="portfolio.location"
                color="neutral"
                variant="soft"
                class="max-w-full"
              >
                <span class="break-words">
                  {{ portfolio.location }}
                </span>
              </UBadge>

              <UBadge
                v-for="skill in portfolio.skills"
                :key="skill"
                color="neutral"
                variant="soft"
                class="max-w-full"
              >
                <span class="break-words">
                  {{ skill }}
                </span>
              </UBadge>
            </div>
          </div>
        </section>

        <!--  =========== Corpo Público ================ -->
        <!--  ----------- Seções Persistidas -------------- -->

        <div class="space-y-4 bg-(--ui-bg-elevated) p-4 sm:p-6">
          <section
            v-if="portfolio.visibility.about"
            class="rounded-2xl border border-default bg-default p-5"
          >
            <div class="space-y-2 min-w-0">
              <p class="text-xs font-medium uppercase tracking-wide text-muted">
                Sobre
              </p>

              <h2 class="text-lg font-semibold">
                Resumo profissional
              </h2>

              <p
                v-if="portfolio.summary"
                class="whitespace-pre-line break-words text-sm text-muted"
              >
                {{ portfolio.summary }}
              </p>

              <UAlert
                v-else
                icon="i-lucide-info"
                title="Sem resumo público"
                description="Este portfólio ainda não possui resumo profissional preenchido."
                color="neutral"
                variant="outline"
              />
            </div>
          </section>

          <section
            v-if="portfolio.visibility.projects"
            class="rounded-2xl border border-default bg-default p-5"
          >
            <div class="space-y-4 min-w-0">
              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">
                  Projetos
                </p>

                <h2 class="text-lg font-semibold">
                  Vitrine inicial
                </h2>
              </div>

              <div
                v-if="portfolio.projects.length > 0"
                class="grid gap-4 md:grid-cols-2"
              >
                <article
                  v-for="project in portfolio.projects"
                  :key="project.id"
                  class="min-w-0 rounded-2xl border border-default bg-(--ui-bg-elevated) p-4 shadow-sm"
                >
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="break-words font-medium">
                      {{ project.title }}
                    </p>

                    <UBadge
                      v-if="project.featured"
                      color="success"
                      variant="soft"
                    >
                      Destaque
                    </UBadge>
                  </div>

                  <p class="mt-2 break-words text-xs text-muted">
                    {{ project.category }}
                  </p>

                  <p class="mt-3 whitespace-pre-line break-words text-sm text-muted">
                    {{ project.summary }}
                  </p>

                  <a
                    v-if="project.link"
                    :href="project.link"
                    target="_blank"
                    rel="noreferrer"
                    class="mt-3 block max-w-full break-all text-xs text-primary hover:underline"
                  >
                    {{ project.link }}
                  </a>
                </article>
              </div>

              <UAlert
                v-else
                icon="i-lucide-folder-search"
                title="Nenhum projeto público"
                description="Este portfólio ainda não possui projetos publicados no editor."
                color="neutral"
                variant="outline"
              />
            </div>
          </section>

          <section
            v-if="portfolio.visibility.contact"
            class="rounded-2xl border border-default bg-default p-5"
          >
            <div class="space-y-4 min-w-0">
              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">
                  Contato
                </p>

                <h2 class="text-lg font-semibold">
                  Links públicos
                </h2>
              </div>

              <div
                v-if="portfolio.links.length > 0"
                class="space-y-3 min-w-0"
              >
                <div
                  v-for="item in portfolio.links"
                  :key="`${item.label}-${item.value}`"
                  class="min-w-0 rounded-xl border border-default bg-(--ui-bg-elevated) px-3 py-2"
                >
                  <p class="text-xs uppercase tracking-wide text-muted">
                    {{ item.label }}
                  </p>

                  <a
                    :href="item.href"
                    target="_blank"
                    rel="noreferrer"
                    class="mt-1 block max-w-full break-all text-sm font-medium text-primary hover:underline"
                  >
                    {{ item.value }}
                  </a>
                </div>
              </div>

              <UAlert
                v-else
                icon="i-lucide-send"
                title="Nenhum link público disponível"
                description="Este portfólio ainda não possui canais públicos expostos."
                color="neutral"
                variant="outline"
              />
            </div>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>