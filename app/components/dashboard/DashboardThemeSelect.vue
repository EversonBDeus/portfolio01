<script setup lang="ts">
import type { ThemePresetId } from '~/composables/useThemePresets'

const { presets, preset, setPreset } = useThemePresets()

const selected = computed<ThemePresetId>({
  get: () => preset.value.id,
  set: (v) => setPreset(v)
})

const options = computed(() => presets.map(p => ({ label: p.label, value: p.id })))
</script>

<template>
  <div class="hidden md:flex items-center gap-2">
    <span class="text-xs text-muted">Tema</span>

    <USelect
      v-model="selected"
      :options="options"
      size="sm"
      class="w-48"
      aria-label="Selecionar tema de cores"
    />
  </div>
</template>