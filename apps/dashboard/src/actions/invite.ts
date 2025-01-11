'use server'

import { analyticsClient } from '@/lib/analytics'
import { authAction } from '@/lib/safe-action'
import { api } from '@/queries'
import { sentencifyArray } from '@/utils/sentencifyArray'
import { shortId } from '@/utils/shortId'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import TeamInvite from '@seventy-seven/email/emails/team-invite'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// TODO: Move to TRPC
export const inviteTeamMembers = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    emails: z.array(z.string().email()),
    teamId: z.string().uuid(),
  }),
  async (values, user) => {
    // Try to get the team which some of the emails are already in
    const teamWithEmails = await prisma.team.findUnique({
      where: {
        id: values.teamId,
        members: {
          some: {
            user: {
              email: {
                in: values.emails,
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

    // Some of the users are already in the team
    if (teamWithEmails) {
      const emailsInTeam = teamWithEmails.members.map((member) => member.user.email)
      const duplicateEmails = values.emails.filter((email) => emailsInTeam.includes(email))

      if (duplicateEmails.length === 1) {
        throw new Error(`The email ${duplicateEmails[0]} is already in the team`)
      }

      throw new Error(`The following emails are already in the team: ${sentencifyArray(duplicateEmails)}`)
    }

    // Make sure the user is an owner of the team
    const usersTeam = await prisma.team.findUnique({
      where: {
        id: values.teamId,
        members: {
          some: {
            user_id: user.id,
            role: 'OWNER',
          },
        },
      },
    })

    if (!usersTeam) {
      throw new Error('You do not have permission to invite members to this team')
    }

    const createdInvites = await prisma.$transaction(
      values.emails.map((email) =>
        prisma.teamInvite.create({
          data: {
            email,
            team_id: usersTeam.id,
            created_by_user_id: user.id,
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

    const dbUser = await api.users.queries.findMe()

    const resend = createResendClient()

    Promise.all(
      createdInvites.map((invite) => {
        const template = TeamInvite({
          code: invite.code,
          invitedBy: dbUser.full_name,
          team: {
            id: invite.team.id,
            name: invite.team.name,
          },
        })

        const from =
          dbUser.full_name === usersTeam.name ? dbUser.full_name : `${dbUser.full_name} from ${usersTeam.name}`

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

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('team_members_invited', {
      team_id: usersTeam.id,
      profileId: user.id,
      number_of_invites: createdInvites.length,
    })

    return createdInvites.length
  },
)

// TODO: Move to TRPC
export const acceptInvitation = authAction(
  z.object({
    teamId: z.string().uuid(),
  }),
  async (values) => {
    const dbUser = await api.users.queries.findMe()

    await prisma.$transaction(async (tx) => {
      // First get the invite
      const invite = await tx.teamInvite
        .findUnique({
          where: {
            email_team_id: {
              email: dbUser.email,
              team_id: values.teamId,
            },
          },
        })
        .catch((_err) => {
          throw new Error('No invite found')
        })

      if (!invite) {
        throw new Error('No invite found')
      }

      // Add the user to the team
      const createdMember = await tx.userOnTeam
        .create({
          data: {
            role: 'MEMBER',
            team_id: invite.team_id,
            user_id: dbUser.id,
          },
        })
        .catch((_err) => {
          throw new Error('Could not accept invite')
        })

      if (!createdMember) {
        throw new Error('Could not accept invite')
      }

      // Set the users current team
      await tx.user.update({
        where: {
          id: dbUser.id,
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
          throw new Error(`Could not delete invite ${invite.id}`)
        })

      return {
        invite,
        createdMember,
      }
    })

    revalidatePath('/settings/members')

    analyticsClient.event('team_member_invite_accepted', {
      team_id: values.teamId,
      profileId: dbUser.id,
    })

    return { success: true }
  },
)

// TODO: Move to TRPC
export const revokeInvitation = authAction(
  z.object({
    inviteId: z.string().uuid(),
  }),
  async (values) => {
    const user = await api.users.queries.findMe()

    const deletedInvite = await prisma.teamInvite
      .delete({
        where: {
          id: values.inviteId,
          // Make sure the user is owner of the team in order to revoke the invite
          team: {
            members: {
              some: {
                user_id: user.id,
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
      .catch((_err) => {
        throw new Error('Could not revoke invite')
      })

    revalidatePath('/settings/members/pending')

    analyticsClient.event('team_member_invite_revoked', {
      team_id: deletedInvite.team_id,
      email: deletedInvite.email,
      profileId: user.id,
    })

    return deletedInvite
  },
)
