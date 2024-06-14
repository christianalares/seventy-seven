import { AnalyticsSetProfile } from '@/components/analytics-set-profile'
import { usersQueries } from '@/queries/users'

type Props = {
  authed: React.ReactNode
  unauthed: React.ReactNode
}

const AppLayout = async ({ authed, unauthed }: Props) => {
  const user = await usersQueries.findMaybeMe()

  return user ? (
    <>
      <AnalyticsSetProfile user={user} />
      {authed}
    </>
  ) : (
    unauthed
  )
}

export default AppLayout
