  export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',

    // Type-check só no build (evita travar o dev no Windows/OneDrive)
    typescript: {
      typeCheck: 'build',
      strict: true
    },

    devtools: {
      enabled: true,
      componentInspector: false,
      vueDevTools: true,
      viteInspect: true,
      telemetry: false,
      vscode: { enabled: false, startOnBoot: false },
      timeline: {
        enabled: true,
        functions: { includeFrom: ['#app', '@unhead/vue'] }
      },
      assets: {
        uploadExtensions: ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'glb', 'gltf']
      }
    },

    modules: [
      '@nuxt/fonts',
      '@nuxt/ui',
      '@pinia/nuxt',
      '@vueuse/nuxt',
      '@nuxt/image',
      '@nuxt/icon',
      '@nuxt/scripts',
      'nuxt-security',
      '@nuxtjs/seo',
      '@nuxt/eslint'
    ],

    runtimeConfig: {
      supabaseServiceRoleKey:
        process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        '',

      public: {
        supabaseUrl:
          process.env.NUXT_PUBLIC_SUPABASE_URL ||
          process.env.SUPABASE_URL ||
          '',

        supabasePublishableKey:
          process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          ''
      }
    },

    css: ['~/assets/css/main.css'],

    ui: {
      theme: {
        colors: [
          'primary',
          'secondary',
          'tertiary',
          'success',
          'info',
          'warning',
          'error',
          'neutral'
        ]
      }
    },

  site: {
    url: process.env.NUXT_SITE_URL || 'https://example.com',
    name: 'Portfolio'
  }
})