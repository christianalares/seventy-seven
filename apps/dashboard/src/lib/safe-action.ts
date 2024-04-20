import { getUser } from '@seventy-seven/supabase/session'
import { createSafeActionClient } from 'next-safe-action'

export const authAction = createSafeActionClient({
  middleware: async () => {
    const user = await getUser()

    if (!user) {
      throw new Error('No session found')
    }

    return user
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
