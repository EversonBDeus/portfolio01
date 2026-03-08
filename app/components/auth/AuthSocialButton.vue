<script setup lang="ts">
import { computed } from 'vue'

type Provider = 'google' | 'facebook'

const props = defineProps<{
  provider: Provider
  tooltip: string
}>()

defineEmits<{
  click: []
}>()

const iconName = computed(() => {
  return props.provider === 'google'
    ? 'i-simple-icons-google'
    : 'i-simple-icons-facebook'
})

const iconClass = computed(() => {
  return props.provider === 'google'
    ? 'text-[#DB4437]'
    : 'text-[#1877F2]'
})
</script>

<template>
  <UTooltip :text="props.tooltip">
    <button
      type="button"
      class="inline-flex size-13 items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-50 shadow-sm transition-[border-color,transform,background-color] duration-200 hover:border-emerald-400/45 hover:bg-white active:scale-[0.98] dark:border-emerald-400/35 dark:bg-[rgba(15,23,42,0.58)] dark:hover:bg-[rgba(15,23,42,0.72)]"
      @click="$emit('click')"
    >
      <UIcon :name="iconName" class="size-5" :class="iconClass" />
    </button>
  </UTooltip>
</template>