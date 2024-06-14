import { prisma } from '@seventy-seven/orm/prisma'
import { getUser } from '@seventy-seven/supabase/session'

export const getCurrentTeamsSlackIntegration = async () => {
  const me = await getUser()

  if (!me) {
    throw new Error('No session found')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: me.id,
    },
    select: {
      current_team_id: true,
    },
  })

  const slackIntegration = await prisma.integrationSlack.findFirst({
    where: {
      team: {
        id: user?.current_team_id,
      },
    },
    select: {
      id: true,
      slack_channel: true,
      slack_team_name: true,
      slack_access_token: true,
      slack_bot_user_id: true,
      slack_channel_id: true,
      team_id: true,
    },
  })

  return slackIntegration
}

export const integrationsQueries = {
  getCurrentTeamsSlackIntegration,
}
