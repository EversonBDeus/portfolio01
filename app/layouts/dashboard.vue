<script setup lang="ts">
import DashboardSidebarContent from '~/components/dashboard/DashboardSidebarContent.vue'

const route = useRoute()
const mobileSidebarOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    mobileSidebarOpen.value = false
  }
)
</script>

<template>
  <UDashboardGroup class="dashboard-app-shell">
    <UDashboardSidebar class="dashboard-sidebar-shell hidden lg:flex">
      <DashboardSidebarContent />
    </UDashboardSidebar>

    <UDashboardPanel class="min-w-0 bg-transparent">
      <UDashboardNavbar
        class="dashboard-topbar-shell px-4 md:px-6"
        :toggle="false"
      >
        <template #left>
          <div class="flex items-center gap-2">
            <UButton
              class="lg:hidden"
              color="neutral"
              variant="ghost"
              icon="i-lucide-menu"
              aria-label="Abrir menu"
              @click="mobileSidebarOpen = true"
            />
            <span class="text-sm font-medium text-toned">Dashboard</span>
          </div>
        </template>

        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>

      <UDrawer
        v-model:open="mobileSidebarOpen"
        direction="left"
        inset
        :handle="false"
        :ui="{
          content: 'w-72 max-w-[84vw] p-0 rounded-r-2xl border-r border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface-2)] shadow-[var(--dashboard-shadow-sm)]'
        }"
      >
        <template #content>
          <DashboardSidebarContent
            mobile
            @close="mobileSidebarOpen = false"
            @navigate="mobileSidebarOpen = false"
          />
        </template>
      </UDrawer>

      <div class="px-4 py-6 md:px-6">
        <div class="mx-auto w-full max-w-7xl">
          <slot />
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>