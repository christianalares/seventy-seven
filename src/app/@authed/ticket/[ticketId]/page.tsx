import { Avatar } from '@/components/avatar'
import { ChatResponseForm } from '@/components/forms/chat-response-form'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/utils/supabase/session'
import { format } from 'date-fns'

type Props = {
  params: {
    ticketId: string
  }
}

const TicketPage = async ({ params }: Props) => {
  const user = await getUser()

  let currentTeamId = user.current_team_id

  if (!user.current_team_id) {
    const firstUserTeam = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            user_id: user.id,
          },
        },
      },
    })

    currentTeamId = firstUserTeam?.id ?? null
  }

  if (!currentTeamId) {
    throw new Error('No team found')
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      team_id: currentTeamId,
      id: params.ticketId,
    },
    select: {
      id: true,
      subject: true,
      sender_full_name: true,
      sender_email: true,
      messages: {
        select: {
          created_at: true,
          id: true,
          sent_by_user: {
            select: {
              id: true,
              full_name: true,
              image_url: true,
            },
          },
          body: true,
        },
      },
    },
  })

  if (!ticket) {
    throw new Error('No ticket found')
  }

  return (
    <div className="m-8 flex-1 relative flex flex-col overflow-auto">
      <h1 className="text-xl border-b pb-8 text-center">
        {ticket.subject}
        <br />
        <span className="text-sm text-muted-foreground">
          {ticket.sender_full_name} - {ticket.sender_email}
        </span>
      </h1>

      <ul className="flex flex-col gap-4 mt-8">
        {[
          ...ticket.messages,
          // ...ticket.messages,
          // ...ticket.messages,
          // ...ticket.messages,
          // ...ticket.messages,
          // ...ticket.messages,
          // ...ticket.messages,
          // ...ticket.messages,
        ].map((message) => {
          if (message.sent_by_user) {
            return (
              <MessageHandler
                key={message.id}
                date={message.created_at}
                body={message.body}
                name={message.sent_by_user.full_name}
                avatar={message.sent_by_user.image_url ?? undefined}
              />
            )
          }

          return (
            <MessageUser
              key={message.id}
              date={message.created_at}
              name={ticket.sender_full_name}
              body={message.body}
            />
          )
        })}
      </ul>

      <div className="mt-auto">
        <ChatResponseForm ticketId={ticket.id} />
      </div>
    </div>
  )
}

type MessageUserProps = {
  name: string
  body: string
  date: Date
}

const MessageUser = ({ name, body, date }: MessageUserProps) => {
  return (
    <li className="border rounded-md p-4 w-[80%] max-w-4xl self-start">
      <p className="flex justify-between text-xs font-medium">
        <span>{name}</span>
        <time className="text-muted" dateTime={date.toISOString()}>
          {format(date, 'HH:mm')}
        </time>
      </p>
      <p className="mt-2">{body}</p>
    </li>
  )
}

type MessageHandlerProps = {
  name: string
  avatar?: string
  body: string
  date: Date
}

const MessageHandler = ({ name, avatar, body, date }: MessageHandlerProps) => {
  return (
    <li className="border rounded-md p-4 w-[80%] max-w-4xl self-end">
      <div className="flex justify-between text-xs font-medium items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={name} imageUrl={avatar} className="size-8 border" />
          <span>{name}</span>
        </div>

        <time className="text-muted" dateTime={date.toISOString()}>
          {format(date, 'HH:mm')}
        </time>
      </div>

      <p className="mt-2">{body}</p>
    </li>
  )
}

export default TicketPage
