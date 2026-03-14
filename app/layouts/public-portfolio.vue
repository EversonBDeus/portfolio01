<script setup lang="ts">
import AppFooter from '~/components/layout/AppFooter.vue'
</script>

<template>
  <div class="lumio-public-layout">
    <div class="lumio-public-layout__backdrop" aria-hidden="true" />

    <div class="lumio-public-layout__shell">
      <main class="lumio-public-layout__main">
        <slot />
      </main>

      <footer class="lumio-public-layout__footer">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.lumio-public-layout {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.1), transparent 30%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.12), transparent 26%),
    radial-gradient(circle at bottom center, rgba(34, 211, 238, 0.06), transparent 30%),
    linear-gradient(180deg, #04111f 0%, #061325 52%, #081426 100%);
}

.lumio-public-layout__backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 24%);
}

.lumio-public-layout__shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto;
}

.lumio-public-layout__main,
.lumio-public-layout__footer {
  width: min(100%, 96rem);
  margin: 0 auto;
}

.lumio-public-layout__main {
  padding: 1rem 0.9rem 0.75rem;
}

.lumio-public-layout__footer {
  padding: 0 0.9rem 1.25rem;
}

@media (max-width: 767px) {
  .lumio-public-layout__main {
    padding: 0.72rem 0.65rem 0.6rem;
  }

  .lumio-public-layout__footer {
    padding: 0 0.65rem 0.95rem;
  }
}
</style>