import type { TicketsFindById } from '@/queries/tickets'
import { TicketActionDropdown } from './ticket-action-dropdown'

type Props = {
  ticket: TicketsFindById
}

export const TicketChatHeader = ({ ticket }: Props) => {
  const lastMessageFromUser = ticket.messages.find((msg) => !!msg.sent_from_full_name)
  const senderFullName = lastMessageFromUser?.sent_from_full_name ?? ''
  const senderEmail = lastMessageFromUser?.sent_from_email ?? ''

  return (
    <header className="border-b p-2 md:p-4 flex items-center gap-2">
      <div>
        <h1 className="text-base sm:text-xl">{ticket.subject}</h1>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {senderFullName} - {senderEmail}
        </span>
      </div>

      <div className="ml-auto">
        <TicketActionDropdown ticket={ticket} />
      </div>
    </header>
  )
}
