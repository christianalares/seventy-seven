import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace TicketTagsRouter {
  export type FindMany = RouterOutputs['ticketTags']['setTags']
}

export const ticketTagsRouter = createTRPCRouter({
  setTags: authProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        tags: z.array(
          z.object({
            name: z.string(),
            color: z.string().startsWith('#').max(7),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          current_team_id: true,
          current_team: {
            select: {
              ticket_tags: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
          teams: {
            select: {
              team: {
                select: {
                  tickets: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      // Make sure the user belongs to a team that has the ticket
      const userBelongsToTeamWithTicket = user.teams.some(({ team }) => {
        return team.tickets.some((ticket) => ticket.id === input.ticketId)
      })

      if (!userBelongsToTeamWithTicket) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You do not have access to this ticket' })
      }

      // Get the ticket including the tags
      const ticket = await ctx.prisma.ticket.findUnique({
        where: {
          id: input.ticketId,
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
      const tagsToCreate = input.tags.filter((tag) => {
        return !user.current_team.ticket_tags.some(
          (existingTag) => existingTag.name.toLowerCase() === tag.name.toLowerCase(),
        )
      })

      // Get the tags that exists on the team but not on the ticket
      const tagsToLink = input.tags
        .filter((tag) => {
          return !ticket?.tags.some((existingTag) => existingTag.tag.name.toLowerCase() === tag.name.toLowerCase())
        })
        .map((linkedTag) => {
          const foundTicket = user.current_team.ticket_tags.find(
            (tag) => tag.name.toLowerCase() === linkedTag.name.toLowerCase(),
          )!

          return foundTicket
        })
        .filter(Boolean)

      // Then get the tags that needs to be deleted
      const ticketsToUnlink = (ticket?.tags ?? []).filter(
        (existingTag) => !input.tags.some((tag) => tag.name.toLowerCase() === existingTag.tag.name.toLowerCase()),
      )

      const { createdTags, createdRelations, unLinedTags } = await ctx.prisma
        .$transaction(async (tx) => {
          // Create these tags
          const createdTags = await tx.ticketTag.createManyAndReturn({
            data: tagsToCreate.map((tag) => ({
              name: tag.name,
              color: tag.color,
              team_id: user.current_team_id,
            })),
            select: {
              id: true,
            },
          })

          // Create the relation between the ticket and the tags
          const createdRelations = await tx.ticketTagOnTicket.createMany({
            data: [...createdTags, ...tagsToLink].map((tag) => ({
              tag_id: tag.id,
              ticket_id: input.ticketId,
            })),
          })

          // Remove the relation between the ticket and the tags
          const unLinedTags = await ctx.prisma.ticketTagOnTicket.deleteMany({
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
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to set tags' })
        })

      return {
        createdTags,
        createdRelations,
        unLinedTags,
      }
    }),
})