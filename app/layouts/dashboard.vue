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

    <UDashboardPanel
      id="dashboard-main"
      class="min-w-0 min-h-0 bg-transparent"
      :ui="{
        root: 'min-w-0 min-h-0 bg-transparent',
        body: 'min-h-0 overflow-y-auto px-4 py-6 md:px-6'
      }"
    >
      <template #header>
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
      </template>

      <template #body>
        <div class="mx-auto w-full max-w-7xl">
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>