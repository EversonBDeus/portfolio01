<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { AuthRegisterInput } from '~/schemas/auth-register'
import { authRegisterSchema } from '~/schemas/auth-register'
import { useAuthState } from '~/composables/useAuthState'
import AuthFloatingInput from '~/components/auth/AuthFloatingInput.vue'
import AuthFloatingPasswordInput from '~/components/auth/AuthFloatingPasswordInput.vue'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Criar conta'
})

const toast = useToast()
const loading = ref(false)
const submitted = ref(false)
const passwordFocused = ref(false)

const { register } = useAuthState()

const touched = reactive({
  email: false,
  username: false,
  password: false,
  confirmPassword: false,
  acceptTerms: false
})

const checkboxUi = {
  root: 'relative flex items-start',
  container: 'flex items-center',
  base: [
    'rounded-[0.4rem] ring-1 ring-inset overflow-hidden transition-[background,border-color,box-shadow] duration-200',
    'bg-slate-50 ring-slate-300 dark:bg-[rgba(15,23,42,0.68)] dark:ring-emerald-400/30',
    'data-[state=unchecked]:bg-slate-50 data-[state=unchecked]:ring-slate-300',
    'dark:data-[state=unchecked]:bg-[rgba(15,23,42,0.68)] dark:data-[state=unchecked]:ring-emerald-400/30',
    'data-[state=checked]:bg-emerald-500 data-[state=checked]:ring-emerald-400/45',
    'shadow-sm',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400'
  ].join(' '),
  indicator: 'flex items-center justify-center size-full text-white',
  icon: 'size-full',
  wrapper: 'w-full ms-3',
  label: 'block font-medium text-slate-900 dark:text-white',
  description: 'text-slate-500 dark:text-slate-400'
}

const passwordRules = [
  'Mínimo de 8 caracteres',
  '1 letra maiúscula',
  '1 letra minúscula',
  '1 número',
  '1 caractere especial'
]

const form = reactive<AuthRegisterInput>({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  acceptUpdates: true
})

const validation = computed(() => authRegisterSchema.safeParse(form))
const showPasswordRules = computed(() => passwordFocused.value || form.password.length > 0)

const fieldErrors = computed(() => {
  if (validation.value.success) {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      acceptTerms: ''
    }
  }

  const errors = validation.value.error.flatten().fieldErrors

  return {
    email: errors.email?.[0] ?? '',
    username: errors.username?.[0] ?? '',
    password: errors.password?.[0] ?? '',
    confirmPassword: errors.confirmPassword?.[0] ?? '',
    acceptTerms: errors.acceptTerms?.[0] ?? ''
  }
})

function normalizeRegisterError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Tente novamente.'
  const normalized = message.toLowerCase()

  if (
    normalized.includes('already registered') ||
    normalized.includes('already exists') ||
    normalized.includes('already been registered') ||
    normalized.includes('já existe')
  ) {
    return 'Não foi possível concluir o cadastro. Se você já tiver conta, tente entrar.'
  }

  return message
}

