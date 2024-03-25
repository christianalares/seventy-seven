import { TicketsList } from '@/components/tickets-list'
import { ticketsQueries } from '@/queries/tickets'

const InboxPage = async () => {
  const tickets = await ticketsQueries.findMany()

  if (tickets.length === 0) {
    return (
      <div className="flex flex-1 h-full justify-center items-center">
        <p className="text-muted-foreground text-2xl">No tickets found</p>
      </div>
    )
  }

  return <TicketsList tickets={tickets} />
}

export default InboxPage
