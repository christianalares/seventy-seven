'use server'

import { authAction } from '@/lib/safe-action'
import { integrationsQueries } from '@/queries/integrations'
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
    const slackIntegration = await integrationsQueries.getCurrentTeamsSlackIntegration()

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

      return {
        success: true,
      }
    } catch (err) {
      console.error(err)
      throw new Error('Failed to revoke Slack integration')
    }
  },
)
