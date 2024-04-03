import { ticketsQueries } from '@/queries/tickets'
import { TicketListItem } from './ticket-list-item'

export const TicketsList = async () => {
  const tickets = await ticketsQueries.findMany()

  return (
    <div className="flex flex-col gap-4">
      {tickets.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  )
}
