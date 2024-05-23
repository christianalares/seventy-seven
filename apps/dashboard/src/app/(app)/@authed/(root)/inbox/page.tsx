import { TicketSearchForm } from '@/components/forms/ticket-search-form'
import { NoTicketSelected } from '@/components/no-ticket-selected'
import { SelectedTicket, SelectedTicketSkeleton } from '@/components/selected-ticket'
import { TicketFilterLoading, TicketFiltersServer } from '@/components/ticket-filters/ticket-filters.server'
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
    <div>
      <div className="px-2 h-14 flex items-center justify-between border-b gap-2">
        <TicketSearchForm />
        <Suspense fallback={<TicketFilterLoading />}>
          <TicketFiltersServer />
        </Suspense>
      </div>

      <div className="flex h-full">
        <div
          className={cn(
            'h-[calc(100vh-136px)] overflow-y-auto w-full md:w-[35vw] md:max-w-lg md:min-w-96 md:border-r',
            {
              'max-md:hidden': !!ticketId.ticketId,
            },
          )}
        >
          <Suspense key={numberOfActiveFilters} fallback={<TicketListSkeleton />}>
            <TicketsList />
          </Suspense>
        </div>

        <div
          className={cn('flex-1', {
            'hidden md:block': !ticketId.ticketId,
          })}
        >
          <Suspense key={ticketId.ticketId} fallback={<SelectedTicketSkeleton />}>
            {ticketId.ticketId ? <SelectedTicket id={ticketId.ticketId} /> : <NoTicketSelected />}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default InboxRootPage
