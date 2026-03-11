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

const hasIcon = computed(() => Boolean(props.icon))

const surfaceClass = 'bg-slate-50 dark:bg-[rgba(15,23,42,0.68)]'
const inputPaddingClass = computed(() => (hasIcon.value ? 'ps-11 pe-12' : 'px-4'))
const labelOffsetClass = computed(() => (hasIcon.value ? 'start-11' : 'start-4'))

const inputUi = computed(() => ({
  root: 'relative w-full',
  base: [
    'peer h-12 w-full rounded-2xl border text-slate-900 placeholder:text-transparent dark:text-white',
    'border-slate-200/90 dark:border-emerald-400/38',
    surfaceClass,
    inputPaddingClass.value,
    'shadow-sm transition-[border-color,box-shadow,background-color]',
    'focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/15',
    'dark:focus-visible:border-emerald-400/70 dark:focus-visible:ring-emerald-400/18',
    'disabled:cursor-not-allowed disabled:opacity-60'
  ].join(' '),
  leading: 'absolute inset-y-0 start-0 flex items-center ps-4',
  trailing: 'absolute inset-y-0 end-0 flex items-center pe-3'
}))

const floatingLabelBaseClass = [
  'pointer-events-none absolute z-[1] -top-2 text-xs font-medium text-emerald-600 dark:text-emerald-300',
  'transition-all duration-200',
  'peer-focus:-top-2 peer-focus:text-xs peer-focus:font-medium',
  'peer-focus:text-emerald-600 dark:peer-focus:text-emerald-300',
  'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2',
  'peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal',
  'peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-slate-400',
  'peer-focus:translate-y-0'
].join(' ')

const floatingLabelSurfaceClass = `${surfaceClass} inline-flex px-1.5 leading-none`
</script>

<template>
  <div class="w-full min-w-0">
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
      <template #default>
        <label :class="[floatingLabelBaseClass, labelOffsetClass]">
          <span :class="floatingLabelSurfaceClass">
            {{ props.label }}
          </span>
        </label>
      </template>

      <template v-if="props.icon" #leading>
        <UIcon :name="props.icon" class="size-5 text-slate-400 dark:text-slate-500" />
      </template>

      <template v-if="$slots.trailing" #trailing>
        <slot name="trailing" />
      </template>
    </UInput>
  </div>
</template>