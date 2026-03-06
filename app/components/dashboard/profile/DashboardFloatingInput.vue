<script setup lang="ts">
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'

const model = defineModel<string | undefined>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    type?: string
    icon?: string
    autocomplete?: string
    disabled?: boolean
  }>(),
  {
    type: 'text',
    autocomplete: undefined,
    disabled: false,
    icon: undefined
  }
)

const {
  inputUi: sharedInputUi,
  floatingLabelBaseClass,
  floatingLabelSurfaceClass
} = useDashboardFormUi()

const inputUi = computed(() => ({
  ...sharedInputUi,
  leading: props.icon ? sharedInputUi.leading : ''
}))

const labelClass = computed(() => {
  const left = props.icon ? 'left-9' : 'left-0'

  return [floatingLabelBaseClass, left].join(' ')
})
</script>

<template>
  <div class="relative">
    <UInput
      v-model="model"
      :type="type"
      :icon="icon"
      :autocomplete="autocomplete"
      :disabled="disabled"
      placeholder=""
      class="w-full"
      :ui="inputUi"
    >
      <label :class="labelClass">
        <span :class="floatingLabelSurfaceClass">
          {{ label }}
        </span>
      </label>
    </UInput>
  </div>
</template>