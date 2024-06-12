import { NotificationsEmailSwitches } from '@/components/notifications-email-switches'
import { PageWrapper } from '@/components/page-wrapper'
import { usersQueries } from '@/queries/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@seventy-seven/ui/card'

const NotificationsPage = async () => {
  const user = await usersQueries.findMe()

  return (
    <PageWrapper className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Get an email notification when some of these events occur</CardDescription>
        </CardHeader>

        <CardContent>
          <NotificationsEmailSwitches user={user} />
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

export default NotificationsPage
