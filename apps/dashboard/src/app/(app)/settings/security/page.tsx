import { AuthToken } from '@/components/auth-token'
import { HydrateClient, trpc } from '@/trpc/server'

const SecurityPage = () => {
  trpc.users.myCurrentTeam.prefetch()

  return (
    <HydrateClient>
      <AuthToken />
    </HydrateClient>
  )
}

export default SecurityPage
