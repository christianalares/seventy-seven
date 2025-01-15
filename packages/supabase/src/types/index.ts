import type { Database } from './db'
import {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'

export namespace Supabase {
  export type Table = keyof Database['public']['Tables']
  export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  export type TableRow<T extends Table> = Database['public']['Tables'][T]['Row']

  export type RealtimePayload<
    TRow extends { [key: string]: any },
    TEvent extends Supabase.RealtimeEvent,
  > = TEvent extends 'INSERT'
    ? RealtimePostgresInsertPayload<TRow>
    : TEvent extends 'UPDATE'
      ? RealtimePostgresUpdatePayload<TRow>
      : TEvent extends 'DELETE'
        ? RealtimePostgresDeletePayload<TRow>
        : RealtimePostgresChangesPayload<TRow>
}
