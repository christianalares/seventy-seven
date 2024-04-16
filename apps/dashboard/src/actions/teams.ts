'use server'

import { authAction } from '@/lib/safe-action'
import { usersQueries } from '@/queries/users'
import { sentencifyArray } from '@/utils/sentencifyArray'
import { shortId } from '@/utils/shortId'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import TeamInvite from '@seventy-seven/email/emails/team-invite'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { uuid } from 'uuidv4'
import { z } from 'zod'

export const createTeam = authAction(
  z.object({
    name: z.string().min(1).max(100),
  }),
  async (values, user) => {
    const createdTeam = await prisma.team.create({
      data: {
        name: values.name,
        members: {
          create: {
            user_id: user.id,
            role: 'OWNER',
          },
        },
      },
    })

    revalidatePath('/account/teams')

    return createdTeam
  },
)

export const setCurrentTeam = authAction(
  z.object({
    teamId: z.string().uuid(),
  }),
  async (values, user) => {
    const updatedUser = prisma.user.update({
      where: {
        id: user.id,
        // Make sure the user is a member of the team
        teams: {
          some: {
            team_id: values.teamId,
          },
        },
      },
      data: {
        current_team_id: values.teamId,
      },
      select: {
        current_team: {
          select: {
            name: true,
          },
        },
      },
    })

    revalidatePath('/account/teams')

    return updatedUser
  },
)

export const leaveTeam = authAction(
  z.object({
    teamId: z.string().uuid(),
  }),
  async (values, user) => {
    const dbTeam = await prisma.team.findUnique({
      where: {
        id: values.teamId,
        // Make sure the user is a member of the team
        members: {
          some: {
            user_id: user.id,
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

    if (!dbTeam) {
      throw new Error('That team could not be found')
    }

    if (dbTeam.is_personal) {
      throw new Error('You cannot leave your personal team')
    }

    const isLastOwner = dbTeam.members.filter((team) => team.role === 'OWNER').length === 1

    if (isLastOwner) {
      throw new Error(
        'You are the last owner of this team. Please transfer ownership before leaving or delete the team instead.',
      )
    }

    // Use transaction to make sure the user is removed from the team and their current team is updated
    const { leftTeam } = await prisma.$transaction(async (tx) => {
      // Leave team
      const leftTeam = await tx.userOnTeam.delete({
        where: {
          user_id_team_id: {
            user_id: user.id,
            team_id: dbTeam.id,
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
      const usersPersonalTeam = await prisma.team.findFirst({
        where: {
          is_personal: true,
          members: {
            some: {
              user_id: user.id,
            },
          },
        },
      })

      // This should never happen, it's more to make TS happy
      if (!usersPersonalTeam) {
        throw new Error('Could not find your personal team')
      }

      // Update the users current team
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          current_team_id: usersPersonalTeam.id,
        },
      })

      return { leftTeam, updatedUser }
    })

    revalidatePath('/account/teams')

    return leftTeam
  },
)

export const updateTeamName = authAction(
  z.object({
    teamId: z.string().uuid(),
    name: z.string().min(1).max(100),
  }),
  async (values, user) => {
    const updatedTeam = prisma.team.update({
      where: {
        id: values.teamId,
        // Make sure the user is an owner of the team
        members: {
          some: {
            user_id: user.id,
            role: 'OWNER',
          },
        },
      },
      data: {
        name: values.name,
      },
    })

    if (!updatedTeam) {
      throw new Error('Could not update team name')
    }

    return updatedTeam
  },
)

export const generateAuthToken = authAction(z.undefined().optional(), async (_values, user) => {
  const usresCurrentTeam = await usersQueries.myCurrentTeam()

  const randomToken = Buffer.from(`${uuid()}_${uuid()}`).toString('base64')

  await prisma.team
    .update({
      where: {
        id: usresCurrentTeam.current_team.id,
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
      throw new Error('Could not generate auth token')
    })

  revalidatePath('/settings/security')

  return {
    isNew: !usresCurrentTeam.current_team.auth_token,
  }
})

export const inviteTeamMembers = authAction(
  z.object({
    emails: z.array(z.string().email()),
    teamId: z.string().uuid(),
  }),
  async (input, user) => {
    // Try to get the team which some of the emails are already in
    const teamWithEmails = await prisma.team.findUnique({
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

    // Some of the users are already in the team
    if (teamWithEmails) {
      const emailsInTeam = teamWithEmails.members.map((member) => member.user.email)
      const duplicateEmails = input.emails.filter((email) => emailsInTeam.includes(email))

      throw new Error(`The following emails are already in the team: ${sentencifyArray(duplicateEmails)}`)
    }

    // Make sure the user is an owner of the team
    const usersTeam = await prisma.team.findUnique({
      where: {
        id: input.teamId,
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
      input.emails.map((email) =>
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

    const dbUser = await usersQueries.findMe()

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
          user: {
            email: invite.email,
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

    return createdInvites.length
  },
)
