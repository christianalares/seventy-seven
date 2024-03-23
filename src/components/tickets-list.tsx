import type { Prisma } from '@/lib/prisma'
import { TicketListItem } from './ticket-list-item'

type Props = {
  tickets: Array<
    Prisma.TicketGetPayload<{
      select: {
        id: true
        created_at: true
        subject: true
        sender_full_name: true
        sender_email: true
      }
    }>
  >
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
