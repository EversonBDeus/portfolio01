<script setup lang="ts">
import type { AccountData } from '~/composables/usePerfilState'

const props = defineProps<{ model: AccountData }>()
const emit = defineEmits<{ dirty: [] }>()

function markDirty() {
  emit('dirty')
}

const inputUi = {
  base: 'peer bg-default text-default ring-1 ring-default focus:ring-2 focus:ring-primary'
}
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="relative">
        <UInput v-model="props.model.email" type="email" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">E-mail</span>
          </label>
        </UInput>
      </div>

      <div class="relative">
        <UInput v-model="props.model.username" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Usuário</span>
          </label>
        </UInput>
      </div>

      <UFormField  label="Plano">
        <USelect
          v-model="props.model.plan"
          :options="[
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