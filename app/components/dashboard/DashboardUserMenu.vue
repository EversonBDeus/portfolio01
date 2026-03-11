<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'

const toast = useToast()
const { session, clearAuthState } = useAuthState()

const isSigningOut = ref(false)

const displayName = computed(() => {
  const username = session.value?.username?.trim() ?? ''

  if (username) {
    return username
  }

  const email = session.value?.email?.trim() ?? ''

  if (email) {
    return email.split('@')[0] || email
  }

  return 'Usuário'
})

const displayEmail = computed(() => {
  return session.value?.email?.trim() ?? 'Sessão autenticada'
})

async function handleSignOut() {
  if (isSigningOut.value) {
    return
  }

  isSigningOut.value = true

  try {
    clearAuthState()

    toast.add({
      title: 'Sessão encerrada',
      description: 'Você saiu da conta com sucesso.',
      color: 'success',
      icon: 'i-lucide-log-out'
    })

    await navigateTo('/')
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Não foi possível encerrar a sessão.'

    toast.add({
      title: 'Erro ao sair da conta',
      description: message,
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  } finally {
    isSigningOut.value = false
  }
}

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Minha conta',
      icon: 'i-lucide-user',
      to: '/dashboard/perfil'
    },
    {
      label: 'Planos',
      icon: 'i-lucide-badge-dollar-sign',
      to: '/dashboard/plans'
    }
  ],
  [
    {
      label: isSigningOut.value ? 'Saindo...' : 'Sair',
      icon: 'i-lucide-log-out',
      disabled: isSigningOut.value,
      onSelect() {
        void handleSignOut()
      }
    }
  ]
])
</script>

<template>
  <div class="p-2 border-t border-[--ui-border] bg-[--ui-bg]">
    <UDropdownMenu :items="items" :ui="{ content: 'w-52' }">
      <UButton
        variant="ghost"
        color="neutral"
        class="w-full justify-start gap-2.5 px-2 py-2 h-auto"
      >
        <UAvatar
          size="sm"
          :alt="displayName"
          icon="i-lucide-user"
          class="shrink-0 ring-1 ring-[--ui-border]"
        />

        <div class="flex flex-col items-start min-w-0 text-left">
          <span class="text-sm font-medium truncate leading-tight">
            {{ displayName }}
          </span>
          <span class="text-xs text-muted truncate leading-tight">
            {{ displayEmail }}
          </span>
        </div>

        <UIcon
          name="i-lucide-chevrons-up-down"
          class="ml-auto size-4 text-muted shrink-0"
        />
      </UButton>
    </UDropdownMenu>
  </div>
</template>