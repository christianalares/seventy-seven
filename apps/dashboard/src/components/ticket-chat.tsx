import type { TicketsFindById } from '@/queries/tickets'
import { ChatMessageHandler } from './chat-message-handler'
import { ChatMessageUser } from './chat-message-user'

type Props = {
  ticket: TicketsFindById
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
              name={message.sent_by_user.full_name}
              body={message.body}
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
            avatar={ticket.sender_avatar_url ?? undefined}
          />
        )
      })}
    </ul>
  )
}
