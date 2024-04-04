import type { TicketsFindById } from '@/queries/tickets'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { TicketActionDropdown } from './ticket-action-dropdown'

type Props = {
  ticket: TicketsFindById
}

export const TicketChatHeader = ({ ticket }: Props) => {
  return (
    <header className="border-b p-4 flex items-center">
      <div>
        <h1 className="text-xl">{ticket.subject}</h1>
        <span className="text-sm text-muted-foreground">
          {ticket.sender_full_name} - {ticket.sender_email}
        </span>
      </div>

      <div className="ml-auto">
        <TicketActionDropdown />
        {/* <Button size="xs" className="gap-2">
          <Icon name="check" className="size-4" />
          Close ticket
        </Button> */}
      </div>
    </header>
  )
}
