import type { Prisma } from '@/lib/prisma'
import type { TicketsFindMany } from '@/utils/supabase/queries/tickets'
import { TicketListItem } from './ticket-list-item'

type Props = {
  tickets: TicketsFindMany
}

export const TicketsList = ({ tickets }: Props) => {
  return (
    <ul className="flex flex-col gap-4">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketListItem ticket={ticket} />
        </li>
      ))}
    </ul>
  )
}
