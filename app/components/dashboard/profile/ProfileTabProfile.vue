<script setup lang="ts">
import type { UserProfile } from '~/composables/usePerfilState'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

const props = defineProps<{ model: UserProfile }>()
const emit = defineEmits<{ dirty: [] }>()

function markDirty() {
  emit('dirty')
}
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <DashboardFloatingInput
        v-model="props.model.nome"
        label="Seu nome"
        icon="i-lucide-user-round"
        autocomplete="name"
        @update:model-value="markDirty"
      />

      <DashboardFloatingInput
        v-model="props.model.location"
        label="Localização"
        icon="i-lucide-map-pin"
        autocomplete="address-level2"
        @update:model-value="markDirty"
      />

      <div class="sm:col-span-2">
        <DashboardFloatingInput
          v-model="props.model.headline"
          label="Seu título profissional"
          icon="i-lucide-briefcase-business"
          autocomplete="organization-title"
          @update:model-value="markDirty"
        />
      </div>

      <UFormField label="Bio" class="sm:col-span-2">
        <UTextarea
          v-model="props.model.bio"
          :rows="5"
          class="w-full"
          @update:model-value="markDirty"
        />
      </UFormField>
    </div>

    <USeparator />

    <div class="grid gap-4 sm:grid-cols-2">
      <DashboardFloatingInput
        v-model="props.model.linkedin"
        label="LinkedIn"
        icon="i-simple-icons-linkedin"
        autocomplete="url"
        @update:model-value="markDirty"
      />

      <DashboardFloatingInput
        v-model="props.model.github"
        label="GitHub"
        icon="i-simple-icons-github"
        autocomplete="url"
        @update:model-value="markDirty"
      />

      <div class="sm:col-span-2">
        <DashboardFloatingInput
          v-model="props.model.instagram"
          label="Instagram"
          icon="i-simple-icons-instagram"
          autocomplete="url"
          @update:model-value="markDirty"
        />
      </div>
    </div>
  </div>
</template>