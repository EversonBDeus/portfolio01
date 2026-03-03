<script setup lang="ts">
// layouts/auth.vue
</script>

<template>
  <div class="app-bg bg-theme min-h-screen flex items-center justify-center p-4">
    <div class="bg-fx bg-anim-07" aria-hidden="true" />
    
    <main class="w-full max-w-md z-10 relative">
      <slot />
    </main>
  </div>
</template>