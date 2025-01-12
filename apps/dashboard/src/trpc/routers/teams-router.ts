import { sentencifyArray } from '@/utils/sentencifyArray'
import { shortId } from '@/utils/shortId'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import TeamInvite from '@seventy-seven/email/emails/team-invite'
import { TRPCError } from '@trpc/server'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace TeamsRouter {
  export type FindMany = RouterOutputs['teams']['findMany']
}

export const teamsRouter = createTRPCRouter({
  findMany: authProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        current_team_id: true,
      },
    })

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const userTeams = await ctx.prisma.userOnTeam.findMany({
      where: {
        user_id: ctx.user.id,
      },
      select: {
        role: true,
        team: {
          select: {
            id: true,
            name: true,
            is_personal: true,
          },
        },
      },
      orderBy: {
        team: {
          created_at: 'asc',
        },
      },
    })

    return userTeams.map((team) => ({
      ...team,
      isCurrent: team.team.id === user.current_team_id,
    }))
  }),
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

      ctx.analyticsClient.event('team_created', {
        team_id: createdTeam.id,
        profileId: ctx.user.id,
        team_name: createdTeam.name,
      })

      return createdTeam
    }),
  leave: authProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.findUnique({
        where: {
          id: input.teamId,
          // Make sure the user is a member of the team
          members: {
            some: {
              user_id: ctx.user.id,
            },
          },
        },
        select: {
          id: true,
          is_personal: true,
          members: {
            select: {
              role: true,
              user_id: true,
            },
          },
        },
      })

      if (!team) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'That team could not be found' })
      }

      if (team.is_personal) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot leave your personal team' })
      }

      const isLastOwner = team.members.filter((team) => team.role === 'OWNER').length === 1

      // If the user is the last owner and there are other members, they cannot leave the team
      if (isLastOwner && team.members.length > 1) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'You are the last owner of this team. Please transfer ownership before leaving or delete the team instead.',
        })
      }

      // Use transaction to make sure the user is removed from the team and their current team is updated
      const { leftTeam } = await ctx.prisma.$transaction(async (tx) => {
        // Leave team
        const leftTeam = await tx.userOnTeam.delete({
          where: {
            user_id_team_id: {
              user_id: ctx.user.id,
              team_id: team.id,
            },
          },
          select: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })

        // Get the users personal team
        const usersPersonalTeam = await ctx.prisma.team.findFirst({
          where: {
            is_personal: true,
            members: {
              some: {
                user_id: ctx.user.id,
              },
            },
          },
        })

        // This should never happen, it's more to make TS happy
        if (!usersPersonalTeam) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Could not find your personal team' })
        }

        // Update the users current team to their personal team
        const updatedUser = await tx.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            current_team_id: usersPersonalTeam.id,
          },
        })

        // If the team only had one member (which at this stage could only be the user), delete the team
        if (team.members.length === 1) {
          await tx.team.delete({
            where: {
              id: team.id,
            },
          })
        }

        return { leftTeam, updatedUser }
      })

      ctx.analyticsClient.event('team_left', {
        team_id: leftTeam.team.id,
        profileId: ctx.user.id,
      })

      return leftTeam
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
  updateName: authProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedTeam = ctx.prisma.team.update({
        where: {
          id: input.teamId,
          // Make sure the user is an owner of the team
          members: {
            some: {
              user_id: ctx.user.id,
              role: 'OWNER',
            },
          },
        },
        data: {
          name: input.name,
        },
      })

      if (!updatedTeam) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not update team name' })
      }

      ctx.analyticsClient.event('team_name_updated', {
        team_id: input.teamId,
        profileId: ctx.user.id,
      })

      return updatedTeam
    }),
  updateAvatar: authProcedure
    .input(
      z.object({
        avatarUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      })

      if (!user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not update team avatar' })
      }

      const updatedTeam = await ctx.prisma.team.update({
        where: {
          id: user.current_team_id,
        },
        data: {
          image_url: input.avatarUrl,
        },
        select: {
          image_url: true,
        },
      })

      if (!updatedTeam) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not update team avatar' })
      }

      ctx.analyticsClient.event('team_avatar_updated', {
        team_id: user.current_team_id,
        profileId: user.id,
      })

      return updatedTeam
    }),
  invites: authProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
    })

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const invites = await ctx.prisma.teamInvite.findMany({
      where: {
        team_id: user.current_team_id,
      },
      select: {
        code: true,
        id: true,
        email: true,
      },
    })

    return invites
  }),
  invite: authProcedure
    .input(
      z.object({
        emails: z.array(z.string().email()),
        teamId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Try to get the team which some of the emails are already in
      const teamWithEmails = await ctx.prisma.team.findUnique({
        where: {
          id: input.teamId,
          members: {
            some: {
              user: {
                email: {
                  in: input.emails,
                },
              },
            },
          },
        },
        select: {
          members: {
            select: {
              user: {
                select: {
                  email: true,
                  full_name: true,
                },
              },
            },
          },
        },
      })

      // If some of the users are already in the team
      if (teamWithEmails) {
        const emailsInTeam = teamWithEmails.members.map((member) => member.user.email)
        const duplicateEmails = input.emails.filter((email) => emailsInTeam.includes(email))

        if (duplicateEmails.length === 1) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              duplicateEmails.length === 1
                ? `The email ${duplicateEmails[0]} is already in the team`
                : `The following emails are already in the team: ${sentencifyArray(duplicateEmails)}`,
          })
        }
      }

      // Make sure the user is an owner of the team
      const usersTeam = await ctx.prisma.team.findUnique({
        where: {
          id: input.teamId,
          members: {
            some: {
              user_id: ctx.user.id,
              role: 'OWNER',
            },
          },
        },
      })

      if (!usersTeam) {
        throw new Error('You do not have permission to invite members to this team')
      }

      const createdInvites = await ctx.prisma.$transaction(
        input.emails.map((email) =>
          ctx.prisma.teamInvite.create({
            data: {
              email,
              team_id: usersTeam.id,
              created_by_user_id: ctx.user.id,
              code: shortId(),
            },
            select: {
              code: true,
              email: true,
              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }),
        ),
      )

      const resend = createResendClient()

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          full_name: true,
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      Promise.all(
        createdInvites.map((invite) => {
          const template = TeamInvite({
            code: invite.code,
            invitedBy: user.full_name,
            team: {
              id: invite.team.id,
              name: invite.team.name,
            },
          })

          const from = user.full_name === usersTeam.name ? user.full_name : `${user.full_name} from ${usersTeam.name}`

          return resend.emails.send({
            from: `${from} <seventy-seven@seventy-seven.dev>`,
            to: createdInvites.map((invite) => invite.email),
            subject: `${from} has invited you to join ${usersTeam.name} on 77`,
            react: template,
            text: componentToPlainText(template),
          })
        }),
      ).catch((error) => {
        console.error('Could not send invites', error)
      })

      ctx.analyticsClient.event('team_members_invited', {
        team_id: usersTeam.id,
        profileId: ctx.user.id,
        number_of_invites: createdInvites.length,
      })

      return createdInvites.length
    }),
  revokeInvitation: authProcedure
    .input(
      z.object({
        inviteId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const deletedInvite = await ctx.prisma.teamInvite
        .delete({
          where: {
            id: input.inviteId,
            // Make sure the user is owner of the team in order to revoke the invite
            team: {
              members: {
                some: {
                  user_id: ctx.user.id,
                  role: 'OWNER',
                },
              },
            },
          },
          select: {
            team_id: true,
            email: true,
          },
        })
        .catch((_error) => {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not revoke invite',
          })
        })

      ctx.analyticsClient.event('team_member_invite_revoked', {
        team_id: deletedInvite.team_id,
        email: deletedInvite.email,
        profileId: ctx.user.id,
      })

      return deletedInvite
    }),
  generateAuthToken: authProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        current_team: {
          select: {
            id: true,
            auth_token: true,
          },
        },
      },
    })

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const randomToken = Buffer.from(`${uuid()}_${uuid()}`).toString('base64')

    await ctx.prisma.team
      .update({
        where: {
          id: user.current_team.id,
          // Make sure the user is an owner of the team
          members: {
            some: {
              user_id: user.id,
              role: 'OWNER',
            },
          },
        },
        data: {
          auth_token: randomToken,
        },
        select: {
          auth_token: true,
        },
      })
      .catch((_error) => {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not generate auth token' })
      })

    return {
      isNew: !user.current_team.auth_token,
    }
  }),
})
