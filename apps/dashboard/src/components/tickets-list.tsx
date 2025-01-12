'use client'

import { trpc } from '@/trpc/client'
import { Icon } from '@seventy-seven/ui/icon'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { ClearAllFiltersButton } from './clear-all-filters-button'
import { useTicketFilters } from './ticket-filters/use-ticket-filters'
import { TicketListItem } from './ticket-list-item'

export const TicketsList = () => {
  const { filter } = useTicketFilters()

  const hasFilters = Object.entries(filter)
    .filter(([key]) => ['statuses', 'assignees', 'tags'].includes(key))
    .some(([_key, value]) => value !== null)

  const [tickets] = trpc.tickets.findMany.useSuspenseQuery({
    statuses: filter.statuses ?? undefined,
    memberIds: filter.assignees ?? undefined,
    query: filter.q ?? undefined,
    tags: filter.tags ?? undefined,
  })

  if (tickets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        {hasFilters ? (
          <p className="text-muted-foreground text-2xl flex flex-col items-center gap-2">
            <Icon name="filterX" className="size-8" />
            No tickets matching your filters
            <ClearAllFiltersButton className="gap-2">
              <Icon name="trash" className="size-4" />
              Clear all filters
            </ClearAllFiltersButton>
          </p>
        ) : (
          <p className="text-muted-foreground text-2xl">No tickets found</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-1 md:p-4">
      {tickets.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  )
}

export const TicketListSkeleton = () => {
  const items = Array.from({ length: 10 }, (_, i) => ({ id: i.toString() }))

  return (
    <div className="flex flex-col gap-4 p-1 md:p-4">
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
