import { AddSlackIntegrationButton } from '@/components/add-slack-integration-button'
import { PageWrapper } from '@/components/page-wrapper'
import { RevokeSlackIntegrationButton } from '@/components/revoke-slack-integration-button'
import { api } from '@/queries'
import { getInstallUrl } from '@seventy-seven/integrations/slack'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'

const IntegrationsPage = async () => {
  const user = await api.users.queries.myCurrentTeam()

  const slackIntegration = await api.integrations.queries.getCurrentTeamsSlackIntegration()

  if (slackIntegration) {
    return (
      <PageWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="slack" />
              Slack
            </CardTitle>
            <CardDescription>
              Slack notifications can be used to keep you and your team updated on relevant activities in Seventy Seven.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              Seventy Seven is connected to the channel{' '}
              <span className="text-primary">{slackIntegration.slack_channel}</span> in{' '}
              <span className="text-primary">{slackIntegration.slack_team_name}</span>
            </p>
          </CardContent>

          <CardFooter className="justify-between">
            <>
              <p>Revoke slack integration</p>
              <RevokeSlackIntegrationButton />
            </>
          </CardFooter>
        </Card>
      </PageWrapper>
    )
  }

  const slackInstallUrl = await getInstallUrl({
    teamId: user.current_team.id,
    userId: user.id,
  })

  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="slack" />
            Slack
          </CardTitle>
          <CardDescription>
            Slack notifications can be used to keep you and your team updated on relevant activities in Seventy Seven.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AddSlackIntegrationButton url={slackInstallUrl} />
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
export default IntegrationsPage
