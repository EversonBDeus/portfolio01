<script setup lang="ts">
import DashboardNav from '~/components/dashboard/DashboardNav.vue'
import DashboardUserMenu from '~/components/dashboard/DashboardUserMenu.vue'
</script>

<template>
  <UDashboardGroup class="min-h-screen">
    <UDashboardSidebar class="dashboard-sidebar-shell">
      <template #header>
        <div class="flex items-center justify-between gap-2 px-2 py-2">
          <div class="flex min-w-0 items-center gap-2">
            <UIcon name="i-lucide-sparkles" class="size-5 shrink-0 text-primary" />
            <span class="truncate font-semibold">FolioForge</span>
          </div>
        </div>
      </template>

      <DashboardNav />

      <template #footer>
        <DashboardUserMenu />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel class="min-w-0">
      <UDashboardNavbar
        class="dashboard-topbar-shell px-4 md:px-6"
        :toggle="false"
      >
        <template #left>
          <div class="flex items-center gap-2">
            <UDashboardSidebarToggle class="lg:hidden" />
            <span class="text-sm font-medium text-toned">Dashboard</span>
          </div>
        </template>

        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>

      <div class="px-4 py-6 md:px-6">
        <div class="mx-auto w-full max-w-7xl">
          <slot />
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>