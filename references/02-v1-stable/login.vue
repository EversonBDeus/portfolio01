<script setup lang="ts">
import { ref } from 'vue'

import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: false
})

const toast = useToast()
const isVerifying = ref(false)
const emailRegisto = ref('')
const pinCode = ref('')

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'E-mail',
    placeholder: 'O teu melhor e-mail',
    required: true
  },
  {
    name: 'password',
    label: 'Palavra-passe',
    type: 'password',
    placeholder: 'A tua palavra-passe',
    required: true
  }
]

const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    color: 'neutral' as const,
    onClick: () => toast.add({ title: 'Em breve', description: 'Login com Google disponível em breve!' })
  },
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    color: 'neutral' as const,
    onClick: () => toast.add({ title: 'Em breve', description: 'Login com GitHub disponível em breve!' })
  }
]


function onSubmitAuth(payload: FormSubmitEvent<Schema>) {
  emailRegisto.value = payload.data.email
  isVerifying.value = true
  toast.add({
    title: 'Código enviado!',
    description: 'Verifica a tua caixa de entrada.',
    color: 'success'
  })
}

function onPinComplete() {
  if (pinCode.value === '123456') {
    toast.add({ title: 'Bem-vindo!', description: 'A redirecionar para o Dashboard...', color: 'success' })
  } else {
    toast.add({ title: 'Código incorreto', description: 'Tenta novamente. (Dica: 123456)', color: 'error' })
    pinCode.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row">

    <!-- ===== LADO ESQUERDO - Branding (só desktop) ===== -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex-col items-center justify-center p-12 text-white">
      
      <!-- Círculos decorativos de fundo -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

      <!-- Conteúdo branding -->
      <div class="relative z-10 max-w-sm text-center">
        <div class="flex items-center justify-center gap-3 mb-10">
          <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="text-2xl text-white" />
          </div>
          <span class="text-2xl font-bold tracking-tight">PortfolioSaaS</span>
        </div>

        <h2 class="text-4xl font-extrabold leading-tight mb-4">
          O teu portfólio<br>profissional,<br>sem esforço.
        </h2>
        <p class="text-white/70 text-base leading-relaxed mb-10">
          Cria, personaliza e partilha o teu portfólio com o mundo em menos de 5 minutos.
        </p>

        <!-- Testemunho / social proof -->
        <div class="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-left">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center font-bold text-sm text-white">JS</div>
            <div>
              <p class="font-semibold text-sm">João Silva</p>
              <p class="text-white/60 text-xs">Designer UX · Lisboa</p>
            </div>
          </div>
          <p class="text-white/80 text-sm leading-relaxed">
            "Consegui emprego novo em 2 semanas após criar o meu portfólio aqui. Recomendo a todos!"
          </p>
          <div class="flex gap-0.5 mt-3">
            <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="text-yellow-400 text-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- ===== LADO DIREITO - Formulário ===== -->
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-950 p-5 sm:p-8 lg:p-12">

      <!-- Logo mobile (só aparece no mobile) -->
      <div class="flex lg:hidden items-center gap-2 mb-8">
        <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
          <UIcon name="i-heroicons-sparkles" class="text-white text-lg" />
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white">PortfolioSaaS</span>
      </div>

      <div class="w-full max-w-sm">

        <!-- ===== TELA 1: Formulário de Login ===== -->
        <Transition name="fade" mode="out-in">
          <div v-if="!isVerifying" key="form">

            <div class="mb-8">
              <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                Bem-vindo de volta 👋
              </h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Ainda não tens conta?
                <ULink to="/registro" class="text-primary-500 font-semibold hover:underline">Regista-te grátis</ULink>
              </p>
            </div>

            <UAuthForm
              :schema="schema"
              :fields="fields"
              :providers="providers"
              title=""
              align="top"
              :ui="{ 
                base: 'gap-5',
                footer: 'mt-0'
              }"
              @submit="onSubmitAuth"
            >
              <template #description>
                <span />
              </template>

              <template #password-hint>
                <ULink to="#" class="text-primary-500 hover:text-primary-600 text-xs font-medium">
                  Esqueceste a password?
                </ULink>
              </template>

              <template #footer>
                <p class="text-xs text-center text-gray-400 mt-2">
                  Ao continuares, aceitas os nossos
                  <ULink to="#" class="text-primary-500 hover:underline">Termos de Serviço</ULink>
                  e
                  <ULink to="#" class="text-primary-500 hover:underline">Privacidade</ULink>.
                </p>
              </template>
            </UAuthForm>

          </div>

          <!-- ===== TELA 2: Verificação PIN ===== -->
          <div v-else key="pin" class="text-center">

            <!-- Ícone animado -->
            <div class="flex justify-center mb-6">
              <div class="relative">
                <div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-envelope-open" class="text-primary-500 text-4xl" />
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-check" class="text-white text-xs" />
                </div>
              </div>
            </div>

            <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Verifica o teu e-mail
            </h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Enviámos um código de 6 dígitos para
            </p>
            <p class="font-semibold text-gray-900 dark:text-white text-sm mb-8">
              {{ emailRegisto }}
            </p>

            <!-- PIN Input centralizado -->
            <div class="flex justify-center mb-8">
              <UPinInput
                v-model="pinCode"
                :length="6"
                size="xl"
                placeholder="·"
                @complete="onPinComplete"
              />
            </div>

            <!-- Ações secundárias -->
            <div class="space-y-3">
              <p class="text-sm text-gray-400">Não recebeste o código?</p>
              <div class="flex gap-3 justify-center flex-wrap">
                <UButton
                  variant="soft"
                  icon="i-heroicons-arrow-path"
                  label="Reenviar código"
                  size="sm"
                />
                <UButton
                  variant="ghost"
                  color="neutral"
                  icon="i-heroicons-arrow-left"
                  label="Mudar e-mail"
                  size="sm"
                  @click="isVerifying = false"
                />
              </div>
            </div>

          </div>
        </Transition>

      </div>

      <!-- Rodapé discreto -->
      <p class="mt-10 text-xs text-gray-400 text-center">
        © {{ new Date().getFullYear() }} PortfolioSaaS · Todos os direitos reservados
      </p>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
