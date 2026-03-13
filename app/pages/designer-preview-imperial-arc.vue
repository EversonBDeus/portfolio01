<script setup lang="ts">
import { computed, watch } from 'vue'
import ImperialArcTemplate from '~/components/templates/ImperialArcTemplate/ImperialArcTemplate.vue'
import { DESIGNER_PREVIEW_PORTFOLIO } from '~/data/designer-preview'
import type { ThemePresetId } from '~/composables/useThemePresets'

const route = useRoute()
const colorMode = useColorMode()
const { presets, preset, setPreset } = useThemePresets()

const themeNames: Record<ThemePresetId, string> = {
  'ux-mastery': 'Aurora UX',
  'neon-spectrum': 'Neon Pulse',
  'lava-sunset': 'Sunforge',
  'pastel-pop': 'Soft Bloom',
  'aquatech-minimal': 'Aqua Flow',
  'ux-elite': 'Velvet Grid',
  'rose-wine': 'Rose Velvet',
  'minty-dark': 'Mint Noir',
  'sunset-lava': 'Solar Ember',
  'cyber-lime': 'Cyber Lime'
}

function isThemePresetId(value: string): value is ThemePresetId {
  return presets.some((item) => item.id === value)
}

const presetFromQuery = computed<ThemePresetId | null>(() => {
  const value = String(route.query.preset ?? '').trim()
  return value && isThemePresetId(value) ? value : null
})

const modeFromQuery = computed<'light' | 'dark' | null>(() => {
  const value = String(route.query.mode ?? '').trim()
  return value === 'light' || value === 'dark' ? value : null
})

const device = computed<'desktop' | 'mobile'>(() => {
  return String(route.query.device ?? '').trim() === 'mobile' ? 'mobile' : 'desktop'
})

watch(
  presetFromQuery,
  (value) => {
    if (value && value !== preset.value.id) {
      setPreset(value)
    }
  },
  { immediate: true }
)

watch(
  modeFromQuery,
  (value) => {
    if (value && colorMode.preference !== value) {
      colorMode.preference = value
    }
  },
  { immediate: true }
)

const activePresetId = computed<ThemePresetId>(() => {
  return presetFromQuery.value ?? preset.value.id
})

const activeThemeName = computed(() => {
  return themeNames[activePresetId.value] ?? 'Imperial Arc'
})

const previewPortfolio = computed(() => {
  return {
    ...DESIGNER_PREVIEW_PORTFOLIO,
    settings: {
      ...DESIGNER_PREVIEW_PORTFOLIO.settings,
      templateId: 'imperial-arc'
    }
  }
})

useSeoMeta({
  title: 'Designer Preview Imperial Arc',
  description: 'Preview isolado do template premium Imperial Arc'
})
</script>

<template>
  <div class="app-bg bg-theme min-h-screen px-4 py-5 sm:px-6">
    <div class="bg-fx bg-anim-05 bg-anim-07" />

    <div class="mx-auto grid max-w-7xl gap-4">
      <header class="surface-panel rounded-[24px] p-4 sm:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              <UBadge color="primary" variant="soft">
                Novo template premium
              </UBadge>

              <UBadge color="neutral" variant="soft">
                {{ activeThemeName }}
              </UBadge>
            </div>

            <div class="space-y-1">
              <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                Imperial Arc
              </h1>

              <p class="max-w-3xl text-sm leading-7 text-muted">
                Preview com hero luxuoso, rail lateral de ações, spotlight com seletor
                de projetos e composição mais editorial high-ticket.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge color="neutral" variant="soft">
              Modo: {{ modeFromQuery || colorMode.value }}
            </UBadge>

            <UBadge color="neutral" variant="soft">
              Device: {{ device }}
            </UBadge>
          </div>
        </div>
      </header>

      <div
        :class="device === 'mobile'
          ? 'mx-auto w-full max-w-[470px]'
          : 'mx-auto w-full max-w-6xl'"
      >
        <ImperialArcTemplate
          :portfolio="previewPortfolio"
          :theme-name="activeThemeName"
        />
      </div>

      <footer class="surface-panel rounded-[24px] p-4">
        <div class="space-y-2 text-sm text-muted">
          <p>Testes úteis:</p>

          <div class="flex flex-wrap gap-2">
            <code class="rounded-lg bg-black/5 px-2 py-1 dark:bg-white/10">
              /designer-preview-imperial-arc
            </code>

            <code class="rounded-lg bg-black/5 px-2 py-1 dark:bg-white/10">
              /designer-preview-imperial-arc?preset=rose-wine&amp;mode=dark
            </code>

            <code class="rounded-lg bg-black/5 px-2 py-1 dark:bg-white/10">
              /designer-preview-imperial-arc?preset=ux-elite&amp;device=mobile
            </code>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>