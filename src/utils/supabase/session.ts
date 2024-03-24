import { createClient } from './server'

export const getSession = async () => {
  const sb = createClient()

  const {
    data: { session },
  } = await sb.auth.getSession()

  return session
}
