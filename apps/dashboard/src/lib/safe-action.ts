import { getSession } from '@seventy-seven/supabase/session'
import { createSafeActionClient } from 'next-safe-action'

export const authAction = createSafeActionClient({
  middleware: async () => {
    const session = await getSession()

    if (!session) {
      throw new Error('No session found')
    }

    return session.user
  },
  handleReturnedServerError: (e) => {
    return e.message || 'Oh no, something went wrong!'
  },
})

export const action = createSafeActionClient({
  handleReturnedServerError: (e) => {
    return e.message || 'Oh no, something went wrong!'
  },
})
