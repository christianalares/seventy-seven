'use server'

import { analyticsClient } from '@/lib/analytics'
import { authAction } from '@/lib/safe-action'
import { api } from '@/queries'
import { createSlackApp } from '@seventy-seven/integrations/slack'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// TODO: Move to TRPC
export const revokeSlackIntegration = authAction(
  z.union([
    z.null(),
    z
      .object({
        revalidatePath: z.string().optional(),
      })
      .optional(),
  ]),
  async (values, user) => {
    const slackIntegration = await api.integrations.queries.getCurrentTeamsSlackIntegration()

    if (!slackIntegration) {
      throw new Error('No Slack integration to revoke')
    }

    try {
      const slackApp = createSlackApp({
        token: slackIntegration.slack_access_token,
        botId: slackIntegration.slack_bot_user_id,
      })

      await Promise.all([
        slackApp.client.auth.revoke({
          test: true,
        }),
        prisma.integrationSlack.delete({
          where: {
            id: slackIntegration.id,
          },
          select: {
            slack_team_name: true,
          },
        }),
      ])

      if (values?.revalidatePath) {
        revalidatePath(values.revalidatePath)
      }

      analyticsClient.event('slack_integration_revoked', {
        team_id: slackIntegration.team_id,
        profileId: user.id,
      })

      return {
        success: true,
      }
    } catch (err) {
      console.error(err)
      throw new Error('Failed to revoke Slack integration')
    }
  },
)
