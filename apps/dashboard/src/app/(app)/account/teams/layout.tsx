import { PageWrapper } from '@/components/page-wrapper'
import { HydrateClient, trpc } from '@/trpc/server'

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  trpc.teams.findMany.prefetch()

  return (
    <HydrateClient>
      <PageWrapper>{children}</PageWrapper>
    </HydrateClient>
  )
}

export default TeamsLayout
