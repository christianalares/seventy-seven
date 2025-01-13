import { PageWrapper } from '@/components/page-wrapper'
import { trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

const IntegrationsLayout = ({ children }: { children: React.ReactNode }) => {
  trpc.integrations.getSlackIntegration.prefetch()

  return <PageWrapper>{children}</PageWrapper>
}

export default IntegrationsLayout