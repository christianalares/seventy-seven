import { usersQueries } from '@/queries/users'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { TicketFiltersClient } from './ticket-filters.client'

export const TicketFiltersServer = async () => {
  const userTeam = await usersQueries.myCurrentTeam()

  return <TicketFiltersClient userTeam={userTeam} />
}

export const TicketFilterLoading = () => {
  return (
    <div className="px-2 h-14 flex items-center justify-end border-b">
      <span className="sr-only">Loading filters</span>
      <Skeleton className="size-10" />
    </div>
  )
}
