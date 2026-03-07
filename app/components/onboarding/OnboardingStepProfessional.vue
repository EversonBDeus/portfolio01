<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'
import type { OnboardingProfessionalData, OnboardingProfessionalErrors } from '~/composables/useOnboardingState'

const props = defineProps<{
  model: OnboardingProfessionalData
  errors: OnboardingProfessionalErrors
  isValid: boolean
}>()

const {
  inputUi,
  textareaUi,
  floatingLabelSurfaceClass
} = useDashboardFormUi()

const customArea = ref('')
const customSkill = ref('')
const customExperience = ref('')

const titleInputUi = {
  ...inputUi,
  base: `${inputUi.base} ps-10`
}

const fixedTextareaUi = {
  ...textareaUi,
  base: `${textareaUi.base} resize-none overflow-y-auto min-h-[16rem] max-h-[16rem]`
}

const labelSurfaceClass = `${floatingLabelSurfaceClass} leading-none`

const topSectionMinHeight = 'min-h-[26rem]'
const summaryTextareaUi = {
  ...fixedTextareaUi,
  base: `${fixedTextareaUi.base} h-full`
}

const areaOptions = [
  'Arquitetura e Urbanismo',
  'Engenharia',
  'Design',
  'Tecnologia',
  'Marketing e Comunicação',
  'Administrativo',
  'Comercial e Vendas',
  'Financeiro',
  'Educação',
  'Saúde',
  'Jurídico',
  'RH',
  'Atendimento',
  'Logística',
  'Construção e Obras',
  'Consultoria'
]

const experienceOptions = [
  'Em formação',
  'Iniciante',
  'Júnior',
  'Pleno',
  'Sênior',
  'Especialista',
  'Liderança / Gestão'
]

const skillSuggestions = [
  'Atendimento ao cliente',
  'Comunicação',
  'Criatividade',
  'Gestão de projetos',
  'Liderança',
  'Planejamento',
  'Organização',
  'Resolução de problemas',
  'Trabalho em equipe',
  'Negociação',
  'Análise',
  'Apresentação',
  'Detalhismo',
  'Pesquisa',
  'Execução técnica',
  'Relacionamento com cliente'
]

const selectedSkillsLabel = computed(() => {
  return props.model.mainSkills.length
    ? `${props.model.mainSkills.length} competência(s) selecionada(s)`
    : 'Nenhuma competência selecionada'
})

const normalizedSuggestions = computed(() => {
  const selected = new Set(props.model.mainSkills.map(skill => skill.toLowerCase()))
  return skillSuggestions.filter(skill => !selected.has(skill.toLowerCase()))
})

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

function toggleArea(option: string) {
  props.model.workArea = props.model.workArea === option ? '' : option
}

function applyCustomArea() {
  const value = customArea.value.trim()

  if (!value) return

  props.model.workArea = value
  customArea.value = ''
}

function toggleExperienceLevel(option: string) {
  props.model.experienceLevel = props.model.experienceLevel === option ? '' : option
}

function applyCustomExperience() {
  const value = customExperience.value.trim()

  if (!value) return

  props.model.experienceLevel = value
  customExperience.value = ''
}

function toggleSkill(option: string) {
  const exists = props.model.mainSkills.some(skill => skill.toLowerCase() === option.toLowerCase())

  if (exists) {
    props.model.mainSkills = props.model.mainSkills.filter(skill => skill.toLowerCase() !== option.toLowerCase())
    return
  }

  props.model.mainSkills = [...props.model.mainSkills, option]
}

function addCustomSkill() {
  const value = customSkill.value.trim()

  if (!value) return

  const exists = props.model.mainSkills.some(skill => skill.toLowerCase() === value.toLowerCase())

  if (!exists) {
    props.model.mainSkills = [...props.model.mainSkills, value]
  }

  customSkill.value = ''
}

function removeSkill(skillToRemove: string) {
  props.model.mainSkills = props.model.mainSkills.filter(skill => skill !== skillToRemove)
}
</script>

<template>
  <div class="space-y-6">
    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-briefcase-business"
      title="Dados desta etapa"
      description="Aqui entram os dados profissionais base que depois alimentam o template, o editor e outras áreas do painel."
      color="neutral"
      variant="outline"
    />
