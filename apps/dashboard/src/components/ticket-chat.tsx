import type { Prisma } from '@seventy-seven/orm/prisma'
import { ChatMessageHandler } from './chat-message-handler'
import { ChatMessageUser } from './chat-message-user'

type Ticket = Prisma.TicketGetPayload<{
  select: {
    id: true
    subject: true
    sender_full_name: true
    sender_email: true
    messages: {
      select: {
        created_at: true
        id: true
        sent_by_user: {
          select: {
            id: true
            full_name: true
            image_url: true
          }
        }
        body: true
      }
    }
  }
}>

type Props = {
  ticket: Ticket
}

export const TicketChat = ({ ticket }: Props) => {
  return (
    <ul className="flex flex-col gap-4 m-8">
      {ticket.messages.map((message) => {
        if (message.sent_by_user) {
          return (
            <ChatMessageHandler
              key={message.id}
              date={message.created_at}
              body={message.body}
              name={message.sent_by_user.full_name}
              avatar={message.sent_by_user.image_url ?? undefined}
            />
          )
        }
        return (
          <ChatMessageUser
            key={message.id}
            date={message.created_at}
            name={ticket.sender_full_name}
            body={message.body}
          />
        )
      })}
    </ul>
  )
}