async function handleSubmit() {
  submitted.value = true
  touched.acceptTerms = true

  const result = authRegisterSchema.safeParse(form)

  if (!result.success || loading.value) {
    toast.add({
      title: 'Revise os campos',
      description: 'Corrija os dados obrigatórios antes de continuar.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
    return
  }

  loading.value = true

  try {
    const target = await register(result.data)

    toast.add({
      title: 'Conta criada',
      description: 'Sua conta já está pronta. Vamos continuar.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    await navigateTo(target)
  } catch (error) {
    toast.add({
      title: 'Não foi possível criar a conta',
      description: normalizeRegisterError(error),
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[470px] rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(248,250,252,0.92)_100%)] p-5 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-md dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.82)_0%,rgba(15,23,42,0.74)_100%)] dark:text-white dark:shadow-[0_24px_70px_rgba(0,0,0,0.30)] sm:p-6">
    <div class="space-y-5">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <UBadge color="primary" variant="subtle">
            Cadastro
          </UBadge>

          <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span class="inline-flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-400/20 dark:text-emerald-300">
              1
            </span>
            <span class="text-emerald-600 dark:text-emerald-300">Conta</span>
            <span class="h-px w-8 bg-emerald-400/30" />
            <span class="inline-flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-500 dark:ring-white/10">
              2
            </span>
            <span>Onboarding</span>
          </div>
        </div>

        <div class="space-y-2">
          <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Crie sua conta inicial
          </h2>
          <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Crie sua conta para começar a montar e publicar seu portfólio.
          </p>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2 md:col-span-2">
            <AuthFloatingInput
              v-model="form.email"
              label="E-mail"
              icon="i-lucide-mail"
              type="email"
              autocomplete="email"
              :spellcheck="false"
              @blur="touched.email = true"
            />
            <p
              v-if="fieldErrors.email && (submitted || touched.email)"
              class="text-sm text-rose-500 dark:text-rose-400"
            >
              {{ fieldErrors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <AuthFloatingInput
              v-model="form.username"
              label="Usuário"
              icon="i-lucide-at-sign"
              autocomplete="username"
              :spellcheck="false"
              @blur="touched.username = true"
            />
            <p
              v-if="fieldErrors.username && (submitted || touched.username)"
              class="text-sm text-rose-500 dark:text-rose-400"
            >
              {{ fieldErrors.username }}
            </p>
          </div>

          <div
            class="space-y-2"
            @focusin="passwordFocused = true"
            @focusout="passwordFocused = false"
          >
            <AuthFloatingPasswordInput
              v-model="form.password"
              label="Senha"
              icon="i-lucide-lock"
              autocomplete="new-password"
              @blur="touched.password = true"
            />
            <p
              v-if="fieldErrors.password && (submitted || touched.password)"
              class="text-sm text-rose-500 dark:text-rose-400"
            >
              {{ fieldErrors.password }}
            </p>
          </div>

          <div class="space-y-2 md:col-span-2">
            <AuthFloatingPasswordInput
              v-model="form.confirmPassword"
              label="Confirmar senha"
              icon="i-lucide-badge-check"
              autocomplete="new-password"
              @blur="touched.confirmPassword = true"
            />
            <p
              v-if="fieldErrors.confirmPassword && (submitted || touched.confirmPassword)"
              class="text-sm text-rose-500 dark:text-rose-400"
            >
              {{ fieldErrors.confirmPassword }}
            </p>
          </div>
        </div>

        <div
          v-if="showPasswordRules"
          class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-[rgba(15,23,42,0.40)]"
        >
          <p class="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Critérios da senha
          </p>

          <ul class="mt-2 grid gap-1.5 sm:grid-cols-2">
            <li
              v-for="rule in passwordRules"
              :key="rule"
              class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
            >
              <UIcon name="i-lucide-check" class="mt-0.5 size-3.5 shrink-0 text-emerald-500 dark:text-emerald-300" />
              <span>{{ rule }}</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2.5">
          <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-[rgba(15,23,42,0.40)]">
            <UCheckbox
              v-model="form.acceptTerms"
              label="Aceito os termos e a política da plataforma"
              color="primary"
              :ui="checkboxUi"
              @change="touched.acceptTerms = true"
            />
            <p class="mt-1.5 pl-8 text-xs text-slate-500 dark:text-slate-400">
              Obrigatório para continuar.
            </p>
            <p
              v-if="fieldErrors.acceptTerms && (submitted || touched.acceptTerms)"
              class="mt-1.5 pl-8 text-xs text-rose-500 dark:text-rose-400"
            >
              {{ fieldErrors.acceptTerms }}
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-[rgba(15,23,42,0.40)]">
            <UCheckbox
              v-model="form.acceptUpdates"
              label="Quero receber novidades e atualizações"
              color="primary"
              :ui="checkboxUi"
            />
          </div>
        </div>

        <div class="flex items-center justify-between gap-3 text-sm">
          <p class="text-slate-500 dark:text-slate-400">
            Já possui conta?
          </p>

          <UButton
            to="/auth/login"
            color="primary"
            variant="link"
            size="sm"
            class="text-emerald-600 dark:text-emerald-300"
          >
            Entrar
          </UButton>
        </div>

        <UButton
          type="submit"
          block
          size="xl"
          color="primary"
          :loading="loading"
          icon="i-lucide-user-plus"
          class="justify-center rounded-2xl"
        >
          Criar conta
        </UButton>

        <p class="text-center text-[11px] leading-5 text-slate-400 dark:text-slate-500">
          Ao criar sua conta, você concorda com os termos e a política da plataforma.
        </p>
      </form>
    </div>
  </div>
</template>