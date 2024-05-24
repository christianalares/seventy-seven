import { NoTicketSelected } from '@/components/no-ticket-selected'
import { SelectedTicket, SelectedTicketSkeleton } from '@/components/selected-ticket'
import { TicketListSkeleton, TicketsList } from '@/components/tickets-list'
import { ticketFiltersCache, ticketIdCache } from '@/lib/search-params'
import { cn } from '@seventy-seven/ui/utils'
import { Suspense } from 'react'

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const InboxRootPage = async ({ searchParams }: Props) => {
  const ticketId = ticketIdCache.parse(searchParams)
  const filter = ticketFiltersCache.parse(searchParams)
  const numberOfActiveFilters = Object.values(filter).filter((value) => value !== null).length

  return (
    <div className="flex-1 flex min-h-0">
      <div
        className={cn('border-r md:w-[35vw] w-full md:max-w-lg md:min-w-96 overflow-y-auto', {
          'max-md:hidden': !!ticketId.ticketId,
        })}
      >
        <Suspense key={numberOfActiveFilters} fallback={<TicketListSkeleton />}>
          <TicketsList />
        </Suspense>
      </div>

      <div className="flex-1">
        <Suspense key={ticketId.ticketId} fallback={<SelectedTicketSkeleton />}>
          {ticketId.ticketId ? <SelectedTicket id={ticketId.ticketId} /> : <NoTicketSelected />}
        </Suspense>
      </div>
    </div>
  )
}

export default InboxRootPage
