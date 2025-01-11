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
})
