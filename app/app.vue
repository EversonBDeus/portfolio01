<script setup lang="ts">
const siteName = 'Lumio'
const siteDescription = 'Crie, edite e publique seu portfólio profissional com a Lumio.'

useHead({
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png?v=2' },
    { rel: 'shortcut icon', href: '/favicon.png?v=2' },
    { rel: 'apple-touch-icon', href: '/favicon.png?v=2' }
  ]
})

useSeoMeta({
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} · ${siteName}` : siteName),
  description: siteDescription,
  applicationName: siteName,
  appleMobileWebAppTitle: siteName,
  ogSiteName: siteName,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogType: 'website',
  ogImage: '/og.png',
  twitterCard: 'summary_large_image',
  twitterTitle: siteName,
  twitterDescription: siteDescription,
  twitterImage: '/og.png'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>