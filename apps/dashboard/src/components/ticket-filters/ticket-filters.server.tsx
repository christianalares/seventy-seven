import { api } from '@/queries'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { TicketFiltersClient } from './ticket-filters.client'

export const TicketFiltersServer = async () => {
  const userTeam = await api.users.queries.myCurrentTeam()

  return <TicketFiltersClient userTeam={userTeam} />
}

export const TicketFilterLoading = () => {
  return (
    <Skeleton className="size-10">
      <span className="sr-only">Loading filters</span>
    </Skeleton>
  )
}
