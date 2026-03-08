<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  label: string
  icon?: string
  type?: string
  autocomplete?: string
  disabled?: boolean
  spellcheck?: boolean
  inputmode?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  type: 'text',
  autocomplete: undefined,
  disabled: false,
  spellcheck: false,
  inputmode: undefined
})

const emit = defineEmits<{
  focus: []
  blur: []
}>()

defineSlots<{
  trailing?: () => any
}>()

const model = defineModel<string>({ default: '' })

const hasValue = computed(() => model.value.trim().length > 0)
const hasIcon = computed(() => Boolean(props.icon))

const surfaceClass = 'bg-slate-50 dark:bg-[rgba(15,23,42,0.68)]'
const inputPaddingClass = computed(() => (hasIcon.value ? 'ps-11 pe-12' : 'px-4'))
const labelOffsetClass = computed(() => (hasIcon.value ? 'left-11' : 'left-4'))

const inputUi = computed(() => ({
  root: 'w-full',
  base: [
    'h-12 w-full rounded-2xl border text-slate-900 placeholder:text-transparent dark:text-white',
    'border-slate-200/90 dark:border-emerald-400/38',
    surfaceClass,
    inputPaddingClass.value,
    'shadow-sm transition-[border-color,box-shadow,background-color]',
    'focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/15',
    'dark:focus-visible:border-emerald-400/70 dark:focus-visible:ring-emerald-400/18',
    'disabled:cursor-not-allowed disabled:opacity-60'
  ].join(' '),
  leading: 'absolute inset-y-0 left-0 flex items-center pl-4',
  trailing: 'absolute inset-y-0 right-0 flex items-center pr-3'
}))

const labelClass = computed(() => {
  return [
    'pointer-events-none absolute z-[1] transition-all duration-200',
    labelOffsetClass.value,
    hasValue.value
      ? '-top-2 translate-y-0 text-xs text-emerald-600 dark:text-emerald-300'
      : 'top-1/2 -translate-y-1/2 text-[14px] text-slate-400 dark:text-slate-400',
    'group-focus-within:-top-2 group-focus-within:translate-y-0 group-focus-within:text-xs',
    'group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-300'
  ]
})

const labelSurfaceClass = `${surfaceClass} inline-flex px-1.5 leading-none`
</script>

<template>
  <div class="group relative">
    <UInput
      v-model="model"
      :type="props.type"
      :placeholder="' '"
      :autocomplete="props.autocomplete"
      :disabled="props.disabled"
      :spellcheck="props.spellcheck"
      :inputmode="props.inputmode"
      size="xl"
      color="primary"
      variant="none"
      class="w-full"
      :ui="inputUi"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >
      <template v-if="props.icon" #leading>
        <UIcon :name="props.icon" class="size-5 text-slate-400 dark:text-slate-500" />
      </template>

      <template v-if="$slots.trailing" #trailing>
        <slot name="trailing" />
      </template>
    </UInput>

    <label :class="labelClass">
      <span :class="labelSurfaceClass">
        {{ props.label }}
      </span>
    </label>
  </div>
</template>