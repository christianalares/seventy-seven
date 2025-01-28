import { openai } from '@ai-sdk/openai'
import { prisma } from '@seventy-seven/orm/prisma'
import { schemaTask } from '@trigger.dev/sdk/v3'
import { embed, generateText } from 'ai'
import { z } from 'zod'

export type GenerateTicketSummaryTask = typeof generateTicketSummaryTask

export const generateTicketSummaryTask = schemaTask({
  id: 'generate-ticket-summary',
  schema: z.object({
    ticketId: z.string().uuid(),
  }),
  queue: {
    concurrencyLimit: 10,
  },
  run: async (payload) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: payload.ticketId },
      select: {
        id: true,
        messages: {
          select: {
            id: true,
            body: true,
            handler: {
              select: {
                id: true,
                email: true,
                full_name: true,
              },
            },
            sent_from_full_name: true,
            sent_from_email: true,
          },
        },
      },
    })

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const flattenedMessages = ticket.messages
      .map((message) => {
        if (message.handler) {
          return `Handler (${message.handler.full_name} <${message.handler.email}>): ${message.body}`
        }

        return `Customer (${message.sent_from_full_name} <${message.sent_from_email}>): ${message.body}`
      })
      .join('\n')

    const model = openai('gpt-4o-mini')

    const { text: summary } = await generateText({
      model,
      prompt: `You are a helpful assistant that can generate a summary of a ticket and their messages.

      Here are the messages in this ticket showing either the handler from the support team or the customer:
      ${flattenedMessages}

      Generate a summary of the ticket and their messages with a maximum of 500 characters.
      If you want to make it shorter thats preferred but make sure to include all the important information for the handler to
      get a good context of the ticket.

      Do not include any "Ticket summary:" prefix or anything like that, only return the summary in plain text.
      `,
    })

    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: summary,
    })

    // Embeddings are not supported in Prisma, so we need to use raw SQL to update the ticket
    const updatedTicket = await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `UPDATE "tickets" SET summary = $1, summary_embedding = $2::vector WHERE id = $3::uuid`,
        summary,
        embedding,
        ticket.id,
      )

      return tx.ticket.findUnique({
        where: { id: ticket.id },
        select: {
          id: true,
          summary: true,
        },
      })
    })

    return updatedTicket
  },
})
