import { api } from '@/queries'
import { redirect } from 'next/navigation'

const AuthorizedPage = async () => {
  const user = await api.users.queries.findMaybeMe()

  if (user) {
    redirect('/inbox')
  }

  return null
}

export default AuthorizedPage
