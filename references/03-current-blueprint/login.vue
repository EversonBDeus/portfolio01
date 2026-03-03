<script setup lang="ts">
import { ref } from 'vue'

import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Entrar — PortfolioSaaS' })

const toast = useToast()
const isVerifying = ref(false)
const emailLogin = ref('')
const pinCode = ref('')

const fields = [
  { name: 'email', type: 'email', label: 'E-mail', placeholder: 'Seu endereço de e-mail' },
  { name: 'password', label: 'Senha', type: 'password', placeholder: 'Sua senha segura' }
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


function onSubmitAuth(payload: FormSubmitEvent<Schema>) {
  emailLogin.value = payload.data.email
  isVerifying.value = true
  toast.add({
    title: 'Código enviado!',
    description: 'Verifique sua caixa de entrada (e o spam).',
    color: 'success'
  })
}

function onPinComplete() {
  if (pinCode.value === '123456') {
    toast.add({ title: 'Bem-vindo de volta!', description: 'Redirecionando para o painel...', color: 'success' })
    // Aqui no futuro entrará o useRouter().push('/dashboard')
  } else {
    toast.add({ title: 'Código incorreto', description: 'Tente novamente. (Dica: 123456)', color: 'error' })
    pinCode.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-950 font-sans">

    <div class="hidden lg:flex lg:w-5/12 xl:w-2/5 relative overflow-hidden bg-gray-950 flex-col items-center justify-center p-12 text-white border-r border-gray-800">
      
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(99,102,241,0.2),transparent_60%)]" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(14,165,233,0.15),transparent_60%)]" />

      <div class="relative z-10 max-w-xs">
        <div class="flex items-center gap-2.5 mb-12">
          <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <UIcon name="i-heroicons-sparkles" class="text-white" />
          </div>
          <span class="text-lg font-bold tracking-wide">PortfolioSaaS</span>
        </div>

        <h2 class="text-3xl font-extrabold leading-tight mb-4">
          Bem-vindo<br>de volta.
        </h2>
        <p class="text-white/60 text-sm mb-10 leading-relaxed">
          Acesse seu painel, atualize seus projetos e acompanhe as visitas do seu portfólio.
        </p>

        <div class="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-left">
          <div class="flex items-center gap-3 mb-2">
            <UAvatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Foto usuário" size="sm" />
            <div>
              <p class="font-semibold text-sm">Mariana Costa</p>
              <p class="text-white/50 text-xs">Desenvolvedora Frontend</p>
            </div>
          </div>
          <p class="text-white/70 text-xs italic">
            "A melhor plataforma que já usei para hospedar meus projetos. Simples e direto ao ponto."
          </p>
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

        <Transition name="fade" mode="out-in">
          
          <div v-if="!isVerifying" key="form">
            <div class="mb-8">
              <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                Acesse sua conta
              </h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Ainda não tem cadastro?
                <ULink to="/auth/register" class="text-primary-500 font-semibold hover:underline">Crie uma conta grátis</ULink>
              </p>
            </div>

            <UAuthForm
              :schema="schema"
              :fields="fields"
              :providers="providers"
              title=""
              align="top"
              @submit="onSubmitAuth"
            >
              <template #password-hint>
                <ULink to="/auth/recuperar" class="text-primary-500 hover:text-primary-600 text-xs font-medium">
                  Esqueceu a senha?
                </ULink>
              </template>
            </UAuthForm>
          </div>

          <div v-else key="pin" class="text-center">
            <div class="flex justify-center mb-6">
              <div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-shield-check" class="text-primary-500 text-4xl" />
              </div>
            </div>

            <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Verificação de segurança
            </h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Confirme o código que enviamos para
            </p>
            <p class="font-semibold text-gray-900 dark:text-white text-sm mb-8">
              {{ emailLogin }}
            </p>

            <div class="flex justify-center mb-8">
              <UPinInput
                v-model="pinCode"
                :length="6"
                size="xl"
                placeholder="·"
                @complete="onPinComplete"
              />
            </div>

            <div class="space-y-3">
              <div class="flex gap-3 justify-center">
                <UButton
                  variant="ghost"
                  color="gray"
                  icon="i-heroicons-arrow-left"
                  label="Voltar para login"
                  size="sm"
                  @click="isVerifying = false"
                />
              </div>
            </div>
          </div>
        </Transition>

      </div>

      <p class="mt-10 text-xs text-gray-400 text-center">
        © {{ new Date().getFullYear() }} PortfolioSaaS · Todos os direitos reservados
      </p>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from { opacity: 0; transform: translateX(16px); }
.fade-leave-to { opacity: 0; transform: translateX(-16px); }
</style>