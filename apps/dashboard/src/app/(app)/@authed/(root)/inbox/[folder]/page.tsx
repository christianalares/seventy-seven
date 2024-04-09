import NoTicketSelected from '@/components/no-ticket-selected'
import SelectedTicket from '@/components/selected-ticket'
import { TicketsList } from '@/components/tickets-list'
import { folderSchema } from '@/queries/tickets'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { z } from 'zod'

const paramsSchema = z.object({
  folder: folderSchema,
})

const searchParamsSchema = z.object({
  id: z.string().uuid(),
})

type Props = {
  params: Record<string, string>
  searchParams: Record<string, string>
}

const InboxRootPage = ({ params, searchParams }: Props) => {
  const parsedParams = paramsSchema.safeParse(params)
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedParams.success) {
    notFound()
  }

  return (
    <div className="flex">
      <div className="h-[calc(100vh-theme(spacing.20))] overflow-y-auto border-r w-[35vw] max-w-lg min-w-96 p-4">
        <TicketsList folder={parsedParams.data.folder} />
      </div>
      <main className="flex-1">
        <Suspense fallback={<p>Loading ticket...</p>}>
          {parsedSearchParams.success ? <SelectedTicket id={parsedSearchParams.data.id} /> : <NoTicketSelected />}
        </Suspense>
      </main>
    </div>
  )
}

export default InboxRootPage
