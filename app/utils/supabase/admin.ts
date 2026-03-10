import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

let adminClient: ReturnType<typeof createClient<Database>> | null = null

export function serverSupabaseAdmin() {
  if (!import.meta.server) {
    throw new Error('Supabase admin disponível apenas no server.')
  }

  if (adminClient) {
    return adminClient
  }

  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw new Error('As credenciais server-side do Supabase não foram configuradas.')
  }

  adminClient = createClient<Database>(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )

  return adminClient
}