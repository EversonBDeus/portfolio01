<script setup lang="ts">
import { computed, reactive, ref, onUnmounted } from 'vue'
import { authVerifySchema } from '~/schemas/auth-verify'
import { useAuthState } from '~/composables/useAuthState'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Verificar e-mail'
})

const toast = useToast()
const route = useRoute()
const loading = ref(false)
const completed = ref(false)
const resendCooldown = ref(0)
const submitted = ref(false)
const codeTouched = ref(false)

let cooldownInterval: ReturnType<typeof setInterval> | null = null

const {
  hasPendingVerification,
  pendingVerification,
  resendVerificationCode,
  verifyEmail
} = useAuthState()

const state = reactive({
  code: [] as number[]
})

const codeValue = computed(() => state.code.map((value) => String(value)).join(''))

const validation = computed(() => authVerifySchema.safeParse({
  code: codeValue.value
}))

const codeError = computed(() => {
  if (validation.value.success || (!submitted.value && !codeTouched.value)) {
    return ''
  }

  return validation.value.error.flatten().fieldErrors.code?.[0] ?? ''
})

const targetEmail = computed(() => {
  return pendingVerification.value?.email ?? String(route.query.email ?? '')
})

async function handleSubmit() {
  submitted.value = true

  const result = authVerifySchema.safeParse({
    code: codeValue.value
  })

  if (!result.success || loading.value || completed.value || !hasPendingVerification.value) {
    toast.add({
      title: 'Revise o código',
      description: !hasPendingVerification.value
        ? 'Nenhum cadastro pendente foi encontrado.'
        : 'Digite os 6 dígitos corretamente antes de continuar.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
    return
  }

  loading.value = true

  try {
    const target = await verifyEmail(result.data.code)

    completed.value = true

    toast.add({
      title: 'E-mail verificado',
      description: 'Agora você será enviado para o onboarding.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    await navigateTo(target)
  } catch (error) {
    toast.add({
      title: 'Código inválido',
      description: error instanceof Error ? error.message : 'Tente novamente.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  } finally {
    loading.value = false
  }
}

async function handleResendCode() {
  if (resendCooldown.value > 0 || loading.value || completed.value) {
    return
  }

  try {
    await resendVerificationCode()

    resendCooldown.value = 60

    toast.add({
      title: 'Código reenviado',
      description: 'Confira seu e-mail e tente novamente.',
      color: 'info',
      icon: 'i-lucide-mail'
    })

    cooldownInterval = setInterval(() => {
      resendCooldown.value--

      if (resendCooldown.value <= 0 && cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }, 1000)
  } catch (error) {
    toast.add({
      title: 'Não foi possível reenviar',
      description: error instanceof Error ? error.message : 'Tente novamente.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  }
}

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-[470px] rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(248,250,252,0.92)_100%)] p-5 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-md dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.82)_0%,rgba(15,23,42,0.74)_100%)] dark:text-white dark:shadow-[0_24px_70px_rgba(0,0,0,0.30)] sm:p-6">
    <div class="space-y-5">
      <div class="space-y-2">
        <UBadge color="primary" variant="subtle">
          Verify
        </UBadge>

        <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Valide o código enviado por e-mail
        </h2>

        <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {{ targetEmail ? `Enviamos o código para ${targetEmail}.` : 'Use esta etapa para confirmar seu cadastro.' }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3.5 dark:border-white/10 dark:bg-[rgba(15,23,42,0.40)]">
        <div class="flex items-start gap-3">
          <span class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300">
            <UIcon name="i-lucide-mail-check" class="size-4" />
          </span>

          <div class="space-y-1">
            <p class="font-medium text-slate-900 dark:text-white">
              Confirmação de e-mail
            </p>
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Digite o código de 6 dígitos recebido para continuar.
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex justify-center">
          <UPinInput
            v-model="state.code"
            :length="6"
            autofocus
            size="xl"
            type="number"
            otp
            :disabled="loading || completed || !hasPendingVerification"
            :ui="{
              root: 'gap-2.5',
              base: 'rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm dark:border-emerald-400/35 dark:bg-[rgba(15,23,42,0.68)] dark:text-white'
            }"
            @update:model-value="codeTouched = true"
          />
        </div>

        <p v-if="codeError" class="text-center text-sm text-rose-500 dark:text-rose-400">
          {{ codeError }}
        </p>

        <UButton
          block
          size="xl"
          color="primary"
          :loading="loading"
          :disabled="!validation.success || completed || !hasPendingVerification"
          :icon="completed ? 'i-lucide-circle-check' : 'i-lucide-lock'"
          class="justify-center rounded-2xl"
          @click="handleSubmit"
        >
          {{ completed ? 'Verificado' : 'Confirmar código' }}
        </UButton>
      </div>

      <div class="space-y-3 border-t border-slate-200 pt-4 dark:border-white/10">
        <div class="flex items-center justify-center gap-1.5 text-sm">
          <span class="text-slate-500 dark:text-slate-400">Não recebeu?</span>

          <UButton
            variant="link"
            color="primary"
            size="sm"
            :disabled="resendCooldown > 0 || loading || completed || !hasPendingVerification"
            :padded="false"
            :icon="resendCooldown > 0 ? 'i-lucide-clock' : 'i-lucide-refresh-cw'"
            class="text-emerald-600 dark:text-emerald-300"
            @click="handleResendCode"
          >
            {{ resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código' }}
          </UButton>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 text-xs">
          <UButton
            to="/auth/register"
            color="neutral"
            variant="ghost"
            size="xs"
            class="text-slate-600 dark:text-slate-300"
          >
            Voltar para cadastro
          </UButton>

          <UButton
            to="/auth/login"
            color="neutral"
            variant="ghost"
            size="xs"
            class="text-slate-600 dark:text-slate-300"
          >
            Ir para login
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>