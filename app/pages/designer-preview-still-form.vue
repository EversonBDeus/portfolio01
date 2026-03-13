<script setup lang="ts">
import { computed } from 'vue'
import StillFormTemplate from '~/components/templates/StillFormTemplate/StillFormTemplate.vue'
import { DESIGNER_PREVIEW_PORTFOLIO } from '~/data/designer-preview'
import { DEFAULT_TEMPLATE_PRESET_ID, TEMPLATE_PRESETS } from '~/data/template-presets'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

type TemplateMode = 'light' | 'dark'
type PreviewDevice = 'desktop' | 'mobile'

const route = useRoute()

function isTemplatePresetId(value: string): value is PortfolioTemplatePresetId {
  return value in TEMPLATE_PRESETS
}

const activePresetId = computed<PortfolioTemplatePresetId>(() => {
  const candidate = String(route.query.preset ?? '').trim()

  return isTemplatePresetId(candidate)
    ? candidate
    : DEFAULT_TEMPLATE_PRESET_ID
})

const templateMode = computed<TemplateMode>(() => {
  return String(route.query.mode ?? '').trim() === 'dark' ? 'dark' : 'light'
})

const device = computed<PreviewDevice>(() => {
  return String(route.query.device ?? '').trim() === 'mobile' ? 'mobile' : 'desktop'
})

const activeThemeName = computed(() => {
  return TEMPLATE_PRESETS[activePresetId.value].name
})

const previewPortfolio = computed(() => {
  return {
    ...DESIGNER_PREVIEW_PORTFOLIO,
    settings: {
      ...DESIGNER_PREVIEW_PORTFOLIO.settings,
      templateId: 'still-form'
    }
  }
})

useSeoMeta({
  title: 'Designer Preview Still Form',
  description: 'Preview isolado do template editorial Still Form'
})
</script>

<template>
  <div
    class="designer-preview"
    :class="`designer-preview--${templateMode}`"
  >
    <div class="designer-preview__shell">
      <header class="designer-preview__surface">
        <div class="designer-preview__header">
          <div class="designer-preview__copy">
            <div class="designer-preview__badges">
              <span class="designer-preview__badge designer-preview__badge--primary">
                Editorial silencioso
              </span>

              <span class="designer-preview__badge">
                {{ activeThemeName }}
              </span>
            </div>

            <h1 class="designer-preview__title">
              Still Form
            </h1>

            <p class="designer-preview__description">
              Preview isolado do template editorial do Lumio, com linhas finas, preset local
              e suporte de modo por componente, sem depender do cookie global.
            </p>
          </div>

          <div class="designer-preview__meta">
            <span class="designer-preview__badge">
              Modo: {{ templateMode }}
            </span>

            <span class="designer-preview__badge">
              Device: {{ device }}
            </span>
          </div>
        </div>
      </header>

      <div
        class="designer-preview__frame"
        :class="device === 'mobile' ? 'designer-preview__frame--mobile' : 'designer-preview__frame--desktop'"
      >
        <StillFormTemplate
          :portfolio="previewPortfolio"
          :theme-name="activeThemeName"
          :template-preset-id="activePresetId"
          :template-mode="templateMode"
        />
      </div>

      <footer class="designer-preview__surface designer-preview__surface--footer">
        <p class="designer-preview__footer-title">
          Testes úteis
        </p>

        <div class="designer-preview__codes">
          <code class="designer-preview__code">/designer-preview-still-form</code>
          <code class="designer-preview__code">/designer-preview-still-form?preset=rose-wine</code>
          <code class="designer-preview__code">/designer-preview-still-form?preset=pastel-pop&amp;device=mobile</code>
          <code class="designer-preview__code">/designer-preview-still-form?preset=ux-elite&amp;mode=dark</code>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.designer-preview {
  min-height: 100vh;
  padding: 1.25rem 1rem;
}

.designer-preview--dark {
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.12), transparent 30%),
    #020817;
  color: #f8fafc;
}

.designer-preview--light {
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.07), transparent 30%),
    #f4f7fb;
  color: #0f172a;
}

.designer-preview__shell {
  display: grid;
  gap: 1rem;
  max-width: 88rem;
  margin: 0 auto;
}

.designer-preview__surface {
  border-radius: 1.5rem;
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  backdrop-filter: blur(18px);
}

.designer-preview--dark .designer-preview__surface {
  background: rgba(15, 23, 42, 0.62);
}

.designer-preview--light .designer-preview__surface {
  background: rgba(255, 255, 255, 0.88);
}

.designer-preview__header {
  display: grid;
  gap: 1rem;
}

.designer-preview__copy {
  min-width: 0;
}

.designer-preview__badges,
.designer-preview__meta,
.designer-preview__codes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.designer-preview__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.62rem 0.88rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.8rem;
  font-weight: 600;
}

.designer-preview__badge--primary {
  background: rgba(34, 197, 94, 0.16);
}

.designer-preview__title {
  margin: 0.85rem 0 0;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.designer-preview__description,
.designer-preview__footer-title {
  margin: 0.75rem 0 0;
  line-height: 1.75;
}

.designer-preview__frame {
  width: 100%;
  margin: 0 auto;
}

.designer-preview__frame--mobile {
  max-width: 28rem;
}

.designer-preview__frame--desktop {
  max-width: 72rem;
}

.designer-preview__surface--footer {
  display: grid;
  gap: 0.85rem;
}

.designer-preview__code {
  padding: 0.62rem 0.78rem;
  border-radius: 0.85rem;
  white-space: nowrap;
}

.designer-preview--dark .designer-preview__code {
  background: rgba(255, 255, 255, 0.08);
}

.designer-preview--light .designer-preview__code {
  background: rgba(15, 23, 42, 0.05);
}

@media (min-width: 64rem) {
  .designer-preview__header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
}
</style>