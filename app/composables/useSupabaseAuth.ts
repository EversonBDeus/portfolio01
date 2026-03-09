import { computed } from 'vue'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { useSupabaseBrowserClient } from '~/utils/supabase/client'

export type SupabaseAuthSnapshot = {
  userId: string | null
  email: string
  username: string
  verified: boolean
  isAuthenticated: boolean
}

export function useSupabaseAuth() {
  //  =========== Estado da Sessão ================
  //  ----------- User e Session --------------

  const user = useState<User | null>('supabase-auth-user', () => null)
  const session = useState<Session | null>('supabase-auth-session', () => null)
  const initialized = useState<boolean>('supabase-auth-initialized', () => false)
  const listenerStarted = useState<boolean>('supabase-auth-listener-started', () => false)
  const loading = useState<boolean>('supabase-auth-loading', () => false)
  const lastError = useState<string | null>('supabase-auth-last-error', () => null)

  const supabase = import.meta.client ? useSupabaseBrowserClient() : null

  const isAuthenticated = computed(() => Boolean(session.value?.user))

  const snapshot = computed<SupabaseAuthSnapshot>(() => {
    return {
      userId: user.value?.id ?? null,
      email: user.value?.email ?? '',
      username:
        typeof user.value?.user_metadata?.username === 'string'
          ? user.value.user_metadata.username
          : '',
      verified: Boolean(user.value?.email_confirmed_at),
      isAuthenticated: isAuthenticated.value
    }
  })

  function normalizeErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message
    }

    return 'Não foi possível concluir a operação de autenticação.'
  }

  function applySession(nextSession: Session | null) {
    session.value = nextSession
    user.value = nextSession?.user ?? null
  }

  async function initialize() {
    if (!import.meta.client || !supabase) {
      return
    }

    if (!listenerStarted.value) {
      listenerStarted.value = true

 supabase.auth.onAuthStateChange((
  _event: AuthChangeEvent,
  nextSession: Session | null
) => {
  applySession(nextSession)
})
    }

    if (initialized.value) {
      return
    }

    loading.value = true
    lastError.value = null

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      applySession(data.session)
    } catch (error) {
      applySession(null)
      lastError.value = normalizeErrorMessage(error)
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function refreshSession() {
    if (!import.meta.client || !supabase) {
      return null
    }

    loading.value = true
    lastError.value = null

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      applySession(data.session)

      return data.session
    } catch (error) {
      lastError.value = normalizeErrorMessage(error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function signInWithPassword(payload: {
    email: string
    password: string
  }) {
    if (!import.meta.client || !supabase) {
      return {
        data: null,
        error: 'Login disponível apenas no client.'
      }
    }

    loading.value = true
    lastError.value = null

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email.trim().toLowerCase(),
        password: payload.password
      })

      if (error) {
        throw error
      }

      applySession(data.session)

      return {
        data,
        error: null
      }
    } catch (error) {
      const message = normalizeErrorMessage(error)

      lastError.value = message

      return {
        data: null,
        error: message
      }
    } finally {
      loading.value = false
    }
  }

  async function signUpWithPassword(payload: {
    email: string
    password: string
    username: string
  }) {
    if (!import.meta.client || !supabase) {
      return {
        data: null,
        error: 'Cadastro disponível apenas no client.'
      }
    }

    loading.value = true
    lastError.value = null

    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        options: {
          data: {
            username: payload.username.trim()
          }
        }
      })

      if (error) {
        throw error
      }

      applySession(data.session)

      return {
        data,
        error: null
      }
    } catch (error) {
      const message = normalizeErrorMessage(error)

      lastError.value = message

      return {
        data: null,
        error: message
      }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    if (!import.meta.client || !supabase) {
      return {
        error: 'Logout disponível apenas no client.'
      }
    }

    loading.value = true
    lastError.value = null

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      applySession(null)

      return {
        error: null
      }
    } catch (error) {
      const message = normalizeErrorMessage(error)

      lastError.value = message

      return {
        error: message
      }
    } finally {
      loading.value = false
    }
  }

  return {
    initialized,
    initialize,
    isAuthenticated,
    lastError,
    loading,
    refreshSession,
    session,
    signInWithPassword,
    signOut,
    signUpWithPassword,
    snapshot,
    user
  }
}