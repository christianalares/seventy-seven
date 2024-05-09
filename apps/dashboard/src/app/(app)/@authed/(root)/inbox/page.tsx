import NoTicketSelected from '@/components/no-ticket-selected'
import SelectedTicket from '@/components/selected-ticket'
import { TicketFilters } from '@/components/ticket-filters'
import { TicketsList } from '@/components/tickets-list'
import { ticketFiltersCache, ticketIdCache } from '@/lib/search-params'
import { Suspense } from 'react'

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const InboxRootPage = ({ searchParams }: Props) => {
  const ticketId = ticketIdCache.parse(searchParams)
  ticketFiltersCache.parse(searchParams)

  return (
    <div className="flex">
      <div className="border-r">
        <TicketFilters />

        <div className="h-[calc(100vh-136px)] overflow-y-auto w-[35vw] max-w-lg min-w-96">
          <TicketsList />
        </div>
      </div>

      <main className="flex-1">
        {ticketId.ticketId ? (
          <Suspense fallback={<p>Loading ticket...</p>}>
            <SelectedTicket id={ticketId.ticketId} />
          </Suspense>
        ) : (
          <NoTicketSelected />
        )}
      </main>
    </div>
  )
}

export default InboxRootPage
