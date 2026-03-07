<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'
import type {
  OnboardingProjectsData,
  OnboardingProjectsErrors
} from '~/composables/useOnboardingState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

//  =========== Props e Eventos ================
//  ----------- Entrada da Etapa Projetos --------------

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

//  =========== UI Local ================
//  ----------- Textarea e Estado Visual --------------

const { textareaUi, floatingLabelBaseClass, floatingLabelSurfaceClass } = useDashboardFormUi()

const showDraftValidation = ref(false)

const summaryTextareaUi = {
  ...textareaUi,
  base: `${textareaUi.base} resize-none overflow-y-auto min-h-[12rem] max-h-[12rem]`
}

//  =========== Opções da Etapa ================
//  ----------- Sugestões de Categoria --------------

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

//  =========== Computeds da Etapa ================
//  ----------- Estado do Rascunho --------------

const hasDraftContent = computed(() => {
  return Object.values(props.model.draft).some(value => value.trim().length > 0)
})

const shouldShowDraftErrors = computed(() => {
  return showDraftValidation.value || hasDraftContent.value
})

const draftCategoryLabel = computed(() => {
  return props.model.draft.category.trim() || 'Não definida'
})

//  =========== Ações da Etapa ================
//  ----------- Manipulação do Rascunho --------------

function selectCategory(option: string) {
  props.model.draft.category = props.model.draft.category === option ? '' : option
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
    <!--  =========== Introdução da Etapa Projetos ================ -->
    <!--  ----------- Contexto Inicial -------------- -->

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-folder-kanban"
      title="Dados desta etapa"
      description="Aqui entram os primeiros projetos, trabalhos ou estudos de caso que depois alimentam o portfólio, os templates e o editor."
      color="neutral"
      variant="outline"
    />

    <div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
      <!--  =========== Formulário do Projeto ================ -->
      <!--  ----------- Cadastro Rápido -------------- -->

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <div class="space-y-5">
          <div class="space-y-1">
            <h3 class="text-base font-semibold">Adicionar projeto ou trabalho</h3>
            <p class="text-sm text-muted">
              Cadastre um item por vez para já montar a base inicial da vitrine pública.
            </p>
          </div>

          <div class="space-y-2">
            <DashboardFloatingInput
              v-model="model.draft.title"
              label="Nome do projeto ou trabalho"
            />
            <p
              v-if="shouldShowDraftErrors && errors.title"
              class="text-sm text-red-500"
            >
              {{ errors.title }}
            </p>
          </div>

          <div class="space-y-3">
            <DashboardFloatingInput
              v-model="model.draft.category"
              label="Categoria ou tipo"
            />

            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="option in categorySuggestions"
                :key="option"
                :color="model.draft.category === option ? 'primary' : 'neutral'"
                :variant="model.draft.category === option ? 'soft' : 'outline'"
                size="sm"
                @click="selectCategory(option)"
              >
                {{ option }}
              </UButton>
            </div>

            <div class="rounded-xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) px-3 py-2">
              <p class="text-xs uppercase tracking-wide text-muted">Categoria atual</p>
              <p class="mt-1 text-sm font-medium">{{ draftCategoryLabel }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <div class="relative">
              <UTextarea
                v-model="model.draft.summary"
                :rows="8"
                :placeholder="' '"
                class="w-full"
                :ui="summaryTextareaUi"
              />
              <label :class="[floatingLabelBaseClass, 'inset-3']">
                <span :class="floatingLabelSurfaceClass">
                  Resumo do projeto ou trabalho
                </span>
              </label>
            </div>

            <p
              v-if="shouldShowDraftErrors && errors.summary"
              class="text-sm text-red-500"
            >
              {{ errors.summary }}
            </p>
          </div>

          <DashboardFloatingInput
            v-model="model.draft.link"
            label="Link opcional"
            type="url"
          />

          <div class="flex flex-wrap gap-3">
            <UButton
              color="primary"
              @click="handleAddProject"
            >
              Adicionar projeto
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              :disabled="!hasDraftContent"
              @click="handleClearDraft"
            >
              Limpar rascunho
            </UButton>
          </div>
        </div>
      </div>

      <!--  =========== Resumo da Etapa Projetos ================ -->
      <!--  ----------- Indicadores e Dicas -------------- -->

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <div class="space-y-5">
          <div class="space-y-1">
            <h3 class="text-base font-semibold">Panorama da vitrine</h3>
            <p class="text-sm text-muted">
              Essa etapa é opcional, mas já ajuda a evitar um portfólio vazio na primeira entrada.
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

    <!--  =========== Lista de Projetos Adicionados ================ -->
    <!--  ----------- Cards da Etapa Projetos -------------- -->

    <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
      <div class="space-y-4">
        <div class="space-y-1">
          <h3 class="text-base font-semibold">Projetos adicionados</h3>
          <p class="text-sm text-muted">
            Os itens desta lista já representam a primeira vitrine do usuário no fluxo inicial.
          </p>
        </div>

        <div
          v-if="model.items.length"
          class="grid gap-4 xl:grid-cols-2"
        >
          <div
            v-for="item in model.items"
            :key="item.id"
            class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-base font-semibold">{{ item.title }}</p>

                <div class="mt-2 flex flex-wrap gap-2">
                  <UBadge color="neutral" variant="soft">
                    {{ item.category }}
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
                @click="emit('remove-project', item.id)"
              />
            </div>

            <p class="mt-4 text-sm text-muted">
              {{ item.summary }}
            </p>

            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              rel="noreferrer"
              class="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              {{ item.link }}
            </a>

            <div class="mt-4 flex flex-wrap gap-3">
              <UButton
                :color="item.featured ? 'success' : 'neutral'"
                :variant="item.featured ? 'soft' : 'outline'"
                size="sm"
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

    <!--  =========== Status da Etapa Projetos ================ -->
    <!--  ----------- Feedback Final -------------- -->

    <UAlert
      class="dashboard-note-alert"
      :icon="projectCount ? 'i-lucide-circle-check' : 'i-lucide-info'"
      :title="projectCount ? 'Projetos iniciais prontos' : 'Você ainda pode seguir sem projetos'"
      :description="projectCount ? 'A vitrine inicial já tem itens cadastrados e isso ajuda o portfólio a não começar vazio.' : 'Esta etapa é opcional. O usuário pode entrar no painel e completar a vitrine depois.'"
      :color="projectCount ? 'success' : 'neutral'"
      variant="outline"
    />
  </div>
</template>