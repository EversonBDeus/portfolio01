import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie, type H3Event } from 'h3'
import type { Database } from '~/types/database.types'

export function serverSupabaseClient(event: H3Event) {
  const config = useRuntimeConfig(event)

  return createServerClient<Database>(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          const cookies = parseCookies(event)

          return Object.entries(cookies).map(([name, value]) => ({
            name,
            value
          }))
        },

        setAll(cookies) {
          for (const cookie of cookies) {
            setCookie(event, cookie.name, cookie.value, {
              domain: cookie.options?.domain,
              expires: cookie.options?.expires,
              httpOnly: cookie.options?.httpOnly,
              maxAge: cookie.options?.maxAge,
              path: cookie.options?.path ?? '/',
              sameSite: cookie.options?.sameSite,
              secure: cookie.options?.secure
            })
          }
        }
      }
    }
  )
}