import { AuthToken } from '@/components/auth-token'
import { trpc } from '@/trpc/server'

const SecurityPage = () => {
  trpc.users.myCurrentTeam.prefetch()

  return <AuthToken />
}

export default SecurityPage
