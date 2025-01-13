import { PageWrapper } from '@/components/page-wrapper'
import { HydrateClient, trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

const IntegrationsLayout = ({ children }: { children: React.ReactNode }) => {
  trpc.integrations.getSlackIntegration.prefetch()

  return (
    <HydrateClient>
      <PageWrapper>{children}</PageWrapper>
    </HydrateClient>
  )
}

export default IntegrationsLayout
