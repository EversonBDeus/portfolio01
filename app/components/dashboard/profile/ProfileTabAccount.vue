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
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <DashboardFloatingInput
        v-model="props.model.email"
        type="email"
        label="E-mail"
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

      <UFormField label="Plano">
        <USelect
          v-model="props.model.plan"
          :items="[
            { label: 'Free', value: 'free' },
            { label: 'Plus', value: 'plus' },
            { label: 'Pro', value: 'pro' }
          ]"
          class="w-full"
          @update:model-value="markDirty"
        />
      </UFormField>
    </div>

    <UAlert
      icon="i-lucide-lock"
      title="Login real entra depois"
      description="Nesta fase, o login (Supabase) ainda não foi conectado."
      color="neutral"
      variant="soft"
    />
  </div>
</template>