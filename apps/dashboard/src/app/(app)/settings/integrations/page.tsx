'use client'

import { AddSlackIntegrationButton } from '@/components/add-slack-integration-button'
import { RevokeSlackIntegrationButton } from '@/components/revoke-slack-integration-button'
import { trpc } from '@/trpc/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'

const IntegrationsPage = () => {
  const [{ slackIntegration, slackInstallUrl }] = trpc.integrations.getSlackIntegration.useSuspenseQuery()

  if (slackIntegration) {
    return (
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
    )
  }

  return (
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
  )
}

export default IntegrationsPage
