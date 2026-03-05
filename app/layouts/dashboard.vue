<script setup lang="ts">
import DashboardNav from '~/components/dashboard/DashboardNav.vue'
import DashboardUserMenu from '~/components/dashboard/DashboardUserMenu.vue'
</script>

<template>
  <UDashboardGroup>
    <!-- Sidebar -->
    <UDashboardSidebar class="bg-default border-r border-default">
      <template #header>
        <div class="flex items-center justify-between gap-2 px-2 py-2">
          <div class="flex items-center gap-2 min-w-0">
            <UIcon name="i-lucide-sparkles" class="size-5 text-primary shrink-0" />
            <span class="font-semibold truncate">FolioForge</span>
          </div>
          <!-- ✅ removido: evita “segundo botão” -->
        </div>
      </template>

      <DashboardNav />

      <template #footer>
        <DashboardUserMenu />
      </template>
    </UDashboardSidebar>

    <!-- Painel -->
    <UDashboardPanel>
      <UDashboardNavbar class="px-4 md:px-6">
        <template #left>
          <div class="flex items-center gap-2">
            <!-- ✅ UM único toggle (mobile) -->
            <UDashboardSidebarToggle class="lg:hidden" />
            <span class="text-sm font-medium text-toned">Dashboard</span>
          </div>
        </template>

        <template #right>
          <!-- ✅ usuário não muda “tema de cores” aqui -->
          <UColorModeButton />
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent>
        <!-- ✅ aumenta até perto das linhas vermelhas -->
        <div class="px-6 py-6">
          <div class="w-full max-w-7xl mx-auto">
            <slot />
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardGroup>
</template>