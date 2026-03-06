<script setup lang="ts">
import type { AccountData } from '~/composables/usePerfilState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

const props = defineProps<{ model: AccountData }>()
const emit = defineEmits<{ dirty: [] }>()

function markDirty() {
  emit('dirty')
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h2 class="text-base font-semibold">Dados internos da conta</h2>
      <p class="text-sm text-muted">
        Aqui ficam login, identificadores e metadados da conta. Plano, segurança e notificações têm abas próprias.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <DashboardFloatingInput
        v-model="props.model.email"
        type="email"
        label="E-mail de acesso"
        icon="i-lucide-mail"
        autocomplete="email"
        @update:model-value="markDirty"
      />

      <DashboardFloatingInput
        v-model="props.model.username"
        label="Usuário"
        icon="i-lucide-at-sign"
        autocomplete="username"
        @update:model-value="markDirty"
      />

      <div class="sm:col-span-2">
        <DashboardFloatingInput
          v-model="props.model.accountId"
          label="ID da conta"
          icon="i-lucide-fingerprint"
          disabled
        />
      </div>

      <DashboardFloatingInput
        v-model="props.model.createdAt"
        label="Conta criada em"
        icon="i-lucide-calendar-plus"
        disabled
      />

      <DashboardFloatingInput
        v-model="props.model.lastLogin"
        label="Último acesso"
        icon="i-lucide-history"
        disabled
      />
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-info"
      title="Separação intencional"
      description="Plano não fica mais aqui para evitar mistura entre dados da conta e assinatura. A aba Conta agora serve apenas para dados internos do usuário."
      color="neutral"
      variant="outline"
    />
  </div>
</template>