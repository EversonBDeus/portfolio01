<script setup lang="ts">
import { computed } from 'vue'
import type { EditorDevice, EditorPreviewData, EditorSectionVisibility } from '~/composables/useEditorState'
import type { EditorSectionId } from '~/data/editor-sections'
import type { PortfolioTemplate } from '~/data/templates'

const props = defineProps<{
  template: PortfolioTemplate
  preview: EditorPreviewData
  device: EditorDevice
  activeSection: EditorSectionId
  visibility: EditorSectionVisibility
}>()

const frameClass = computed(() => {
  return props.device === 'mobile'
    ? 'mx-auto max-w-[390px]'
    : 'mx-auto max-w-5xl'
})

function sectionClass(sectionId: EditorSectionId) {
  return props.activeSection === sectionId
    ? 'border-primary/60 shadow-[0_0_0_1px_rgba(34,197,94,0.18)]'
    : 'border-white/10'
}
</script>

<template>
  <div class="space-y-4">
    <!--  =========== Cabeçalho do Preview ================ -->
    <!--  ----------- Estado do Frame -------------- -->

    <div
      class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs)"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="font-medium">Preview do template</p>
          <p class="text-sm text-muted">
            Base visual do editor conectada ao template selecionado e aos dados já coletados no onboarding.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UBadge color="primary" variant="subtle">
            {{ template.name }}
          </UBadge>

          <UBadge color="neutral" variant="soft">
            {{ device === 'desktop' ? 'Desktop' : 'Mobile' }}
          </UBadge>
        </div>
      </div>
    </div>

    <!--  =========== Frame do Template ================ -->
    <!--  ----------- Renderização Visual -------------- -->

    <div
      class="dashboard-form-surface-3 rounded-[28px] border border-(--dashboard-border-strong) bg-(--dashboard-surface-3) p-3 shadow-(--dashboard-shadow-md) sm:p-4"
    >
      <div :class="frameClass">
        <article class="overflow-hidden rounded-[24px] border border-white/10 bg-black/10 shadow-(--dashboard-shadow-md)">
          <!--  =========== Hero ================ -->
          <!--  ----------- Cabeçalho do Template -------------- -->

          <section
            v-if="visibility.hero"
            class="relative overflow-hidden border p-6 sm:p-8"
            :class="sectionClass('hero')"
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
                  {{ preview.roleTitle }}
                </UBadge>
              </div>

              <div class="space-y-2">
                <h2 class="break-words text-2xl font-semibold sm:text-3xl">
                  {{ preview.publicName }}
                </h2>

                <p class="break-words text-sm text-white/85 sm:text-base">
                  {{ preview.headline }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-if="preview.location"
                  color="neutral"
                  variant="soft"
                  class="max-w-full"
                >
                  <span class="break-words">
                    {{ preview.location }}
                  </span>
                </UBadge>

                <UBadge
                  v-for="skill in preview.skills"
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

          <!--  =========== Corpo do Template ================ -->
          <!--  ----------- Seções Principais -------------- -->

          <div class="space-y-4 bg-(--dashboard-surface-3) p-4 sm:p-6">
            <!--  =========== Sobre ================ -->
            <!--  ----------- Resumo Profissional -------------- -->

            <section
              v-if="visibility.about"
              class="rounded-2xl border bg-(--dashboard-surface-2) p-5"
              :class="sectionClass('about')"
            >
              <div class="space-y-2 min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">
                  Sobre
                </p>

                <h3 class="text-lg font-semibold">
                  Resumo profissional
                </h3>

                <p class="whitespace-pre-line break-words text-sm text-muted">
                  {{ preview.summary }}
                </p>
              </div>
            </section>

            <!--  =========== Projetos ================ -->
            <!--  ----------- Vitrine Inicial -------------- -->

            <section
              v-if="visibility.projects"
              class="rounded-2xl border bg-(--dashboard-surface-2) p-5"
              :class="sectionClass('projects')"
            >
              <div class="space-y-4 min-w-0">
                <div class="space-y-1">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted">
                    Projetos
                  </p>

                  <h3 class="text-lg font-semibold">
                    Vitrine inicial
                  </h3>
                </div>

                <div
                  v-if="preview.projects.length > 0"
                  class="grid gap-4 md:grid-cols-2"
                >
                  <article
                    v-for="project in preview.projects"
                    :key="project.id"
                    class="min-w-0 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4 shadow-(--dashboard-shadow-xs)"
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
                  title="Nenhum projeto disponível ainda"
                  description="Adicione projetos no onboarding ou no painel para alimentar esta área do template."
                  color="neutral"
                  variant="outline"
                />
              </div>
            </section>

            <!--  =========== Contato ================ -->
            <!--  ----------- Links Públicos -------------- -->

            <section
              v-if="visibility.contact"
              class="rounded-2xl border bg-(--dashboard-surface-2) p-5"
              :class="sectionClass('contact')"
            >
              <div class="space-y-4 min-w-0">
                <div class="space-y-1">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted">
                    Contato
                  </p>

                  <h3 class="text-lg font-semibold">
                    Links públicos
                  </h3>
                </div>

                <div
                  v-if="preview.links.length > 0"
                  class="space-y-3 min-w-0"
                >
                  <div
                    v-for="item in preview.links"
                    :key="`${item.label}-${item.value}`"
                    class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) px-3 py-2"
                  >
                    <p class="text-xs uppercase tracking-wide text-muted">
                      {{ item.label }}
                    </p>

                    <a
                      v-if="item.href"
                      :href="item.href"
                      target="_blank"
                      rel="noreferrer"
                      class="mt-1 block max-w-full break-all text-sm font-medium text-primary hover:underline"
                    >
                      {{ item.value }}
                    </a>

                    <p
                      v-else
                      class="mt-1 break-words text-sm font-medium"
                    >
                      {{ item.value }}
                    </p>
                  </div>
                </div>

                <UAlert
                  v-else
                  icon="i-lucide-send"
                  title="Nenhum link público disponível ainda"
                  description="Adicione canais públicos no editor para alimentar esta seção do template."
                  color="neutral"
                  variant="outline"
                />
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>