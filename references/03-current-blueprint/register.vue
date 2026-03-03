<script setup lang="ts">
import { ref } from 'vue'

import type { FormSubmitEvent } from '@nuxt/ui'

// Removemos o cabeçalho e rodapé padrão para focar na conversão
definePageMeta({ layout: false })
useSeoMeta({ title: 'Criar conta — PortfolioSaaS' })

const toast = useToast()
const step = ref<'form' | 'pin' | 'done'>('form')
const emailCadastro = ref('')
const pinCode = ref('')
const isResending = ref(false)
const countdown = ref(0)

// Configuração dos campos nativa do Nuxt UI (Pro)
const fields = [
  { name: 'name', type: 'text', label: 'Nome completo', placeholder: 'João Silva' },
  { name: 'email', type: 'email', label: 'E-mail', placeholder: 'joao@exemplo.com' },
  { name: 'password', label: 'Senha', type: 'password', placeholder: '••••••••' }
]

const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    color: 'white' as const,
    onClick: () => toast.add({ title: 'Em breve', description: 'Login com Google em desenvolvimento!' })
  },
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    onClick: () => toast.add({ title: 'Em breve', description: 'Login com GitHub em desenvolvimento!' })
  }
]


function onSubmit(payload: FormSubmitEvent<Schema>) {
  emailCadastro.value = payload.data.email
  step.value = 'pin'
  startCountdown()
  toast.add({ title: 'Código enviado!', description: `Enviamos um código para ${payload.data.email}`, color: 'success' })
}

function startCountdown() {
  countdown.value = 60
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(interval)
  }, 1000)
}

async function onPinComplete() {
  if (pinCode.value.length === 6) {
    if (pinCode.value === '123456') {
      step.value = 'done'
      toast.add({ title: 'Conta verificada! 🎉', description: 'Bem-vindo ao PortfolioSaaS!', color: 'success' })
    } else {
      toast.add({ title: 'Código incorreto', description: 'Tente novamente. (Dica: 123456)', color: 'error' })
      pinCode.value = ''
    }
  }
}

