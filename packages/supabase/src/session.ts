import { createClient } from './clients/server'

export const getUser = async () => {
  const sb = createClient()

  const {
    data: { user },
  } = await sb.auth.getUser()

  return user
}
