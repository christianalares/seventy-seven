'use server'

import { analyticsClient } from '@/lib/analytics'
import { authAction } from '@/lib/safe-action'
import { api } from '@/queries'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// TODO: Move to TRPC
export const setTags = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    ticketId: z.string().uuid(),
    tags: z.array(
      z.object({
        name: z.string(),
        color: z.string().startsWith('#').max(7),
      }),
    ),
  }),
  async (values) => {
    const dbUser = await api.users.queries.findMe()

    // Make sure the user belongs to a team that has the ticket
    const userBelongsToTeamWithTicket = dbUser.teams.some(({ team }) => {
      return team.tickets.some((ticket) => ticket.id === values.ticketId)
    })

    if (!userBelongsToTeamWithTicket) {
      throw new Error('You do not have access to this ticket')
    }

    // Get the ticket including the tags
    const dbTicket = await prisma.ticket.findUnique({
      where: {
        id: values.ticketId,
      },
      select: {
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // Get the tags that doesn't exist on the team
    const tagsToCreate = values.tags.filter((tag) => {
      return !dbUser.current_team.ticket_tags.some(
        (existingTag) => existingTag.name.toLowerCase() === tag.name.toLowerCase(),
      )
    })

    // Get the tags that exists on the team but not on the ticket
    const tagsToLink = values.tags
      .filter((tag) => {
        return !dbTicket?.tags.some((existingTag) => existingTag.tag.name.toLowerCase() === tag.name.toLowerCase())
      })
      .map((linkedTag) => {
        const foundTicket = dbUser.current_team.ticket_tags.find(
          (tag) => tag.name.toLowerCase() === linkedTag.name.toLowerCase(),
        )!

        return foundTicket
      })
      .filter(Boolean)

    // Then get the tags that needs to be deleted
    const ticketsToUnlink = (dbTicket?.tags ?? []).filter(
      (existingTag) => !values.tags.some((tag) => tag.name.toLowerCase() === existingTag.tag.name.toLowerCase()),
    )

    const { createdTags, createdRelations, unLinedTags } = await prisma
      .$transaction(async (tx) => {
        // Create these tags
        const createdTags = await tx.ticketTag.createManyAndReturn({
          data: tagsToCreate.map((tag) => ({
            name: tag.name,
            color: tag.color,
            team_id: dbUser.current_team_id,
          })),
          select: {
            id: true,
          },
        })

        // Create the relation between the ticket and the tags
        const createdRelations = await tx.ticketTagOnTicket.createMany({
          data: [...createdTags, ...tagsToLink].map((tag) => ({
            tag_id: tag.id,
            ticket_id: values.ticketId,
          })),
        })

        // Remove the relation between the ticket and the tags
        const unLinedTags = await prisma.ticketTagOnTicket.deleteMany({
          where: {
            tag_id: {
              in: ticketsToUnlink.map((tag) => tag.tag.id),
            },
          },
        })

        return {
          createdTags,
          createdRelations,
          unLinedTags,
        }
      })
      .catch((_err) => {
        throw new Error('Failed to set tags')
      })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    return {
      createdTags,
      createdRelations,
      unLinedTags,
    }
  },
)

// TODO: Move to TRPC
export const updateTag = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    id: z.string().uuid(),
    name: z
      .string({ message: 'Name is required' })
      .min(1, { message: 'Name is required' })
      .max(30, { message: 'Name can only be maximun 30 characters' }),
    color: z
      .string({ message: 'Color is required' })
      .startsWith('#', { message: 'Invalid color' })
      .max(7, { message: 'Invalid color' }),
  }),
  async (values, user) => {
    const updatedTag = await prisma.ticketTag
      .update({
        where: {
          id: values.id,
          // Make sure the tag belongs to the users team
          team: {
            members: {
              some: {
                user_id: user.id,
              },
            },
          },
        },
        data: {
          name: values.name,
          color: values.color,
        },
      })
      .catch((_err) => {
        throw new Error('Failed to update tag')
      })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('ticket_tag_updated', {
      tag_id: values.id,
      profileId: user.id,
      tag_name_from: values.name,
      tag_name_to: updatedTag.name,
    })

    return updatedTag
  },
)

// TODO: Move to TRPC
export const createTag = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    name: z
      .string({ message: 'Name is required' })
      .min(1, { message: 'Name is required' })
      .max(30, { message: 'Name can only be maximun 30 characters' }),
    color: z
      .string({ message: 'Color is required' })
      .startsWith('#', { message: 'Invalid color' })
      .max(7, { message: 'Invalid color' }),
  }),
  async (values) => {
    const dbUser = await api.users.queries.findMe()

    const createdTag = await prisma.ticketTag.create({
      data: {
        name: values.name,
        color: values.color,
        team_id: dbUser.current_team_id,
      },
      select: {
        id: true,
        name: true,
        color: true,
      },
    })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('ticket_tag_created', {
      tag_id: createdTag.id,
      tag_name: createdTag.name,
      profileId: dbUser.id,
    })

    return createdTag
  },
)
