<script setup lang="ts">
const colorMode = useColorMode()

const mounted = ref(false)
onMounted(() => (mounted.value = true))

const icon = computed(() => {
  if (!mounted.value) return 'i-lucide-moon'
  return colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
})
</script>

<template>
  <UHeader
    class="fixed top-0 left-0 right-0 z-50 backdrop-blur border-0"
    :ui="{
      root: 'bg-transparent border-0 shadow-none',
      container: 'flex items-center justify-between h-16 px-4'
    }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-3">
        <img
          src="/brand/lumio-logo.png"
          alt="Lumio"
          class="h-8 w-auto sm:h-9"
        >
      </NuxtLink>
    </template>

    <template #right>
      <UButton
        :icon="icon"
        variant="ghost"
        size="lg"
        aria-label="Alternar modo"
        @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
      />
    </template>
  </UHeader>
</template>