<script setup lang="ts">
const items = [
  [
    { label: 'Minha conta',    icon: 'i-lucide-user',     to: '/dashboard/perfil' },
    { label: 'Configurações',  icon: 'i-lucide-settings', to: '/dashboard/config' }
  ],
  [
    { label: 'Sair', icon: 'i-lucide-log-out', click: () => console.log('logout (futuro)') }
  ]
]
</script>

<template>
  <!-- ✅ Fundo explícito → visível no dark mode -->
  <div class="p-2 border-t border-[--ui-border] bg-[--ui-bg]">
    <UDropdownMenu :items="items" :ui="{ content: 'w-52' }">
      <UButton
        variant="ghost"
        color="neutral"
        class="w-full justify-start gap-2.5 px-2 py-2 h-auto"
      >
        <UAvatar
          size="sm"
          alt="Usuário"
          icon="i-lucide-user"
          class=" shrink-0 ring-1 ring-[--ui-border]"
        />
        <div class="flex flex-col items-start min-w-0 text-left">
          <span class="text-sm font-medium truncate leading-tight">Usuário</span>
          <span class="text-xs text-muted truncate leading-tight">usuario@email.com</span>
        </div>
        <UIcon name="i-lucide-chevrons-up-down" class="ml-auto size-4 text-muted shrink-0" />
      </UButton>
    </UDropdownMenu>
  </div>
</template>