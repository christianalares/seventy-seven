import { opServerClient } from '@/lib/openpanel'
import { shortId } from '@/utils/shortId'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import NewTicket from '@seventy-seven/email/emails/new-ticket'
import { createSlackApp } from '@seventy-seven/integrations/slack'
import { prisma } from '@seventy-seven/orm/prisma'
import { waitUntil } from '@vercel/functions'
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
      name: true,
      image_url: true,
      integration_slack: {
        select: {
          slack_access_token: true,
          slack_bot_user_id: true,
          slack_channel_id: true,
        },
      },
      members: {
        select: {
          user: {
            select: {
              full_name: true,
              email: true,
              notification_email_new_ticket: true,
            },
          },
        },
      },
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
    select: {
      id: true,
      subject: true,
      meta: true,
      short_id: true,
      created_at: true,
    },
  })

  if (foundTeam.integration_slack) {
    const slackApp = createSlackApp({
      token: foundTeam.integration_slack.slack_access_token,
      botId: foundTeam.integration_slack.slack_bot_user_id,
    })

    slackApp.client.chat.postMessage({
      channel: foundTeam.integration_slack.slack_channel_id,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'New support ticket',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${parsedBody.data.senderFullName}* wrote:`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${parsedBody.data.subject}*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: parsedBody.data.body,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Go to ticket',
              },
              url: `https://app.seventy-seven.dev/inbox?ticketId=${createdTicket.id}`,
            },
          ],
        },
      ],
    })
  }

  const to = foundTeam.members
    .filter((member) => member.user.notification_email_new_ticket)
    .map((member) => `${member.user.full_name} <${member.user.email}>`)

  // Only send email if there are recipients to send to
  if (to.length > 0) {
    const resend = createResendClient()

    const template = NewTicket({
      company: {
        name: foundTeam.name,
        imageUrl: foundTeam.image_url ?? undefined,
      },
      message: {
        fullName: parsedBody.data.senderFullName,
        avatarUrl: parsedBody.data.senderAvatarUrl,
        body: parsedBody.data.body,
        createdAt: createdTicket.created_at,
      },
      shortId: createdTicket.short_id,
      subject: createdTicket.subject,
      ticketUrl: `https://app.seventy-seven.dev/inbox?ticketId=${createdTicket.id}`,
    })

    const { error } = await resend.emails.send({
      from: `${parsedBody.data.senderFullName} <seventy-seven@seventy-seven.dev>`,
      to,
      subject: `Incoming ticket to team ${foundTeam.name} from ${parsedBody.data.senderFullName}`,
      react: template,
      text: componentToPlainText(template),
    })

    if (error) {
      console.error('Error sending email', error)
    }
  }

  waitUntil(
    opServerClient.event('created_ticket', {
      team_id: foundTeam.id,
      ticket_id: createdTicket.id,
      subject: createdTicket.subject,
    }),
  )

  return NextResponse.json(
    {
      id: createdTicket.id,
      subject: createdTicket.subject,
      meta: createdTicket.meta,
    },
    { status: 201 },
  )
}
