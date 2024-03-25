import { AuthToken } from '@/components/auth-token'
import { PageWrapper } from '@/components/page-wrapper'
import { usersQueries } from '@/queries/users'

const SecurityPage = async () => {
  const user = await usersQueries.myCurrentTeam()

  return (
    <PageWrapper>
      <AuthToken authToken={user.current_team.auth_token} />
    </PageWrapper>
  )
}

export default SecurityPage
