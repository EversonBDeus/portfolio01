<script setup lang="ts">
import { computed, ref } from 'vue'
import AuthFloatingInput from '~/components/auth/AuthFloatingInput.vue'

const props = withDefaults(defineProps<{
  label: string
  icon?: string
  autocomplete?: string
  disabled?: boolean
}>(), {
  icon: 'i-lucide-lock',
  autocomplete: 'current-password',
  disabled: false
})

const emit = defineEmits<{
  focus: []
  blur: []
}>()

const model = defineModel<string>({ default: '' })
const visible = ref(false)

const currentType = computed(() => (visible.value ? 'text' : 'password'))
const toggleAriaLabel = computed(() => (
  visible.value ? 'Ocultar senha' : 'Mostrar senha'
))
</script>

<template>
  <AuthFloatingInput
    v-model="model"
    :label="props.label"
    :icon="props.icon"
    :type="currentType"
    :autocomplete="props.autocomplete"
    :disabled="props.disabled"
    @focus="emit('focus')"
    @blur="emit('blur')"
  >
    <template #trailing>
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        size="sm"
        :icon="visible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="toggleAriaLabel"
        class="text-slate-400 hover:text-slate-700 dark:hover:text-white"
        @click.prevent="visible = !visible"
      />
    </template>
  </AuthFloatingInput>
</template>