``
    <div class="space-y-2">
      <div class="relative">
        <UInput
          v-model="model.roleTitle"
          :placeholder="' '"
          autocomplete="organization-title"
          size="lg"
          class="w-full"
          :ui="titleInputUi"
        >
          <template #leading>
            <UIcon name="i-lucide-badge-check" class="size-5 text-[var(--dashboard-field-icon)]" />
          </template>

          <template #default>
            <label :class="getFloatingLabelClass(model.roleTitle, 'start-10')">
              <span :class="labelSurfaceClass">
                Título / cargo
              </span>
            </label>
          </template>
        </UInput>
      </div>

      <p v-if="errors.roleTitle" class="text-sm text-red-500">
        {{ errors.roleTitle }}
      </p>
    </div>
<div class="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
  <div class="space-y-2">
    <div :class="['relative', topSectionMinHeight]">
      <div class="absolute right-0 top-0 z-[2]">
        <UButton
          color="neutral"
          variant="outline"
          size="xs"
          icon="i-lucide-sparkles"
          disabled
        >
          IA em breve
        </UButton>
      </div>

      <div class="h-full pt-8">
        <div class="relative h-full">
          <UTextarea
            v-model="model.professionalSummary"
            :rows="10"
            :placeholder="' '"
            class="h-full w-full"
            :ui="summaryTextareaUi"
          />
          <label :class="getFloatingLabelClass(model.professionalSummary, 'start-3')">
            <span :class="labelSurfaceClass">
              Resumo profissional
            </span>
          </label>
        </div>
      </div>
    </div>

    <p v-if="errors.professionalSummary" class="text-sm text-red-500">
      {{ errors.professionalSummary }}
    </p>
  </div>

  <div
    :class="[
      'dashboard-form-surface-2 flex flex-col rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4',
      topSectionMinHeight
    ]"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium">Nível de experiência</p>
        <p class="mt-1 text-sm text-muted">
          Escolha uma sugestão ou informe um nível personalizado.
        </p>
      </div>

      <UBadge
        :color="model.experienceLevel ? 'primary' : 'neutral'"
        variant="soft"
      >
        {{ model.experienceLevel || 'Não definido' }}
      </UBadge>
    </div>

    <div class="mt-5 flex flex-1 flex-col justify-between gap-5">
      <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
        <UButton
          v-for="option in experienceOptions"
          :key="option"
          :color="model.experienceLevel === option ? 'primary' : 'neutral'"
          :variant="model.experienceLevel === option ? 'soft' : 'outline'"
          class="w-full justify-start"
          @click="toggleExperienceLevel(option)"
        >
          {{ option }}
        </UButton>
      </div>

      <div class="border-t border-(--dashboard-border-soft) pt-5">
        <div class="space-y-3">
          <div class="relative">
            <UInput
              v-model="customExperience"
              :placeholder="' '"
              size="lg"
              class="w-full"
              :ui="inputUi"
              @keydown.enter.prevent="applyCustomExperience"
            >
              <template #default>
                <label :class="getFloatingLabelClass(customExperience, 'start-3')">
                  <span :class="labelSurfaceClass">
                    Informar outro nível
                  </span>
                </label>
              </template>
            </UInput>
          </div>

          <UButton
            color="primary"
            variant="soft"
            @click="applyCustomExperience"
          >
            Usar nível informado
          </UButton>
        </div>
      </div>
    </div>

    <p v-if="errors.experienceLevel" class="mt-4 text-sm text-red-500">
      {{ errors.experienceLevel }}
    </p>
  </div>
