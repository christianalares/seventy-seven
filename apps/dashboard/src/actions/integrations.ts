'use server'

import { authAction } from '@/lib/safe-action'
import { usersQueries } from '@/queries/users'
import { createSlackApp } from '@seventy-seven/integrations/slack'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const revokeSlackIntegration = authAction(
  z.union([
    z.null(),
    z
      .object({
        revalidatePath: z.string().optional(),
      })
      .optional(),
  ]),
  async (values) => {
    const currentTeam = await usersQueries.myCurrentTeam()

    if (!currentTeam.current_team.integration_slack) {
      throw new Error('No Slack integration to revoke')
    }

    try {
      const slackApp = createSlackApp({
        token: currentTeam.current_team.integration_slack.slack_access_token,
        botId: currentTeam.current_team.integration_slack.slack_bot_user_id,
      })

      await Promise.all([
        slackApp.client.auth.revoke({
          test: true,
        }),
        prisma.integrationSlack.delete({
          where: {
            id: currentTeam.current_team.integration_slack.id,
          },
          select: {
            slack_team_name: true,
          },
        }),
      ])

      if (values?.revalidatePath) {
        revalidatePath(values.revalidatePath)
      }

      return {
        success: true,
      }
    } catch (err) {
      console.error(err)
      throw new Error('Failed to revoke Slack integration')
    }
  },
)
