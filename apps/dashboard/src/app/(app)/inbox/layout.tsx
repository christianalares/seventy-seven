import { TicketSearchForm } from '@/components/forms/ticket-search-form'
import { TicketFilterLoading, TicketFiltersDropdown } from '@/components/ticket-filters/ticket-filters-dropdown'
import { HydrateClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
}

const InboxLayout = ({ children }: Props) => {
  trpc.users.myCurrentTeam.prefetch()

  return (
    <HydrateClient>
      <main className="flex flex-col overflow-hidden h-full">
        <div className="border-b flex justify-between gap-2 p-2">
          <TicketSearchForm className="md:max-w-md" />
          <Suspense fallback={<TicketFilterLoading />}>
            <TicketFiltersDropdown />
          </Suspense>
        </div>
        {children}
      </main>
    </HydrateClient>
  )
}

export default InboxLayout
