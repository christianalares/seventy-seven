import { NotificationsEmailSwitches } from '@/components/notifications-email-switches'
import { PageWrapper } from '@/components/page-wrapper'
import { api } from '@/queries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'
import Link from 'next/link'

const NotificationsPage = async () => {
  const user = await api.users.queries.findMe()

  return (
    <PageWrapper className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="mail" />
            Email
          </CardTitle>
          <CardDescription>Get an email notification when some of these events occur</CardDescription>
        </CardHeader>

        <CardContent>
          <NotificationsEmailSwitches user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="slack" />
            Slack
          </CardTitle>
          {/* <CardDescription>
            Slack notifications is based on your teams integrations. Check team integrations to handle those.
          </CardDescription> */}
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Slack notifications are based on your teams integrations. Check{' '}
            <Link href="/settings/notifications" className="text-blue-500">
              team integrations
            </Link>{' '}
            to handle those.
          </p>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

export default NotificationsPage
