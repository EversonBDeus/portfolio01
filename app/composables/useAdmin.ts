import { computed } from 'vue'

type AuthMeResponse = {
  isAdmin?: boolean
}

export function useAdmin() {
  const isAdminState = useState<boolean>('admin:is-admin', () => false)
  const isLoadingState = useState<boolean>('admin:is-loading', () => false)
  const hasResolvedState = useState<boolean>('admin:has-resolved', () => false)

  async function refreshAdminState() {
    isLoadingState.value = true

    try {
      const response = await $fetch<AuthMeResponse>('/api/auth/me')
      isAdminState.value = Boolean(response?.isAdmin)
    }
    catch {
      isAdminState.value = false
    }
    finally {
      isLoadingState.value = false
      hasResolvedState.value = true
    }
  }

  return {
    isAdmin: computed(() => isAdminState.value),
    isLoadingAdmin: computed(() => isLoadingState.value),
    hasResolvedAdmin: computed(() => hasResolvedState.value),
    refreshAdminState
  }
}
