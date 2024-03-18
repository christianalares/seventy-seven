import { createClient } from './server'

export const getSessionOrThrow = async () => {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No session found')
  }

  return session
}

export const getSession = async () => {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}
