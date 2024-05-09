import { ticketFiltersCache } from '@/lib/search-params'
import { ticketsQueries } from '@/queries/tickets'
import { TicketListItem } from './ticket-list-item'

export const TicketsList = async () => {
  const filters = ticketFiltersCache.all()

  const tickets = await ticketsQueries.findMany(filters.statuses ?? [])

  if (tickets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-2xl">No tickets found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {tickets.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} folder={filters.statuses?.[0] ?? 'all'} />
      ))}
    </div>
  )
}
