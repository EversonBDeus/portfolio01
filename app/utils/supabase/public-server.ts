import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import type { Database } from '~/types/database.types'

export function serverSupabasePublicClient(event: H3Event) {
  const config = useRuntimeConfig(event)

  return createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}
