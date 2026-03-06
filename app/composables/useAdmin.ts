    export function useAdmin() {
  /**
   * ✅ Agora: admin local por env (sem Supabase ainda).
   * Depois: vira "role" no banco (RLS).
   *
   * Como usar:
   * - No Windows PowerShell: $env:NUXT_ADMIN_EMAIL="seu@email.com"
   * - Ou no .env: NUXT_ADMIN_EMAIL=seu@email.com
   */
  const adminEmail = useRuntimeConfig().public.adminEmail as string | undefined

  // mock de usuário até o Supabase entrar:
  // no futuro vamos ler o email da sessão.
  const currentEmail = ref<string | undefined>(undefined)

  const isAdmin = computed(() => {
    if (!adminEmail) return false
    if (!currentEmail.value) return false
    return currentEmail.value.toLowerCase() === adminEmail.toLowerCase()
  })

  // helper pra testar sem auth (você seta o email manualmente)
  function setCurrentEmailForDev(email: string) {
    currentEmail.value = email
  }

  return {
    isAdmin,
    setCurrentEmailForDev
  }
}