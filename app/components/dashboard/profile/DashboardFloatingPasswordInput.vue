<script setup lang="ts">
import { computed, ref } from 'vue'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

type Props = {
  label: string
  icon?: string
  autocomplete?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-lock',
  autocomplete: 'current-password',
  disabled: false
})

const model = defineModel<string>({ default: '' })
const visible = ref(false)

const currentType = computed(() => (visible.value ? 'text' : 'password'))
const toggleAriaLabel = computed(() =>
  visible.value ? 'Ocultar senha' : 'Mostrar senha'
)
</script>

<template>
  <DashboardFloatingInput
    v-model="model"
    :label="props.label"
    :icon="props.icon"
    :type="currentType"
    :autocomplete="props.autocomplete"
    :disabled="props.disabled"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="visible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="toggleAriaLabel"
        @click.prevent="visible = !visible"
      />
    </template>
  </DashboardFloatingInput>
</template>