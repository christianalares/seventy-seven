import { AuthToken } from '@/components/auth-token'
import { PageWrapper } from '@/components/page-wrapper'
import { api } from '@/queries'

const SecurityPage = async () => {
  const user = await api.users.queries.myCurrentTeam()

  return (
    <PageWrapper>
      <AuthToken authToken={user.current_team.auth_token} />
    </PageWrapper>
  )
}

export default SecurityPage
