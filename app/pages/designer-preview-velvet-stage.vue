<script setup lang="ts">
import { computed } from 'vue'
import VelvetStageTemplate from '~/components/templates/VelvetStageTemplate/VelvetStageTemplate.vue'
import { DESIGNER_PREVIEW_PORTFOLIO } from '~/data/designer-preview'
import { DEFAULT_TEMPLATE_PRESET_ID, TEMPLATE_PRESETS } from '~/data/template-presets'
import type { PortfolioTemplatePresetId } from '~/types/template-preset'

type TemplateMode = 'light' | 'dark'
type PreviewDevice = 'desktop' | 'mobile'

definePageMeta({
  layout: 'default'
})

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
  return String(route.query.mode ?? '').trim() === 'light' ? 'light' : 'dark'
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
      templateId: 'velvet-stage'
    }
  }
})

useSeoMeta({
  title: 'Designer Preview Velvet Stage',
  description: 'Preview isolado do template Velvet Stage no Lumio'
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
                Velvet Stage
              </span>

              <span class="designer-preview__badge">
                {{ activeThemeName }}
              </span>
            </div>

            <h1 class="designer-preview__title">
              Preview isolado do template
            </h1>

            <p class="designer-preview__description">
              Hero dominante, palco premium e leitura editorial com preset local.
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

      <section class="designer-preview__frame-shell">
        <div
          class="designer-preview__frame"
          :class="device === 'mobile' ? 'designer-preview__frame--mobile' : 'designer-preview__frame--desktop'"
        >
          <VelvetStageTemplate
            :portfolio="previewPortfolio"
            :theme-name="activeThemeName"
            :template-preset-id="activePresetId"
            :template-mode="templateMode"
          />
        </div>
      </section>

      <footer class="designer-preview__surface designer-preview__surface--footer">
        <p class="designer-preview__footer-title">
          Testes úteis
        </p>

        <div class="designer-preview__codes">
          <code class="designer-preview__code">/designer-preview-velvet-stage</code>
          <code class="designer-preview__code">/designer-preview-velvet-stage?preset=rose-wine</code>
          <code class="designer-preview__code">/designer-preview-velvet-stage?preset=ux-elite</code>
          <code class="designer-preview__code">/designer-preview-velvet-stage?preset=pastel-pop</code>
          <code class="designer-preview__code">/designer-preview-velvet-stage?preset=minty-dark&amp;mode=dark</code>
          <code class="designer-preview__code">/designer-preview-velvet-stage?device=mobile</code>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.designer-preview {
  min-height: 100%;
  padding: 1rem 0.9rem 1.35rem;
}

.designer-preview--dark {
  background:
    radial-gradient(circle at top left, rgba(236, 72, 153, 0.12), transparent 30%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.12), transparent 26%),
    #020817;
  color: #f8fafc;
}

.designer-preview--light {
  background:
    radial-gradient(circle at top left, rgba(236, 72, 153, 0.08), transparent 30%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.08), transparent 26%),
    #f6f2f6;
  color: #20171f;
}

.designer-preview__shell {
  display: grid;
  gap: 1rem;
  max-width: 94rem;
  margin: 0 auto;
}

.designer-preview__surface,
.designer-preview__frame-shell {
  border-radius: 1.6rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  backdrop-filter: blur(18px);
}

.designer-preview--dark .designer-preview__surface,
.designer-preview--dark .designer-preview__frame-shell {
  background: rgba(15, 23, 42, 0.62);
}

.designer-preview--light .designer-preview__surface,
.designer-preview--light .designer-preview__frame-shell {
  background: rgba(255, 255, 255, 0.88);
}

.designer-preview__surface {
  padding: 1rem;
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
  min-height: 2.35rem;
  padding: 0.62rem 0.88rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.8rem;
  font-weight: 600;
}

.designer-preview__badge--primary {
  background: rgba(236, 72, 153, 0.14);
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

.designer-preview__frame-shell {
  padding: 0.75rem;
}

.designer-preview__frame {
  width: 100%;
  margin: 0 auto;
}

.designer-preview__frame--mobile {
  max-width: 24rem;
}

.designer-preview__frame--desktop {
  max-width: 88rem;
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

@media (max-width: 767px) {
  .designer-preview {
    padding: 0.8rem 0.7rem 1rem;
  }

  .designer-preview__shell {
    gap: 0.8rem;
  }

  .designer-preview__surface,
  .designer-preview__frame-shell {
    border-radius: 1.25rem;
  }

  .designer-preview__surface {
    padding: 0.82rem;
  }

  .designer-preview__frame-shell {
    padding: 0.52rem;
  }

  .designer-preview__badge {
    min-height: 2.1rem;
    padding: 0.52rem 0.72rem;
    font-size: 0.74rem;
  }

  .designer-preview__title {
    font-size: clamp(1.4rem, 7.5vw, 1.85rem);
  }

  .designer-preview__description,
  .designer-preview__footer-title {
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .designer-preview__code {
    white-space: normal;
    word-break: break-word;
  }
}

@media (min-width: 64rem) {
  .designer-preview__header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
}
</style>