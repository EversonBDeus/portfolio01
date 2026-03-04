import type { Directive } from 'vue'

type RevealOptions = {
  delay?: number
  duration?: number
  distance?: string
  origin?: 'top' | 'right' | 'bottom' | 'left'
  opacity?: number
  easing?: string
  interval?: number
  root?: Element | null
}

export default defineNuxtPlugin((nuxtApp) => {
  const reveal: Directive<HTMLElement, RevealOptions | undefined> = {
    // ✅ SSR-safe: evita o crash "getSSRProps"
    getSSRProps() {
      return {}
    },

    // ✅ Só roda no client
    async mounted(el, binding) {
      if (import.meta.server) return

      const v = binding.value || {}

      // Se ScrollReveal não existir (ou não estiver instalado), não quebra.
      try {
        const mod = await import('scrollreveal')
        const ScrollReveal = mod.default

        const sr = ScrollReveal()

        const options: Record<string, any> = {
          distance: v.distance ?? '12px',
          duration: v.duration ?? 500,
          easing: v.easing ?? 'cubic-bezier(0.2, 0, 0, 1)',
          origin: v.origin ?? 'bottom',
          opacity: v.opacity ?? 0,
          delay: v.delay ?? 0,
          interval: v.interval ?? 0
        }

        // Para scroll interno (UScrollArea), usamos container do ScrollReveal
        if (v.root) {
          options.container = v.root
        }

        sr.reveal(el, options)
      } catch {
        // no-op (sem crash)
      }
    }
  }

  nuxtApp.vueApp.directive('reveal', reveal)
})