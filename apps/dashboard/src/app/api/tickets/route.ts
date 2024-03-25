import { prisma } from '@/lib/prisma'
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

  let body: any

  try {
    body = await req.json()
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid post body' }, { status: 400 })
  }

  if (!authHeader) {
    return NextResponse.json({ error: 'Missing header X-Api-Key' }, { status: 400 })
  }

  const [_bearer, apiKey] = authHeader.split(' ')

  if (!apiKey) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }

  // TODO: Query DB for retrieving the api key
  if (apiKey !== 'supersecret') {
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

  const teamId = '44310b7f-ccdd-4f2b-8b45-cdf01bc19ff9'

  const createdTicket = await prisma.ticket.create({
    data: {
      team_id: teamId,
      subject: parsedBody.data.subject,
      sender_full_name: parsedBody.data.senderFullName,
      sender_email: parsedBody.data.senderEmail,
      sender_avatar_url: parsedBody.data.senderAvatarUrl,
      messages: {
        create: {
          body: parsedBody.data.body,
        },
      },
    },
  })

  return NextResponse.json(createdTicket, { status: 201 })
}