async function resendCode() {
  if (countdown.value > 0) return
  isResending.value = true
  await new Promise(r => setTimeout(r, 800))
  isResending.value = false
  startCountdown()
  toast.add({ title: 'Código reenviado!', color: 'success' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-950 font-sans">

    <div class="hidden lg:flex lg:w-5/12 xl:w-2/5 relative overflow-hidden bg-gray-950 flex-col items-center justify-center p-12 text-white border-r border-gray-800">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(99,102,241,0.2),transparent_60%)]" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(14,165,233,0.15),transparent_60%)]" />

      <div class="absolute top-16 right-8 w-32 h-40 rounded-2xl bg-white/5 border border-white/10 backdrop-blur rotate-6 overflow-hidden shadow-2xl">
        <div class="h-full bg-gradient-to-br from-primary-500/30 to-secondary-500/30" />
      </div>
      <div class="absolute bottom-20 right-12 w-40 h-28 rounded-2xl bg-white/5 border border-white/10 backdrop-blur -rotate-3 overflow-hidden shadow-2xl">
        <div class="h-full bg-gradient-to-br from-secondary-500/30 to-primary-500/20" />
      </div>

      <div class="relative z-10 max-w-xs">
        <div class="flex items-center gap-2.5 mb-12">
          <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <UIcon name="i-heroicons-sparkles" class="text-white" />
          </div>
          <span class="text-lg font-bold tracking-wide">PortfolioSaaS</span>
        </div>

        <h2 class="text-3xl font-extrabold leading-tight mb-4">
          Crie o seu portfólio<br>em 5 minutos.
        </h2>
        <p class="text-white/60 text-sm mb-10 leading-relaxed">
          Sem código. Sem design complexo. Apenas o seu trabalho, apresentado da melhor forma para o mundo.
        </p>

        <div class="space-y-4">
          <div v-for="(item, i) in ['Crie sua conta gratuitamente', 'Escolha um tema profissional', 'Adicione seus projetos', 'Compartilhe seu link']" :key="i" class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center flex-shrink-0">
              <span class="text-primary-400 text-xs font-bold">{{ i + 1 }}</span>
            </div>
            <span class="text-white/70 text-sm">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center min-h-screen p-5 sm:p-8">

      <div class="flex lg:hidden items-center gap-2 mb-8">
        <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-sparkles" class="text-white text-sm" />
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white">PortfolioSaaS</span>
      </div>

      <div class="w-full max-w-sm">
        <Transition name="slide" mode="out-in">

          <div v-if="step === 'form'" key="form">
            <div class="mb-7">
              <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Crie sua conta</h1>
              <p class="text-gray-500 text-sm">
                Já tem uma conta?
                <ULink to="/auth/login" class="text-primary-500 font-semibold hover:underline">Entrar agora</ULink>
              </p>
            </div>

            <UAuthForm
              :schema="schema"
              :fields="fields"
              :providers="providers"
              title=""
              align="top"
              @submit="onSubmit"
            >
              <template #password-hint>
                <span class="text-xs text-gray-400">Mínimo de 8 caracteres</span>
              </template>
              
              <template #footer>
                <p class="text-xs text-center text-gray-400 mt-4">
                  Ao se cadastrar, você concorda com nossos
                  <ULink to="#" class="text-primary-500 hover:underline">Termos</ULink> e
                  <ULink to="#" class="text-primary-500 hover:underline">Privacidade</ULink>.
                </p>
              </template>
            </UAuthForm>
          </div>

          <div v-else-if="step === 'pin'" key="pin" class="text-center">
            
            <div class="flex items-center justify-center gap-2 mb-8 opacity-80">
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <UIcon name="i-heroicons-check" class="text-white text-xs" />
                </div>
                <span class="text-xs text-gray-500">Cadastro</span>
              </div>
              <div class="w-8 h-px bg-primary-200 dark:bg-primary-800" />
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/30 flex items-center justify-center">
                  <span class="text-white text-xs font-bold">2</span>
                </div>
                <span class="text-xs text-primary-600 dark:text-primary-400 font-medium">Verificação</span>
              </div>
            </div>

            <div class="relative w-20 h-20 mx-auto mb-6">
              <div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-envelope-open" class="text-primary-500 text-4xl" />
              </div>
            </div>

            <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Verifique seu e-mail</h2>
            <p class="text-gray-500 text-sm mb-1">Enviamos um código de 6 dígitos para</p>
            <p class="font-semibold text-gray-900 dark:text-white text-sm mb-8">{{ emailCadastro }}</p>

            <div class="flex justify-center mb-8">
              <UPinInput
                v-model="pinCode"
                :length="6"
                size="xl"
                placeholder="·"
                @complete="onPinComplete"
              />
            </div>

            <div class="space-y-4">
              <p class="text-sm text-gray-400">Não recebeu o código?</p>
              <div class="flex gap-2 justify-center flex-wrap">
                <UButton
                  variant="soft"
                  icon="i-heroicons-arrow-path"
                  :label="countdown > 0 ? `Reenviar em ${countdown}s` : 'Reenviar código'"
                  :loading="isResending"
                  :disabled="countdown > 0"
                  size="sm"
                  @click="resendCode"
                />
                <UButton
                  variant="ghost"
                  color="gray"
                  icon="i-heroicons-pencil-square"
                  label="Corrigir e-mail"
                  size="sm"
                  @click="step = 'form'"
                />
              </div>
            </div>
          </div>

          <div v-else key="done" class="text-center">
            <div class="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-check-badge" class="text-green-500 text-5xl" />
            </div>
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Conta criada! 🎉</h2>
            <p class="text-gray-500 text-sm mb-8">Sua conta está ativa e pronta para uso.</p>
            <UButton
              to="/dashboard"
              size="lg"
              label="Ir para o Dashboard"
              trailing-icon="i-heroicons-arrow-right"
              class="font-semibold"
              block
            />
          </div>

        </Transition>
      </div>

      <p class="mt-10 text-xs text-gray-400">© {{ new Date().getFullYear() }} PortfolioSaaS</p>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>