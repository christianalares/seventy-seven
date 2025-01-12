import { getInstallUrl } from '@seventy-seven/integrations/slack'
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
})
