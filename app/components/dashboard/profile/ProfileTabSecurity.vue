<script setup lang="ts">
import type { SecurityData } from '~/composables/usePerfilState'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'

const props = defineProps<{ model: SecurityData }>()
const emit = defineEmits<{ dirty: [] }>()

const toast = useToast()

function markDirty() {
  emit('dirty')
}

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const confirmTouched = ref(false)
const submitAttempted = ref(false)
const isUpdating = ref(false)

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: 'Pelo menos 8 caracteres' },
    { regex: /\d/, text: 'Pelo menos 1 número' },
    { regex: /[a-z]/, text: 'Pelo menos 1 letra minúscula' },
    { regex: /[A-Z]/, text: 'Pelo menos 1 letra maiúscula' }
  ]
  return requirements.map((req) => ({ met: req.regex.test(str), text: req.text }))
}

const strength = computed(() => checkStrength(props.model.newPassword || ''))
const score = computed(() => strength.value.filter((req) => req.met).length)
const showStrength = computed(() => (props.model.newPassword || '').length > 0)

const strengthColor = computed(() => {
  if (score.value === 0) return 'neutral'
  if (score.value <= 1) return 'error'
  if (score.value <= 3) return 'warning'
  return 'success'
})

const strengthText = computed(() => {
  if (score.value === 0) return 'Digite uma senha'
  if (score.value <= 2) return 'Senha fraca'
  if (score.value === 3) return 'Senha média'
  return 'Senha forte'
})

const isExactMatch = computed(() => {
  const a = props.model.newPassword || ''
  const b = props.model.confirmPassword || ''
  if (!a || !b) return false
  return a === b
})

const showMismatch = computed(() => {
  const a = props.model.newPassword || ''
  const b = props.model.confirmPassword || ''
  if (!a || !b) return false

  const shouldValidate = submitAttempted.value || confirmTouched.value
  if (!shouldValidate) return false

  return a !== b
})

const canSubmit = computed(() => {
  const hasCurrent = !!props.model.currentPassword
  const hasNew = !!props.model.newPassword
  const hasConfirm = !!props.model.confirmPassword
  const strongEnough = score.value >= 4
  return hasCurrent && hasNew && hasConfirm && strongEnough && isExactMatch.value
})

async function updatePassword() {
  submitAttempted.value = true
  confirmTouched.value = true

  if (!canSubmit.value) {
    toast.add({
      title: 'Revise os campos',
      description: 'Verifique os requisitos da senha e se a confirmação confere.',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
    return
  }

  isUpdating.value = true
  await new Promise((r) => setTimeout(r, 700))
  isUpdating.value = false

  toast.add({
    title: 'Senha atualizada',
    description: 'Sua senha foi atualizada com sucesso.',
    color: 'success',
    icon: 'i-lucide-circle-check'
  })

  props.model.currentPassword = ''
  props.model.newPassword = ''
  props.model.confirmPassword = ''
  confirmTouched.value = false
  submitAttempted.value = false
  markDirty()
}

const { inputUi, floatingLabelBaseClass, floatingLabelSurfaceClass } = useDashboardFormUi()

const labelClass = floatingLabelBaseClass
</script>

<template>
  <div class="space-y-10">
    <section class="space-y-4">
      <div class="space-y-1">
        <h2 class="text-base font-semibold">Trocar senha</h2>
        <p class="text-sm text-muted">Altere sua senha com segurança.</p>
      </div>

      <div class="max-w-xl space-y-6">
        <div class="relative">
          <UInput
            v-model="props.model.currentPassword"
            :type="showCurrent ? 'text' : 'password'"
            placeholder=""
            autocomplete="current-password"
            :ui="inputUi"
            class="w-full"
            @update:model-value="markDirty"
          >
            <label :class="labelClass">
              <span :class="floatingLabelSurfaceClass">Senha atual</span>
            </label>

            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showCurrent ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showCurrent ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showCurrent = !showCurrent"
              />
            </template>
          </UInput>
        </div>

        <div class="relative">
          <UInput
            v-model="props.model.newPassword"
            :type="showNew ? 'text' : 'password'"
            placeholder=""
            autocomplete="new-password"
            :color="strengthColor"
            :ui="inputUi"
            class="w-full"
            @update:model-value="markDirty"
          >
            <label :class="labelClass">
              <span :class="floatingLabelSurfaceClass">Nova senha</span>
            </label>

            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showNew ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showNew ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showNew = !showNew"
              />
            </template>
          </UInput>

          <div v-if="showStrength" class="mt-4 space-y-3">
            <UProgress :color="strengthColor" :indicator="strengthText" :model-value="score" :max="4" size="sm" />

            <p class="text-sm font-medium">
              {{ strengthText }}. Requisitos:
            </p>

            <ul class="grid gap-1 sm:grid-cols-2">
              <li
                v-for="(req, index) in strength"
                :key="index"
                class="flex items-center gap-2"
                :class="req.met ? 'text-success' : 'text-muted'"
              >
                <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
                <span class="text-xs font-light">{{ req.text }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="relative">
          <UInput
            v-model="props.model.confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            placeholder=""
            autocomplete="new-password"
            :ui="inputUi"
            class="w-full"
            @update:model-value="markDirty"
            @blur="confirmTouched = true"
          >
            <label :class="labelClass">
              <span :class="floatingLabelSurfaceClass">Confirmar nova senha</span>
            </label>

            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showConfirm ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showConfirm = !showConfirm"
              />
            </template>
          </UInput>

          <p v-if="showMismatch" class="mt-2 text-sm text-red-500">
            As senhas não conferem.
          </p>
        </div>

        <div class="pt-1">
          <UButton
            color="primary"
            size="md"
            icon="i-lucide-lock"
            :loading="isUpdating"
            :disabled="!canSubmit"
            @click="updatePassword"
          >
            Atualizar senha
          </UButton>

          <p class="mt-2 text-xs text-muted">
            Dica: use uma senha forte e exclusiva.
          </p>
        </div>
      </div>
    </section>

    <USeparator />

    <section class="space-y-4">
      <div class="max-w-xl">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <p class="font-semibold leading-tight">Autenticação em duas etapas</p>
            <p class="text-sm text-muted leading-tight">
              Adicione uma camada extra de segurança na sua conta.
            </p>
          </div>

          <USwitch v-model="props.model.twoFactorEnabled" color="success" size="lg" @update:model-value="markDirty" />
        </div>

        <div v-if="props.model.twoFactorEnabled" class="mt-4 grid gap-4 md:grid-cols-2">
          <UFormField label="Método">
            <USelect
              v-model="props.model.twoFactorMethod"
              :options="[
                { label: 'Aplicativo autenticador', value: 'app' },
                { label: 'SMS', value: 'sms' },
                { label: 'E-mail', value: 'email' }
              ]"
              class="w-full"
              @update:model-value="markDirty"
            />
          </UFormField>

          <UAlert
            icon="i-lucide-shield-check"
            title="Em breve"
            description="Configuração do 2FA (QR Code / códigos de backup) será implementada em etapa futura."
            color="neutral"
            variant="soft"
          />
        </div>
      </div>
    </section>
  </div>
</template>