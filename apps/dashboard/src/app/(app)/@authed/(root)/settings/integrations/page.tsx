import { PageWrapper } from '@/components/page-wrapper'
import { usersQueries } from '@/queries/users'

const IntegrationsPage = async () => {
  const user = await usersQueries.myCurrentTeam()

  return (
    <PageWrapper>
      <p>Integrations</p>
    </PageWrapper>
  )
}

export default IntegrationsPage
