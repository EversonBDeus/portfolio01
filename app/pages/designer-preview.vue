<script setup lang="ts">
import { computed, watch } from 'vue'
import AuroraUxTemplate from '~/components/templates/AuroraUx/AuroraUxTemplate.vue'
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
  return themeNames[activePresetId.value] ?? 'Aurora UX'
})

const previewPortfolio = computed(() => {
  return {
    ...DESIGNER_PREVIEW_PORTFOLIO,
    settings: {
      ...DESIGNER_PREVIEW_PORTFOLIO.settings,
      templateId: 'aurora-ux'
    }
  }
})

useSeoMeta({
  title: 'Designer Preview',
  description: 'Preview isolado do template Aurora UX'
})
</script>

<template>
  <div class="designer-preview">
    <div class="designer-preview__shell">
      <header class="designer-preview__header">
        <div class="designer-preview__header-copy">
          <p class="designer-preview__eyebrow">
            Preview isolado
          </p>

          <h1 class="designer-preview__title">
            Aurora UX
          </h1>

          <p class="designer-preview__description">
            Página temporária para refinar o designer sem tocar no fluxo público atual.
          </p>
        </div>

        <div class="designer-preview__meta">
          <span class="designer-preview__meta-pill">
            Tema: {{ activeThemeName }}
          </span>

          <span class="designer-preview__meta-pill">
            Modo: {{ modeFromQuery || colorMode.value }}
          </span>

          <span class="designer-preview__meta-pill">
            Device: {{ device }}
          </span>
        </div>
      </header>

      <div
        class="designer-preview__frame"
        :class="{
          'designer-preview__frame--mobile': device === 'mobile'
        }"
      >
        <AuroraUxTemplate
          :portfolio="previewPortfolio"
          :theme-name="activeThemeName"
        />
      </div>

      <footer class="designer-preview__footer">
        <p class="designer-preview__hint">
          Testes úteis:
          <code>/designer-preview?preset=neon-spectrum&amp;mode=dark</code>
          ·
          <code>/designer-preview?preset=ux-mastery&amp;device=mobile</code>
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.designer-preview {
  min-height: 100vh;
  padding: 1.25rem;
}

.designer-preview__shell {
  display: grid;
  gap: 1rem;
  max-width: 1280px;
  margin: 0 auto;
}

.designer-preview__header,
.designer-preview__footer {
  display: grid;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 20px 60px -44px rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(16px);
}

.designer-preview__header-copy {
  display: grid;
  gap: 0.4rem;
}

.designer-preview__eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.72);
}

.designer-preview__title {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.designer-preview__description,
.designer-preview__hint {
  margin: 0;
  line-height: 1.7;
  color: rgba(15, 23, 42, 0.72);
}

.designer-preview__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.designer-preview__meta-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 0.82rem;
  font-weight: 600;
}

.designer-preview__frame {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.designer-preview__frame--mobile {
  max-width: 410px;
}

.designer-preview__hint code {
  padding: 0.2rem 0.45rem;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.06);
  font-size: 0.85em;
}

:global(.dark) .designer-preview__header,
:global(.dark) .designer-preview__footer {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.58);
  box-shadow: 0 24px 70px -52px rgba(0, 0, 0, 0.75);
}

:global(.dark) .designer-preview__eyebrow,
:global(.dark) .designer-preview__description,
:global(.dark) .designer-preview__hint {
  color: rgba(255, 255, 255, 0.72);
}

:global(.dark) .designer-preview__meta-pill,
:global(.dark) .designer-preview__hint code {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.08);
}

@media (min-width: 768px) {
  .designer-preview {
    padding: 1.5rem;
  }

  .designer-preview__header,
  .designer-preview__footer {
    padding: 1.25rem;
  }
}
</style>