import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '~/types/database.types'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function useSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient
  }

  const config = useRuntimeConfig()

  browserClient = createBrowserClient<Database>(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey
  )

  return browserClient
}