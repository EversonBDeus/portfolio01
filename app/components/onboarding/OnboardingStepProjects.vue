<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'
import type {
  OnboardingProjectsData,
  OnboardingProjectsErrors
} from '~/composables/useOnboardingState'

const props = defineProps<{
  model: OnboardingProjectsData
  errors: OnboardingProjectsErrors
  canAddProject: boolean
  projectCount: number
  featuredProjectCount: number
}>()

const emit = defineEmits<{
  'add-project': []
  'clear-draft': []
  'remove-project': [projectId: string]
  'toggle-featured': [projectId: string]
}>()

const {
  inputUi,
  textareaUi,
  floatingLabelSurfaceClass
} = useDashboardFormUi()

const PROJECT_TITLE_MAX = 80
const PROJECT_CATEGORY_MAX = 60
const PROJECT_SUMMARY_MAX = 800
const PROJECT_LINK_MAX = 200

const showDraftValidation = ref(false)

const summaryTextareaUi = {
  ...textareaUi,
  base: `${textareaUi.base} resize-none overflow-y-auto min-h-[12rem] max-h-[12rem]`
}

const labelSurfaceClass = `${floatingLabelSurfaceClass} leading-none`

const categorySuggestions = [
  'Projeto autoral',
  'Projeto para cliente',
  'Estudo de caso',
  'Serviço realizado',
  'Campanha',
  'Pesquisa',
  'Produto',
  'Apresentação',
  'Outro'
]

function limitText(value: string, max: number) {
  return value.slice(0, max)
}

props.model.draft.title = limitText(props.model.draft.title, PROJECT_TITLE_MAX)
props.model.draft.category = limitText(props.model.draft.category, PROJECT_CATEGORY_MAX)
props.model.draft.summary = limitText(props.model.draft.summary, PROJECT_SUMMARY_MAX)
props.model.draft.link = limitText(props.model.draft.link, PROJECT_LINK_MAX)

const hasDraftContent = computed(() => {
  return Object.values(props.model.draft).some(value => value.trim().length > 0)
})

const shouldShowDraftErrors = computed(() => {
  return showDraftValidation.value || hasDraftContent.value
})

const draftCategoryLabel = computed(() => {
  return props.model.draft.category.trim() || 'Não definida'
})

const counters = computed(() => ({
  title: `${props.model.draft.title.length}/${PROJECT_TITLE_MAX}`,
  category: `${props.model.draft.category.length}/${PROJECT_CATEGORY_MAX}`,
  summary: `${props.model.draft.summary.length}/${PROJECT_SUMMARY_MAX}`,
  link: `${props.model.draft.link.length}/${PROJECT_LINK_MAX}`
}))

function getFloatingLabelClass(value: string, offsetClass = 'start-3') {
  const hasValue = value.trim().length > 0

  return [
    'pointer-events-none absolute z-[1] transition-all duration-200',
    offsetClass,
    hasValue
      ? 'top-px -translate-y-1/2 text-xs font-medium text-highlighted'
      : 'top-1/2 -translate-y-1/2 text-sm font-normal text-dimmed peer-focus:top-px peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-highlighted'
  ]
}

function selectCategory(option: string) {
  props.model.draft.category = props.model.draft.category === option
    ? ''
    : option.slice(0, PROJECT_CATEGORY_MAX)
}

function handleAddProject() {
  showDraftValidation.value = true

  if (!props.canAddProject) return

  emit('add-project')
  showDraftValidation.value = false
}

function handleClearDraft() {
  emit('clear-draft')
  showDraftValidation.value = false
}
</script>

