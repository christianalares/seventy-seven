import { opServerClient } from '@/lib/openpanel'
import { shortId } from '@/utils/shortId'
import { prisma } from '@seventy-seven/orm/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const ticketsPostSchema = z.object({
  subject: z.string({ required_error: 'Subject is required' }),
  body: z.string({ required_error: 'Body is required' }),
  senderFullName: z.string({ required_error: 'Sender full name is required' }),
  senderEmail: z.string({ required_error: 'Sender email is required' }).email({ message: 'Invalid email format' }),
  senderAvatarUrl: z.string().url({ message: 'Invalid avatar url format' }).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 400 })
  }

  const [_bearer, apiToken] = authHeader.split(' ')

  if (!apiToken) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }

  const parsedBody = ticketsPostSchema.safeParse(await req.json())

  if (!parsedBody.success) {
    const errors = parsedBody.error.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }))

    return NextResponse.json({ error: 'Invalid request body', errors }, { status: 400 })
  }

  const foundTeam = await prisma.team.findFirst({
    where: {
      auth_token: apiToken,
    },
    select: {
      id: true,
      auth_token: true,
    },
  })

  if (!foundTeam || apiToken !== foundTeam.auth_token) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }

  const createdTicket = await prisma.ticket.create({
    data: {
      team_id: foundTeam.id,
      short_id: shortId(),
      subject: parsedBody.data.subject,
      messages: {
        create: {
          body: parsedBody.data.body,
          sent_from_full_name: parsedBody.data.senderFullName,
          sent_from_email: parsedBody.data.senderEmail,
          sent_from_avatar_url: parsedBody.data.senderAvatarUrl,
        },
      },
    },
  })

  opServerClient.event('created_ticket', {
    team_id: foundTeam.id,
    ticket_id: createdTicket.id,
    subject: createdTicket.subject,
  })

  return NextResponse.json(createdTicket, { status: 201 })
}
