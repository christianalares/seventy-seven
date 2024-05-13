import { ticketFiltersCache } from '@/lib/search-params'
import { ticketsQueries } from '@/queries/tickets'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { TicketListItem } from './ticket-list-item'

export const TicketsList = async () => {
  const filters = ticketFiltersCache.all()
  const hasFilters = Object.values(filters).some((value) => value !== null)

  const tickets = await ticketsQueries.findMany({
    statuses: filters.statuses ?? undefined,
    memberIds: filters.assignees ?? undefined,
  })

  if (tickets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-2xl">
          {hasFilters ? 'No tickets matching your filters' : 'No tickets found'}
        </p>
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

export const TicketListSkeleton = () => {
  const items = Array.from({ length: 10 }, (_, i) => ({ id: i.toString() }))

  return (
    <div className="flex flex-col gap-4 p-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 bg-muted/5 dark:bg-muted/30 h-[120px] rounded-md">
          <div className="flex items-center gap-2">
            <Skeleton className="rounded-full size-7" />
            <Skeleton className="w-28 h-4" />
          </div>

          <Skeleton className="mt-2 w-28 h-4" />
          <Skeleton className="mt-4 w-full h-3" />
        </div>
      ))}
    </div>
  )
}
