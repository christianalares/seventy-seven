import NoTicketSelected from '@/components/no-ticket-selected'
import SelectedTicket from '@/components/selected-ticket'
import { TicketFilterLoading, TicketFiltersServer } from '@/components/ticket-filters/ticket-filters.server'
import { TicketListSkeleton, TicketsList } from '@/components/tickets-list'
import { ticketFiltersCache, ticketIdCache } from '@/lib/search-params'
import { Suspense } from 'react'

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const InboxRootPage = async ({ searchParams }: Props) => {
  const ticketId = ticketIdCache.parse(searchParams)
  ticketFiltersCache.parse(searchParams)

  return (
    <div className="flex">
      <div className="border-r">
        <Suspense fallback={<TicketFilterLoading />}>
          <TicketFiltersServer />
        </Suspense>

        <div className="h-[calc(100vh-136px)] overflow-y-auto w-[35vw] max-w-lg min-w-96">
          <Suspense key={Math.random().toString()} fallback={<TicketListSkeleton />}>
            <TicketsList />
          </Suspense>
        </div>
      </div>

      <main className="flex-1">
        <Suspense fallback={<p>Loading ticket...</p>}>
          {ticketId.ticketId ? <SelectedTicket id={ticketId.ticketId} /> : <NoTicketSelected />}
        </Suspense>
      </main>
    </div>
  )
}

export default InboxRootPage
