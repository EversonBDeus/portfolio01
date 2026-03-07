<script setup lang="ts">
import LandingFooter from '~/components/landing/LandingFooter.vue'
import LandingHeader from '~/components/landing/LandingHeader.vue'
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_42%,#ffffff_100%)] dark:bg-[linear-gradient(180deg,#030712_0%,#07152a_45%,#0b1220_100%)]">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_38%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_28%)]" />
      <div class="absolute left-[-8rem] top-[10rem] h-[20rem] w-[20rem] rounded-full bg-primary/10 blur-3xl dark:bg-primary/10" />
      <div class="absolute right-[-10rem] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-sky-300/15 blur-3xl dark:bg-sky-400/10" />
      <div class="absolute bottom-[-8rem] left-1/2 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-emerald-200/15 blur-3xl dark:bg-emerald-400/10" />
    </div>

    <LandingHeader />

    <UMain class="pt-24">
      <slot />
    </UMain>

    <LandingFooter />
  </div>
</template>