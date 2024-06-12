import { componentToPlainText } from '@seventy-seven/email'
import SnoozeExpired from '@seventy-seven/email/emails/snooze-expired'
import { prisma } from '@seventy-seven/orm/prisma'
import { App as SlackApp } from '@slack/bolt'
import { Resend } from '@trigger.dev/resend'
import { eventTrigger } from '@trigger.dev/sdk'
import { z } from 'zod'
import { Events, Jobs } from '../constants'
import { jobsClient } from '../jobsClient'

const resend = new Resend({
  id: 'resend',
  apiKey: process.env.RESEND_API_KEY,
})

jobsClient.defineJob({
  id: Jobs.UNSNOOZE_TICKET.id,
  version: '0.0.1',
  name: Jobs.UNSNOOZE_TICKET.name,
  trigger: eventTrigger({
    name: Events.UNSNOOZE_TICKET,
    schema: z.object({
      userId: z.string().uuid(),
      userEmail: z.string().email(),
      ticketId: z.string().uuid(),
    }),
  }),
  integrations: {
    resend,
  },
  run: async (payload, io) => {
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: payload.ticketId,
        team: {
          members: {
            some: {
              user_id: payload.userId,
            },
          },
        },
      },
      data: {
        snoozed_until: null,
        event_id: null,
      },
      select: {
        id: true,
        short_id: true,
        subject: true,
        messages: {
          select: {
            id: true,
            body: true,
            created_at: true,
            sent_from_full_name: true,
            sent_from_email: true,
            sent_from_avatar_url: true,
            handler: {
              select: {
                full_name: true,
                image_url: true,
              },
            },
          },
          take: 5,
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    const ticketWithTeam = await prisma.ticket.findUnique({
      where: {
        id: payload.ticketId,
      },
      select: {
        id: true,
        snoozed_until: true,
        team: {
          select: {
            integration_slack: {
              select: {
                slack_access_token: true,
                slack_channel_id: true,
                slack_bot_user_id: true,
              },
            },
          },
        },
      },
    })

    if (ticketWithTeam?.team.integration_slack) {
      const slackApp = new SlackApp({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: ticketWithTeam.team.integration_slack.slack_access_token,
        botId: ticketWithTeam.team.integration_slack.slack_bot_user_id,
      })

      slackApp.client.chat.postMessage({
        channel: ticketWithTeam.team.integration_slack.slack_channel_id,
        text: `⚠️ Snoozed ticket alert! Ticket with the id ${ticketWithTeam.id} has been unsnoozed}`,
      })
    }

    const template = SnoozeExpired({
      shortId: updatedTicket.short_id,
      subject: updatedTicket.subject,
      thread: updatedTicket.messages,
      ticketUrl:
        process.env.VERCEL_ENV === 'production'
          ? `https://app.seventy-seven.dev/inbox?ticketId=${updatedTicket.id}`
          : `http://localhost:3000/inbox?ticketId=${updatedTicket.id}`,
    })

    const sentSnoozeEmail = await io.resend.emails.send(
      'snooze-expired',
      {
        from: 'Seventy Seven <seventy-seven@seventy-seven.dev>',
        to: [payload.userEmail],
        subject: `Snooze Alert #${updatedTicket.short_id}`,
        react: template,
        text: componentToPlainText(template),
      },
      {},
    )

    return sentSnoozeEmail
  },
})
