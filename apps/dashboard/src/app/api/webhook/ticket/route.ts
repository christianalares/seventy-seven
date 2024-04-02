import { Prisma, prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
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
    .min(1, { message: 'StrippedTextReply must be at least 1 characters' })
    .max(1000, { message: 'StrippedTextReply must be at most 1000 characters' }),
})

// https://postmarkapp.com/support/article/800-ips-for-firewalls#webhooks
const ipRange = ['3.134.147.250', '50.31.156.6', '50.31.156.77', '18.217.206.57']

export async function POST(req: Request) {
  const clientIp = headers().get('x-forwarded-for')

  if (process.env.NODE_ENV !== 'development' && (!clientIp || !ipRange.includes(clientIp))) {
    return NextResponse.json({ error: 'Invalid IP address' }, { status: 403 })
  }

  let body: any

  try {
    body = await req.json()
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid post body' }, { status: 400 })
  }

  const parsedBody = ticketsWebhookPostSchema.safeParse(body)

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

  try {
    const updatedTicket = await prisma.ticket.update({
      where: {
        short_id: shortId,
      },
      data: {
        messages: {
          create: {
            body: parsedBody.data.StrippedTextReply,
          },
        },
      },
      select: {
        id: true,
      },
    })

    revalidatePath(`/tickets/${updatedTicket.id}`)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: `Ticket #${shortId} not found` }, { status: 404 })
    }

    return NextResponse.json({ error: `Failed to create message on ticket #${shortId}` }, { status: 500 })
  }
}
