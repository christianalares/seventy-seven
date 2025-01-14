import { PageWrapper } from '@/components/page-wrapper'
import { HydrateClient, trpc } from '@/trpc/server'

const TagsLayout = ({ children }: { children: React.ReactNode }) => {
  trpc.users.myCurrentTeam.prefetch()

  return (
    <HydrateClient>
      <PageWrapper>{children}</PageWrapper>
    </HydrateClient>
  )
}

export default TagsLayout
