import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'

export const teamsRouter = createTRPCRouter({
  create: authProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const createdTeam = await ctx.prisma.team.create({
        data: {
          name: input.name,
          members: {
            create: {
              user_id: ctx.user.id,
              role: 'OWNER',
            },
          },
        },
      })

      revalidatePath('/account/teams')

      ctx.analyticsClient.event('team_created', {
        team_id: createdTeam.id,
        profileId: ctx.user.id,
        team_name: createdTeam.name,
      })

      return createdTeam
    }),
  switch: authProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
          // Make sure the user is a member of the team
          teams: {
            some: {
              team_id: input.teamId,
            },
          },
        },
        data: {
          current_team_id: input.teamId,
        },
        select: {
          current_team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      ctx.analyticsClient.event('team_switched', {
        team_id: input.teamId,
        profileId: ctx.user.id,
      })

      return updatedUser
    }),
})
