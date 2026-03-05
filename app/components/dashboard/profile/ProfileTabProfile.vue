<script setup lang="ts">
import type { UserProfile } from '~/composables/usePerfilState'

const props = defineProps<{ model: UserProfile }>()
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
        <UInput v-model="props.model.nome" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Seu nome</span>
          </label>
        </UInput>
      </div>

      <div class="relative">
        <UInput v-model="props.model.location" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Localização</span>
          </label>
        </UInput>
      </div>

      <div class="relative sm:col-span-2">
        <UInput v-model="props.model.headline" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Seu título profissional</span>
          </label>
        </UInput>
      </div>

      <UFormGroup label="Bio" class="sm:col-span-2">
        <UTextarea v-model="props.model.bio" :rows="5" class="w-full" @update:model-value="markDirty" />
      </UFormGroup>
    </div>

    <USeparator />

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="relative">
        <UInput v-model="props.model.linkedin" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">LinkedIn</span>
          </label>
        </UInput>
      </div>

      <div class="relative">
        <UInput v-model="props.model.github" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">GitHub</span>
          </label>
        </UInput>
      </div>

      <div class="relative sm:col-span-2">
        <UInput v-model="props.model.instagram" placeholder=" " :ui="inputUi" class="w-full" @update:model-value="markDirty">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all
                        peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Instagram</span>
          </label>
        </UInput>
      </div>
    </div>
  </div>
</template>