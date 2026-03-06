<script setup lang="ts">
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

const inputUi = computed(() => ({
  base: 'peer bg-default text-default ring-1 ring-default focus:ring-2 focus:ring-primary',
  leading: props.icon ? 'pointer-events-none text-dimmed' : ''
}))

const labelClass = computed(() => {
  const left = props.icon ? 'left-9' : 'left-0'

  return [
    'pointer-events-none absolute z-[1] px-1.5 transition-all duration-200',
    left,
    '-top-2.5 text-xs font-medium text-highlighted',
    'peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium peer-focus:text-highlighted',
    'peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-dimmed'
  ].join(' ')
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
        <span class="inline-flex bg-default px-1">
          {{ label }}
        </span>
      </label>
    </UInput>
  </div>
</template>