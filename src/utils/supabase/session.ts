import { createClient } from './server'

export const getSessionOrThrow = async () => {
  const sb = createClient()

  const {
    data: { session },
  } = await sb.auth.getSession()

  if (!session) {
    throw new Error('No session found')
  }

  return session
}

export const getSession = async () => {
  const sb = createClient()

  const {
    data: { session },
  } = await sb.auth.getSession()

  return session
}

export const getUser = async () => {
  const sb = createClient()
  const session = await getSessionOrThrow()

  const { data } = await sb.from('users').select('*').eq('id', session.user.id).single()
  return data
}
