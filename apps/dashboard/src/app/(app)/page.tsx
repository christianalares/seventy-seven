import { trpc } from '@/trpc/server'
import { redirect } from 'next/navigation'

const AuthorizedPage = async () => {
  const user = await trpc.users.maybeMe()

  if (user) {
    redirect('/inbox')
  }

  return null
}

export default AuthorizedPage
