import { usersQueries } from '@/queries/users'
import { redirect } from 'next/navigation'

const AuthorizedPage = async () => {
  const user = await usersQueries.findMaybeMe()

  if (user) {
    redirect('/inbox/all')
  }

  return null
}

export default AuthorizedPage
