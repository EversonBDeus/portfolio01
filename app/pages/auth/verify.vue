<script setup lang="ts">
// pages/auth/verify.vue
// Verificação de e-mail com código de 6 dígitos.
//
// COMPONENTES NUXT UI vs. versão anterior:
//
// UPinInput:
//   - Substitui os 6 UInput individuais geridos manualmente.
//   - :length="6" → cria os 6 campos automaticamente com gestão de foco nativa.
//   - autofocus → foca o primeiro campo ao montar.
//   - size="xl" → campos grandes e fáceis de preencher em mobile.
//   - otp → autocomplete="one-time-code" (melhora UX em iOS — sugestão do SMS).
//   - type="number" → teclado numérico em mobile.
//
// UButton variant="link" para o reenvio:
//   - Padrão da documentação para acções inline de texto.
//   - :disabled quando cooldown activo (sem estilo de erro, apenas fica acinzentado).
//   - :icon dinâmico (clock durante cooldown, arrow-path quando disponível).
//   - :padded="false" → alinhamento correcto em linha com o texto.
//
// Transition mode="out-in" no ícone do header:
//   - Animação enter/leave entre envelope → check-badge sem sobreposição.
//   - :key no UIcon força nova animação quando o ícone muda.

definePageMeta({ layout: false })
useSeoMeta({ title: 'Verificar e-mail — FolioForge' })

const toast   = useToast()
const router  = useRouter()

const loading    = ref(false)
const completed  = ref(false)
const resendCooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const state = reactive({ code: [] as string[] })

const isComplete = computed(
  () => state.code.length === 6 && state.code.every(Boolean)
)

async function onSubmit() {
  if (!isComplete.value || loading.value) return
  loading.value = true
  // TODO (Fase 2): POST /api/auth/verify { code: state.code.join('') }
  await new Promise(r => setTimeout(r, 1500))
  loading.value   = false
  completed.value = true

  toast.add({
    title:       'E-mail verificado!',
    description: 'A tua conta foi confirmada com sucesso.',
    color:       'success',
    icon:        'i-lucide-circle-check',
  })

  setTimeout(() => router.push('/dashboard'), 1500)
}

async function resendCode() {
  if (resendCooldown.value > 0) return
  resendCooldown.value = 60
  toast.add({
    title:       'Código reenviado',
    description: 'Verifica a tua caixa de entrada.',
    color:       'info',
  })
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

onUnmounted(() => { if (cooldownInterval) clearInterval(cooldownInterval) })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">

    <UCard
      class="w-full max-w-md"
      :ui="{ root: 'ring-1 ring-green-100 dark:ring-green-900/30 shadow-xl shadow-green-100/50 dark:shadow-green-900/20' }"
    >
      <!-- Header animado ─────────────────────────────────── -->
      <div class="flex flex-col items-center text-center gap-4 pb-6">

        <div
          class="size-16 rounded-2xl flex items-center justify-center transition-all duration-500"
          :class="completed
            ? 'bg-green-100 dark:bg-green-900/40 ring-4 ring-green-200 dark:ring-green-800'
            : 'bg-green-50 dark:bg-green-900/20 ring-4 ring-green-100 dark:ring-green-900/30'"
        >
          <!--
            Transition mode="out-in": o ícone antigo sai completamente
            antes do novo entrar — sem sobreposição visual.
            :key força re-animação quando o ícone muda de estado.
          -->
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-50"
            leave-active-class="transition-all duration-200"
            leave-to-class="opacity-0 scale-50"
          >
            <UIcon
              :key="completed ? 'check' : 'envelope'"
              :name="completed ? 'i-lucide-badge-check' : 'i-lucide-mail-open'"
              class="size-8"
              :class="completed ? 'text-green-600 dark:text-green-400' : 'text-green-500 dark:text-green-400'"
            />
          </Transition>
        </div>

        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ completed ? 'Tudo certo!' : 'Verifica o teu e-mail' }}
          </h1>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {{ completed ? 'A redirecionar para o painel…' : 'Insere o código de 6 dígitos enviado para o teu e-mail.' }}
          </p>
        </div>
      </div>

      <USeparator class="mb-6" />

      <!-- Formulário ─────────────────────────────────────── -->
      <div class="space-y-5">

        <div class="flex justify-center">
          <!--
            UPinInput: substitui 6 inputs manuais com gestão de foco automática.
            - :length="6" → 6 células (sem loop de inputs).
            - autofocus → foca automaticamente ao montar.
            - otp → autocomplete="one-time-code" (iOS sugere o código do SMS).
            - type="number" → teclado numérico em mobile.
            - size="xl" → células maiores, mais fácil de tocar.
          -->
          <UPinInput
            v-model="state.code"
            :length="6"
            autofocus
            size="xl"
            type="number"
            otp
            :disabled="loading || completed"
            :ui="{ root: 'gap-2.5' }"
          />
        </div>

        <!--
          UButton block size="xl" color="success" :loading :disabled:
          - :loading → spinner nativo, desactiva o botão durante o pedido.
          - :disabled → quando incompleto ou já verificado.
          - icon dinâmico: check-circle pós-verificação, lock-closed antes.
        -->
        <UButton
          block
          size="xl"
          color="success"
          :loading="loading"
          :disabled="!isComplete || completed"
          :icon="completed ? 'i-lucide-circle-check' : 'i-lucide-lock'"
          class="font-semibold"
          @click="onSubmit"
        >
          {{ completed ? 'Verificado!' : 'Confirmar Código' }}
        </UButton>
      </div>

      <!-- Footer ─────────────────────────────────────────── -->
      <div class="mt-6 space-y-4">
        <div class="flex items-center justify-center gap-1.5 text-sm">
          <span class="text-gray-500 dark:text-gray-400">Não recebeste?</span>

          <!--
            UButton variant="link" color="success" :padded="false":
            - Padrão documentação "link inline" — sem padding, sem fundo.
            - :disabled → quando cooldown activo, fica acinzentado sem erro.
            - :icon dinâmico: clock durante cooldown, arrow-path quando livre.
          -->
          <UButton
            variant="link"
            color="success"
            size="sm"
            :disabled="resendCooldown > 0"
            :padded="false"
            :icon="resendCooldown > 0 ? 'i-lucide-clock' : 'i-lucide-refresh-cw'"
            @click="resendCode"
          >
            {{ resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código' }}
          </UButton>
        </div>

        <div class="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 pt-3 border-t border-gray-100 dark:border-gray-800">
          <UIcon name="i-lucide-shield-check" class="size-3.5 text-green-400 shrink-0" />
          <span>Código válido por 10 minutos</span>
        </div>
      </div>

    </UCard>
  </div>
</template>
