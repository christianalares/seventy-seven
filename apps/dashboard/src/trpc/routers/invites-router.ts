import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace InvitesRouter {
  export type Get = RouterOutputs['invites']['get']
}

export const invitesRouter = createTRPCRouter({
  get: authProcedure
    .input(
      z.object({
        inviteCode: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const invite = await ctx.prisma.teamInvite.findUnique({
        where: {
          code: input.inviteCode,
          email: ctx.user.email,
        },
        select: {
          team_id: true,
          email: true,
          created_by: {
            select: {
              full_name: true,
            },
          },
          team: {
            select: {
              name: true,
              image_url: true,
            },
          },
        },
      })

      if (!invite) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found' })
      }

      return invite
    }),
  accept: authProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        select: {
          id: true,
          email: true,
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      await ctx.prisma.$transaction(async (tx) => {
        // First get the invite
        const invite = await tx.teamInvite
          .findUnique({
            where: {
              email_team_id: {
                email: user.email,
                team_id: input.teamId,
              },
            },
          })
          .catch((error) => {
            console.error(error)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create invite' })
          })

        if (!invite) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No invite found' })
        }

        // Add the user to the team
        const createdMember = await tx.userOnTeam
          .create({
            data: {
              role: 'MEMBER',
              team_id: invite.team_id,
              user_id: ctx.user.id,
            },
          })
          .catch((error) => {
            console.error(error)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not accept invite' })
          })

        if (!createdMember) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not accept invite' })
        }

        // Set the users current team
        await tx.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            current_team_id: invite.team_id,
          },
        })

        // Delete the invite
        await tx.teamInvite
          .delete({
            where: {
              id: invite.id,
            },
          })
          .catch((_err) => {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `Could not delete invite ${invite.id}` })
          })

        return {
          invite,
          createdMember,
        }
      })

      ctx.analyticsClient.event('team_member_invite_accepted', {
        team_id: input.teamId,
        profileId: user.id,
      })

      return { success: true }
    }),
})
