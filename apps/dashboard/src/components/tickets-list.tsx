import { ticketsQueries } from '@/queries/tickets'
import { TicketListItemV2 } from './ticket-list-item'

export const TicketsListV2 = async () => {
  const tickets = await ticketsQueries.findMany()

  return (
    <div className="flex flex-col gap-4">
      {tickets.map((ticket) => (
        <TicketListItemV2 key={ticket.id} ticket={ticket} />
      ))}
    </div>
  )
}