<template>
  <div class="space-y-6">
    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-folder-kanban"
      title="Informações principais"
      description="Aqui entram os primeiros projetos, trabalhos ou estudos de caso que depois alimentam o portfólio, os templates e o editor."
      color="neutral"
      variant="outline"
    />

    <div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <div class="space-y-5">
          <div class="space-y-1">
            <h3 class="text-base font-semibold">Adicionar projeto ou trabalho</h3>
            <p class="text-sm text-muted">
              Cadastre um item por vez para já montar a base inicial da vitrine pública.
            </p>
          </div>

          <div class="min-w-0 space-y-2">
            <div class="relative">
              <UInput
                v-model="model.draft.title"
                :maxlength="PROJECT_TITLE_MAX"
                :placeholder="' '"
                size="lg"
                class="w-full"
                :ui="inputUi"
              >
                <template #default>
                  <label :class="getFloatingLabelClass(model.draft.title, 'inset-s-3')">
                    <span :class="labelSurfaceClass">
                      Nome do projeto ou trabalho
                    </span>
                  </label>
                </template>
              </UInput>
            </div>

            <div class="flex min-h-5 items-start justify-between gap-3">
              <p
                v-if="shouldShowDraftErrors && errors.title"
                class="text-sm text-red-500"
              >
                {{ errors.title }}
              </p>

              <span class="ml-auto shrink-0 text-xs text-muted">
                {{ counters.title }}
              </span>
            </div>
          </div>

          <div class="min-w-0 space-y-3">
            <div class="relative">
              <UInput
                v-model="model.draft.category"
                :maxlength="PROJECT_CATEGORY_MAX"
                :placeholder="' '"
                size="lg"
                class="w-full"
                :ui="inputUi"
              >
                <template #default>
                  <label :class="getFloatingLabelClass(model.draft.category, 'inset-s-3')">
                    <span :class="labelSurfaceClass">
                      Categoria ou tipo
                    </span>
                  </label>
                </template>
              </UInput>
            </div>

            <div class="flex min-h-5 justify-end">
              <span class="shrink-0 text-xs text-muted">
                {{ counters.category }}
              </span>
            </div>

            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="option in categorySuggestions"
                :key="option"
                :color="model.draft.category === option ? 'primary' : 'neutral'"
                :variant="model.draft.category === option ? 'soft' : 'outline'"
                size="sm"
                type="button"
                @click="selectCategory(option)"
              >
                {{ option }}
              </UButton>
            </div>

            <div class="min-w-0 rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) px-3 py-2">
              <p class="text-xs uppercase tracking-wide text-muted">Categoria atual</p>
              <p class="mt-1 break-words text-sm font-medium [overflow-wrap:anywhere]">
                {{ draftCategoryLabel }}
              </p>
            </div>
          </div>

          <div class="min-w-0 space-y-2">
            <div class="relative">
              <UTextarea
                v-model="model.draft.summary"
                :rows="8"
                :maxlength="PROJECT_SUMMARY_MAX"
                :placeholder="' '"
                class="w-full"
                :ui="summaryTextareaUi"
              />
              <label :class="getFloatingLabelClass(model.draft.summary, 'inset-s-3')">
                <span :class="labelSurfaceClass">
                  Resumo do projeto ou trabalho
                </span>
              </label>
            </div>

            <div class="flex min-h-5 items-start justify-between gap-3">
              <p
                v-if="shouldShowDraftErrors && errors.summary"
                class="text-sm text-red-500"
              >
                {{ errors.summary }}
              </p>

              <span class="ml-auto shrink-0 text-xs text-muted">
                {{ counters.summary }}
              </span>
            </div>
          </div>

          <div class="min-w-0 space-y-2">
            <div class="relative">
              <UInput
                v-model="model.draft.link"
                :maxlength="PROJECT_LINK_MAX"
                :placeholder="' '"
                type="url"
                size="lg"
                class="w-full"
                :ui="inputUi"
              >
                <template #default>
                  <label :class="getFloatingLabelClass(model.draft.link, 'inset-s-3')">
                    <span :class="labelSurfaceClass">
                      Link opcional
                    </span>
                  </label>
                </template>
              </UInput>
            </div>

            <div class="flex min-h-5 justify-end">
              <span class="shrink-0 text-xs text-muted">
                {{ counters.link }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              color="primary"
              type="button"
              @click="handleAddProject"
            >
              Adicionar projeto
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              :disabled="!hasDraftContent"
              type="button"
              @click="handleClearDraft"
            >
              Limpar rascunho
            </UButton>
          </div>
        </div>
      </div>

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <div class="space-y-5">
          <div class="space-y-1">
            <h3 class="text-base font-semibold">Panorama da vitrine</h3>
            <p class="text-sm text-muted">
              Essa etapa é opcional, mas já ajuda a deixar sua página mais completa.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
              <p class="text-xs uppercase tracking-wide text-muted">Projetos adicionados</p>
              <p class="mt-2 text-2xl font-semibold">{{ projectCount }}</p>
            </div>

            <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
              <p class="text-xs uppercase tracking-wide text-muted">Em destaque</p>
              <p class="mt-2 text-2xl font-semibold">{{ featuredProjectCount }}</p>
            </div>
          </div>

          <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
            <p class="text-sm font-medium">Essa base alimenta</p>

            <div class="mt-3 flex flex-wrap gap-2">
              <UBadge color="neutral" variant="soft">Portfólio público</UBadge>
              <UBadge color="neutral" variant="soft">Templates</UBadge>
              <UBadge color="neutral" variant="soft">Editor visual</UBadge>
              <UBadge color="neutral" variant="soft">Dashboard</UBadge>
            </div>
          </div>

          <UAlert
            class="dashboard-note-alert"
            icon="i-lucide-info"
            title="Pode completar depois"
            description="Você pode seguir sem adicionar nada agora e voltar depois no painel para cadastrar mais projetos com calma."
            color="neutral"
            variant="outline"
          />
        </div>
      </div>
    </div>

    <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
      <div class="space-y-4">
        <div class="space-y-1 min-w-0">
          <h3 class="text-base font-semibold">Projetos adicionados</h3>
          <p class="break-words text-sm text-muted [overflow-wrap:anywhere]">
            Os itens desta lista já formam a base inicial dos seus projetos.
          </p>
        </div>

        <div
          v-if="model.items.length"
          class="grid gap-4 xl:grid-cols-2"
        >
          <div
            v-for="item in model.items"
            :key="item.id"
            class="min-w-0 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="break-words text-base font-semibold [overflow-wrap:anywhere]">
                  {{ item.title }}
                </p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <UBadge color="neutral" variant="soft" class="max-w-full">
                    <span class="break-words [overflow-wrap:anywhere]">
                      {{ item.category }}
                    </span>
                  </UBadge>

                  <UBadge
                    v-if="item.featured"
                    color="success"
                    variant="soft"
                  >
                    Em destaque
                  </UBadge>
                </div>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash-2"
                type="button"
                @click="emit('remove-project', item.id)"
              />
            </div>

            <p class="mt-4 whitespace-pre-line break-words text-sm text-muted [overflow-wrap:anywhere]">
              {{ item.summary }}
            </p>

            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              rel="noreferrer"
              class="mt-4 inline-flex max-w-full break-all text-sm font-medium text-primary hover:underline"
            >
              {{ item.link }}
            </a>

            <div class="mt-4 flex flex-wrap gap-3">
              <UButton
                :color="item.featured ? 'success' : 'neutral'"
                :variant="item.featured ? 'soft' : 'outline'"
                size="sm"
                type="button"
                @click="emit('toggle-featured', item.id)"
              >
                {{ item.featured ? 'Remover destaque' : 'Marcar como destaque' }}
              </UButton>
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-5"
        >
          <p class="text-sm text-muted">
            Nenhum projeto foi adicionado ainda. Você pode continuar assim ou já cadastrar alguns itens para formar a vitrine inicial.
          </p>
        </div>
      </div>
    </div>

      <UAlert
        class="dashboard-note-alert"
        :icon="projectCount ? 'i-lucide-circle-check' : 'i-lucide-info'"
        :title="projectCount ? 'Projetos iniciais prontos' : 'Projetos podem ser adicionados depois'"
        :description="projectCount ? 'Sua vitrine já começa com itens cadastrados.' : 'Essa etapa é opcional. Você pode entrar no painel agora e cadastrar seus projetos quando quiser.'"
        :color="projectCount ? 'success' : 'neutral'"
        variant="outline"
      />
  </div>
</template>