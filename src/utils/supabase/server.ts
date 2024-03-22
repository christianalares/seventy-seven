import type { Database } from '@/types/db'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies /* , headers */ } from 'next/headers'

type CreateClientOptions = {
  admin?: boolean
}

export const createClient = (options?: CreateClientOptions) => {
  const cookieStore = cookies()

  const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
  }

  const key = options?.admin ? SUPABASE_SERVICE_ROLE_KEY : NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createServerClient<Database>(NEXT_PUBLIC_SUPABASE_URL, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (_error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (_error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    global: {
      // headers: {
      //   // Pass user agent from browser
      //   'user-agent': headers().get('user-agent') as string,
      // },
    },
  })
}
