import { SeventySevenClient } from '@seventy-seven/sdk'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

const seventySevenClient = new SeventySevenClient(process.env.SEVENTY_SEVEN_AUTH_TOKEN!)

export namespace SeventySevenRouter {
  export type CreateTicket = RouterOutputs['seventySeven']['createTicket']
}

export const seventySevenRouter = createTRPCRouter({
  createTicket: authProcedure
    .input(
      z.object({
        fullName: z.string({ required_error: 'Sender full name is required' }),
        subject: z.string({ required_error: 'Subject is required' }),
        body: z.string({ required_error: 'Body is required' }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          email: true,
          image_url: true,
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const createdTicket = await seventySevenClient
        .createTicket({
          senderFullName: input.fullName,
          senderEmail: user.email,
          subject: input.subject,
          body: input.body,
          senderAvatarUrl: user.image_url ?? undefined,
        })
        .catch(() => {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create ticket' })
        })

      if (!createdTicket) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create ticket' })
      }

      return createdTicket
    }),
})
