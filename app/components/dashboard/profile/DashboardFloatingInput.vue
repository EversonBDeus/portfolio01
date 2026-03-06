<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'

type Props = {
  label: string
  icon?: string
  type?: string
  autocomplete?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  type: 'text',
  autocomplete: undefined,
  disabled: false
})

defineSlots<{
  trailing?: () => any
}>()

const model = defineModel<string>({ default: '' })

const {
  inputUi,
  floatingLabelBaseClass,
  floatingLabelSurfaceClass
} = useDashboardFormUi()

const labelOffsetClass = computed(() =>
  props.icon ? 'start-10' : 'start-3'
)
</script>

<template>
  <UInput
    v-model="model"
    :type="props.type"
    :placeholder="' '"
    :icon="props.icon"
    :autocomplete="props.autocomplete"
    :disabled="props.disabled"
    size="lg"
    :ui="inputUi"
  >
    <template #default>
      <label :class="[floatingLabelBaseClass, labelOffsetClass]">
        <span :class="floatingLabelSurfaceClass">
          {{ props.label }}
        </span>
      </label>
    </template>

    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>
  </UInput>
</template>