import { getInstallUrl } from '@seventy-seven/integrations/slack'
import { createSlackApp } from '@seventy-seven/integrations/slack'
import { TRPCError } from '@trpc/server'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace integrationsRouterRouter {
  export type GetMaybeMe = RouterOutputs['integrations']['getSlackIntegration']
  export type GetMe = RouterOutputs['users']['me']
}

export const integrationsRouter = createTRPCRouter({
  getSlackIntegration: authProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        current_team_id: true,
      },
    })

    const slackIntegration = await ctx.prisma.integrationSlack.findFirst({
      where: {
        team: {
          id: user?.current_team_id,
        },
      },
      select: {
        id: true,
        slack_channel: true,
        slack_team_name: true,
      },
    })

    if (slackIntegration) {
      return { slackIntegration }
    }

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const slackInstallUrl = await getInstallUrl({
      teamId: user.current_team_id,
      userId: ctx.user.id,
    })

    return { slackInstallUrl }
  }),
  revokeSlackIntegration: authProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        current_team_id: true,
      },
    })

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const slackIntegration = await ctx.prisma.integrationSlack.findFirst({
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

    if (!slackIntegration) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Could not find any Slack integration to revoke' })
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
        ctx.prisma.integrationSlack.delete({
          where: {
            id: slackIntegration.id,
          },
          select: {
            slack_team_name: true,
          },
        }),
      ])

      ctx.analyticsClient.event('slack_integration_revoked', {
        team_id: slackIntegration.team_id,
        profileId: ctx.user.id,
      })

      return {
        success: true,
      }
    } catch (err) {
      console.error(err)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to revoke Slack integration' })
    }
  }),
})
