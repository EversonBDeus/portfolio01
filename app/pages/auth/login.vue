<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import type { AuthLoginInput } from '~/schemas/auth-login'
import { authLoginSchema } from '~/schemas/auth-login'
import { useAuthState } from '~/composables/useAuthState'
import AuthFloatingInput from '~/components/auth/AuthFloatingInput.vue'
import AuthFloatingPasswordInput from '~/components/auth/AuthFloatingPasswordInput.vue'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Entrar'
})

const toast = useToast()
const loading = ref(false)
const submitted = ref(false)

const { login } = useAuthState()

const touched = reactive({
  identifier: false,
  password: false
})

const form = reactive<AuthLoginInput>({
  identifier: '',
  password: ''
})

const validation = computed(() => authLoginSchema.safeParse(form))

const fieldErrors = computed(() => {
  if (validation.value.success) {
    return {
      identifier: '',
      password: ''
    }
  }

  const errors = validation.value.error.flatten().fieldErrors

  return {
    identifier: errors.identifier?.[0] ?? '',
    password: errors.password?.[0] ?? ''
  }
})

async function handleSubmit() {
  submitted.value = true

  const result = authLoginSchema.safeParse(form)

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
    const target = await login(result.data)

    toast.add({
      title: 'Login realizado',
      description: 'Redirecionando',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    await navigateTo(target)
  } catch (error) {
    toast.add({
      title: 'Não foi possível entrar',
      description: error instanceof Error ? error.message : 'Tente novamente.',
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
      <div class="space-y-2">
        <UBadge color="primary" variant="subtle">
          Login
        </UBadge>

        <h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Entre na sua conta
        </h2>

          <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Entre na sua conta para continuar de onde parou.
          </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <AuthFloatingInput
            v-model="form.identifier"
            label="E-mail"
            icon="i-lucide-mail"
            type="email"
            autocomplete="email"
            :spellcheck="false"
            @blur="touched.identifier = true"
          />
          <p
            v-if="fieldErrors.identifier && (submitted || touched.identifier)"
            class="text-sm text-rose-500 dark:text-rose-400"
          >
            {{ fieldErrors.identifier }}
          </p>
        </div>

        <div class="space-y-2">
          <AuthFloatingPasswordInput
            v-model="form.password"
            label="Senha"
            icon="i-lucide-lock"
            autocomplete="current-password"
            @blur="touched.password = true"
          />
          <p
            v-if="fieldErrors.password && (submitted || touched.password)"
            class="text-sm text-rose-500 dark:text-rose-400"
          >
            {{ fieldErrors.password }}
          </p>
        </div>

        <div class="flex items-center justify-between gap-3 text-sm">
          <p class="text-slate-500 dark:text-slate-400">
            Ainda não tem conta?
          </p>

          <UButton
            to="/auth/register"
            color="primary"
            variant="link"
            size="sm"
            class="text-emerald-600 dark:text-emerald-300"
          >
            Criar conta
          </UButton>
        </div>

        <UButton
          type="submit"
          block
          size="xl"
          color="primary"
          :loading="loading"
          icon="i-lucide-log-in"
          class="justify-center rounded-2xl"
        >
          Entrar
        </UButton>
      </form>
    </div>
  </div>
</template>