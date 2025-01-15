import { createClient } from '@seventy-seven/supabase/clients/client'
import type { Supabase } from '@seventy-seven/supabase/types'
import { useEffect } from 'react'

const supabase = createClient()

type Options = {
  event: Supabase.RealtimeEvent
  table: Supabase.Table
}

const defaultOptions = {
  event: '*' as const,
}

export const useRealtimeQuery = <T extends Options>(
  options: T,
  cb: (payload: Supabase.RealtimePayload<Supabase.TableRow<T['table']>, T['event']>) => void,
) => {
  const opts = { ...defaultOptions, ...options }

  useEffect(() => {
    const channel = supabase
      .channel('realtime_messages')
      .on(
        'postgres_changes',
        {
          event: opts.event,
          schema: 'public',
          table: opts.table,
        },
        (payload) => {
          cb(payload as any) // Type assertion needed due to Supabase client limitations
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [cb, opts.event, opts.table])
}
