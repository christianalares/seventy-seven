import { createSafeActionClient } from 'next-safe-action'

export const action = createSafeActionClient({
  handleReturnedServerError: (e) => {
    return e.message || 'Oh no, something went wrong!'
  },
})
