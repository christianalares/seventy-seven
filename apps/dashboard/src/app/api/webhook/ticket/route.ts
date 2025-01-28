import type { GenerateTicketSummaryTask } from '@/trigger/generate-ticket-summary'
import { parseIncomingMessageWithAI } from '@/utils/parseIncomingMessageWithAI'
import { stripMarkupfromMessage } from '@/utils/stripMarkupfromMessage'
import { Prisma, prisma } from '@seventy-seven/orm/prisma'
import { tasks } from '@trigger.dev/sdk/v3'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const ticketsWebhookPostSchema = z.object({
  OriginalRecipient: z
    .string({ required_error: 'OriginalRecipient is required' })
    .email({ message: 'Invalid email format' })
    .endsWith('@ticket.seventy-seven.dev', { message: 'Invalid email domain' }),
  StrippedTextReply: z
    .string({ required_error: 'StrippedTextReply is required' })
    .max(1000, { message: 'StrippedTextReply must be at most 1000 characters' }),
  HtmlBody: z.string({ required_error: 'HtmlBody is required' }),
})

// https://postmarkapp.com/support/article/800-ips-for-firewalls#webhooks
const ipRange = ['3.134.147.250', '50.31.156.6', '50.31.156.77', '18.217.206.57']

export async function POST(req: Request) {
  const clientIp = headers().get('x-forwarded-for')

  if (process.env.NODE_ENV !== 'development' && (!clientIp || !ipRange.includes(clientIp))) {
    return NextResponse.json({ error: 'Invalid IP address' }, { status: 403 })
  }

  const parsedBody = ticketsWebhookPostSchema.safeParse(await req.json())

  if (!parsedBody.success) {
    const errors = parsedBody.error.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }))

    return NextResponse.json({ error: 'Invalid request body', errors }, { status: 400 })
  }

  const [shortId] = parsedBody.data.OriginalRecipient.split('@')

  if (!shortId) {
    return NextResponse.json({ error: 'Invalid OriginalRecipient email' }, { status: 400 })
  }

  const foundTicket = await prisma.ticket.findUnique({
    where: {
      short_id: shortId,
    },
    select: {
      short_id: true,
      messages: {
        where: {
          // Only select messages sent by the user, not the handler
          handler_id: null,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 1,
      },
    },
  })

  if (!foundTicket) {
    return NextResponse.json({ error: `Ticket #${shortId} not found` }, { status: 404 })
  }

  const lastMessageFromUser = foundTicket.messages.at(0)

  if (!lastMessageFromUser) {
    return NextResponse.json({ error: `No user messages found on ticket #${shortId}` }, { status: 404 })
  }

  const strippedMessage = stripMarkupfromMessage(parsedBody.data.HtmlBody)
  const parsedMessage = await parseIncomingMessageWithAI(strippedMessage)

  try {
    const updatedTicket = await prisma.ticket.update({
      where: {
        short_id: foundTicket.short_id,
      },
      data: {
        closed_at: null,
        messages: {
          create: {
            body: parsedMessage,
            raw_body: parsedBody.data.HtmlBody,
            unable_to_parse_content: false,
            sent_from_full_name: lastMessageFromUser.sent_from_full_name,
            sent_from_email: lastMessageFromUser.sent_from_email,
            sent_from_avatar_url: lastMessageFromUser.sent_from_avatar_url,
          },
        },
      },
      select: {
        id: true,
      },
    })

    await tasks.trigger<GenerateTicketSummaryTask>('generate-ticket-summary', {
      ticketId: updatedTicket.id,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: `Ticket #${shortId} not found` }, { status: 404 })
    }

    return NextResponse.json({ error: `Failed to create message on ticket #${shortId}` }, { status: 500 })
  }
}
