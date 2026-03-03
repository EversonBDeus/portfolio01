<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { profile } from '~/data/profile'

const year = new Date().getFullYear()

const items = computed<NavigationMenuItem[]>(() => {
  const socials = profile.socials
    .filter((s) => !!s.url)
    .map((s) => ({
      label: s.label,
      to: s.url,
      target: '_blank'
    }))

  return [{ label: 'Início', to: '/' }, ...socials]
})
</script>

<template>
  <div v-reveal>
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          © {{ year }} {{ profile.name }}
        </p>
      </template>

      <UNavigationMenu v-if="items.length" :items="items" variant="link" />

      <template #right>
        <div class="flex items-center gap-1.5">
          <UButton
            v-for="s in profile.socials.filter((x) => !!x.url)"
            :key="s.label"
            :icon="s.icon"
            color="neutral"
            variant="ghost"
            :to="s.url"
            target="_blank"
            :aria-label="s.label"
            :ui="{ leadingIcon: s.brandClass }"
          />
        </div>
      </template>
    </UFooter>
  </div>
</template>