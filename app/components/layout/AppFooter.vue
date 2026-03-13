<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const year = new Date().getFullYear()

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Início', to: '/' },
  { label: 'Entrar', to: '/auth/login' },
  { label: 'Criar conta', to: '/auth/register' }
])
</script>

<template>
  <div v-reveal>
    <UFooter>
      <template #left>
        <div class="flex items-center gap-3">
          <img
            src="/brand/lumio-logo.png"
            alt="Lumio"
            class="h-7 w-auto"
          >

          <p class="text-muted text-sm">
            © {{ year }} Lumio
          </p>
        </div>
      </template>

      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <p class="text-muted text-xs sm:text-sm">
          Publique seu portfólio com identidade profissional.
        </p>
      </template>
    </UFooter>
  </div>
</template>