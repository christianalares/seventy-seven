import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const ticketsPostSchema = z.object({
  subject: z.string({ required_error: 'Subject is required' }),
  body: z.string({ required_error: 'Body is required' }),
  senderFullName: z.string({ required_error: 'Sender full name is required' }),
  senderEmail: z.string({ required_error: 'Sender email is required' }).email({ message: 'Invalid email format' }),
  senderAvatarUrl: z.string().url({ message: 'Invalid avatar url format' }).optional(),
  meta: z.any().optional(),
})

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization')

  const body = await req.json().catch(() => {
    return NextResponse.json({ error: 'Invalid post body' }, { status: 400 })
  })

  if (!authHeader) {
    return NextResponse.json({ error: 'Missing header X-Api-Key' }, { status: 400 })
  }

  const [, apiKey] = authHeader.split(' ')

  if (!apiKey) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }

  const foundTeam = await prisma.team.findFirst({
    where: {
      auth_token: apiKey,
    },
    select: {
      id: true,
      auth_token: true,
    },
  })

  if (!foundTeam || apiKey !== foundTeam.auth_token) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }

  const parsedBody = ticketsPostSchema.safeParse(body)

  if (!parsedBody.success) {
    const errors = parsedBody.error.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }))

    return NextResponse.json({ error: 'Invalid request body', errors }, { status: 400 })
  }

  const createdTicket = await prisma.ticket.create({
    data: {
      team_id: foundTeam.id,
      subject: parsedBody.data.subject,
      sender_full_name: parsedBody.data.senderFullName,
      sender_email: parsedBody.data.senderEmail,
      sender_avatar_url: parsedBody.data.senderAvatarUrl,
      meta: parsedBody.data.meta,
      messages: {
        create: {
          body: parsedBody.data.body,
        },
      },
    },
  })

  return NextResponse.json(createdTicket, { status: 201 })
}
