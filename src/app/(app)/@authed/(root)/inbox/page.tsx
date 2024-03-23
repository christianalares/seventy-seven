import { TicketsList } from '@/components/tickets-list'
import { prisma } from '@/lib/prisma'
import { ticketsQueries } from '@/utils/supabase/queries/tickets'
import { getSession, getUser } from '@/utils/supabase/session'

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