</div>

    <div class="grid items-start gap-4 xl:grid-cols-2">
      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium">Área de atuação</p>
            <p class="mt-1 text-sm text-muted">
              Selecione uma sugestão ou informe sua área específica.
            </p>
          </div>

          <UBadge
            :color="model.workArea ? 'primary' : 'neutral'"
            variant="soft"
          >
            {{ model.workArea || 'Não definida' }}
          </UBadge>
        </div>

        <div class="mt-5 space-y-5">
          <div class="grid gap-2 sm:grid-cols-2">
            <UButton
              v-for="option in areaOptions"
              :key="option"
              :color="model.workArea === option ? 'primary' : 'neutral'"
              :variant="model.workArea === option ? 'soft' : 'outline'"
              class="w-full justify-start"
              @click="toggleArea(option)"
            >
              {{ option }}
            </UButton>
          </div>

          <div class="border-t border-(--dashboard-border-soft) pt-5 pb-1">
            <div class="space-y-3">
              <div class="relative">
                <UInput
                  v-model="customArea"
                  :placeholder="' '"
                  size="lg"
                  class="w-full"
                  :ui="inputUi"
                  @keydown.enter.prevent="applyCustomArea"
                >
                  <template #default>
                    <label :class="getFloatingLabelClass(customArea, 'start-3')">
                      <span :class="labelSurfaceClass">
                        Informar outra área
                      </span>
                    </label>
                  </template>
                </UInput>
              </div>

              <UButton
                color="primary"
                variant="soft"
                @click="applyCustomArea"
              >
                Usar área informada
              </UButton>
            </div>
          </div>
        </div>

        <p v-if="errors.workArea" class="mt-4 text-sm text-red-500">
          {{ errors.workArea }}
        </p>
      </div>

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium">Competências principais</p>
            <p class="mt-1 text-sm text-muted">
              Selecione sugestões ou adicione competências específicas da sua profissão.
            </p>
          </div>

          <UBadge
            :color="model.mainSkills.length ? 'primary' : 'neutral'"
            variant="soft"
          >
            {{ selectedSkillsLabel }}
          </UBadge>
        </div>

        <div class="mt-5 space-y-5">
          <div>
            <p class="mb-3 text-xs uppercase tracking-wide text-muted">Sugestões gerais</p>

            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="option in normalizedSuggestions"
                :key="option"
                color="neutral"
                variant="outline"
                size="sm"
                @click="toggleSkill(option)"
              >
                {{ option }}
              </UButton>
            </div>
          </div>

          <div class="border-t border-(--dashboard-border-soft) pt-5 pb-1">
            <div class="space-y-3">
              <div class="relative">
                <UInput
                  v-model="customSkill"
                  :placeholder="' '"
                  size="lg"
                  class="w-full"
                  :ui="inputUi"
                  @keydown.enter.prevent="addCustomSkill"
                >
                  <template #default>
                    <label :class="getFloatingLabelClass(customSkill, 'start-3')">
                      <span :class="labelSurfaceClass">
                        Adicionar competência personalizada
                      </span>
                    </label>
                  </template>
                </UInput>
              </div>

              <UButton
                color="primary"
                variant="soft"
                @click="addCustomSkill"
              >
                Adicionar competência
              </UButton>
            </div>
          </div>

          <div class="border-t border-(--dashboard-border-soft) pt-5">
            <p class="mb-3 text-xs uppercase tracking-wide text-muted">Selecionadas</p>

            <div v-if="model.mainSkills.length" class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in model.mainSkills"
                :key="skill"
                color="primary"
                variant="soft"
                class="pr-1"
              >
                <span class="mr-1">{{ skill }}</span>

                <button
                  type="button"
                  class="inline-flex size-5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                  @click="removeSkill(skill)"
                >
                  <UIcon name="i-lucide-x" class="size-3" />
                </button>
              </UBadge>
            </div>

            <p v-else class="text-sm text-muted">
              Nenhuma competência adicionada ainda.
            </p>
          </div>
        </div>

        <p v-if="errors.mainSkills" class="mt-4 text-sm text-red-500">
          {{ errors.mainSkills }}
        </p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <p class="text-sm font-medium">Vai alimentar o template</p>
        <p class="mt-1 text-sm text-muted">
          Cargo, resumo, área, experiência e competências entram como base para a apresentação profissional do portfólio.
        </p>
      </div>

      <div class="dashboard-form-surface-2 rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-2) p-4">
        <p class="text-sm font-medium">Pode evoluir depois</p>
        <p class="mt-1 text-sm text-muted">
          Essa é a base inicial. Depois o usuário poderá refinar experiência, projetos e outras seções no painel.
        </p>
      </div>
    </div>

    <UAlert
      :icon="isValid ? 'i-lucide-circle-check' : 'i-lucide-info'"
      :title="isValid ? 'Etapa profissional pronta para avançar' : 'Preencha os dados profissionais obrigatórios'"
      :description="isValid ? 'A base profissional mínima já está consistente para seguir no onboarding.' : 'Conclua cargo, resumo, área, nível de experiência e pelo menos 2 competências para liberar a próxima etapa.'"
      :color="isValid ? 'success' : 'warning'"
      variant="outline"
      class="dashboard-note-alert"
    />
  </div>
</template>