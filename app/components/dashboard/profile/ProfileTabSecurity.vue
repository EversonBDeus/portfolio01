<script setup lang="ts">
import { computed } from 'vue'
import type { SecurityData } from '~/composables/usePerfilState'
import { useDashboardThemeUi } from '~/composables/useDashboardThemeUi'
import DashboardFloatingPasswordInput from '~/components/dashboard/profile/DashboardFloatingPasswordInput.vue'

const props = defineProps<{ model: SecurityData }>()
const emit = defineEmits<{ dirty: [] }>()

const { switchUi } = useDashboardThemeUi()

const twoFactorItems: Array<{
  label: string
  value: SecurityData['twoFactorMethod']
}> = [
  { label: 'Aplicativo autenticador', value: 'app' },
  { label: 'SMS', value: 'sms' },
  { label: 'E-mail', value: 'email' }
]

const passwordMismatch = computed(() => {
  if (!props.model.newPassword || !props.model.confirmPassword) return false
  return props.model.newPassword !== props.model.confirmPassword
})

function markDirty() {
  emit('dirty')
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h2 class="text-base font-semibold">Segurança da conta</h2>
      <p class="text-sm text-muted">
        Gerencie sua senha e as camadas extras de proteção da sua conta.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-shield-check"
      title="Etapa atual"
      description="Nesta fase, a aba de segurança está pronta no front-end e preparada para integração futura com autenticação real."
      color="neutral"
      variant="outline"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.9fr)]">
      <div
       class="dashboard-form-surface-2 space-y-6 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
          <h3 class="font-medium">Alterar senha</h3>
          <p class="text-sm text-muted">
            Preencha sua senha atual e defina uma nova senha para acesso à plataforma.
          </p>
        </div>

        <div class="grid gap-4">
          <DashboardFloatingPasswordInput
            v-model="props.model.currentPassword"
            label="Senha atual"
            icon="i-lucide-lock"
            autocomplete="current-password"
            @update:model-value="markDirty"
          />

          <DashboardFloatingPasswordInput
            v-model="props.model.newPassword"
            label="Nova senha"
            icon="i-lucide-key-round"
            autocomplete="new-password"
            @update:model-value="markDirty"
          />

          <DashboardFloatingPasswordInput
            v-model="props.model.confirmPassword"
            label="Confirmar nova senha"
            icon="i-lucide-badge-check"
            autocomplete="new-password"
            @update:model-value="markDirty"
          />
        </div>

        <UAlert
          v-if="passwordMismatch"
          class="dashboard-note-alert"
          icon="i-lucide-alert-triangle"
          title="As senhas não coincidem"
          description="Revise a nova senha e a confirmação antes de salvar."
          color="warning"
          variant="outline"
        />

        <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
          <p class="text-sm font-medium">Boas práticas</p>
          <ul class="mt-2 space-y-1.5 text-sm text-muted">
            <li>Use pelo menos 8 caracteres.</li>
            <li>Combine letras maiúsculas, minúsculas, números e símbolos.</li>
            <li>Evite reutilizar a mesma senha em outros serviços.</li>
          </ul>
        </div>
      </div>

      <div
        class="dashboard-form-surface-2 space-y-6 rounded-2xl border border-(--dashboard-border-strong) bg-(--dashboard-surface-2) p-4 shadow-(--dashboard-shadow-xs) sm:p-5"
      >
        <div class="space-y-1">
          <h3 class="font-medium">Autenticação em duas etapas</h3>
          <p class="text-sm text-muted">
            Adicione uma camada extra de proteção além da senha.
          </p>
        </div>

        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="text-sm font-medium">Ativar 2FA</p>
            <p class="text-xs text-muted">
              Quando ligada, a conta exigirá verificação adicional no login.
            </p>
          </div>

          <USwitch
            v-model="props.model.twoFactorEnabled"
            size="lg"
            color="success"
            :ui="switchUi"
            @update:model-value="markDirty"
          />
        </div>

        <div v-if="props.model.twoFactorEnabled" class="space-y-4">
          <UFormField label="Método da verificação">
            <USelect
              v-model="props.model.twoFactorMethod"
              :items="twoFactorItems"
              option-attribute="label"
              value-attribute="value"
              class="w-full"
              @update:model-value="markDirty"
            />
          </UFormField>

          <UAlert
            class="dashboard-note-alert"
            icon="i-lucide-smartphone"
            title="Integração futura"
            description="O fluxo de QR Code, envio de código por SMS ou confirmação por e-mail será conectado quando a autenticação real entrar no projeto."
            color="neutral"
            variant="outline"
          />
        </div>

        <div class="rounded-2xl border border-(--dashboard-border-soft) bg-(--dashboard-surface-3) p-4">
          <p class="text-sm font-medium">Status atual</p>
          <p class="mt-1 text-sm text-muted">
            {{
              props.model.twoFactorEnabled
                ? 'A autenticação em duas etapas está ativada no modo visual desta tela.'
                : 'A autenticação em duas etapas está desativada no modo visual desta tela.'
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>