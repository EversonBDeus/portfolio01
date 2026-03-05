// app/plugins/reveal.server.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Diretiva no-op no SSR (evita crash getSSRProps)
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    }
  })
})