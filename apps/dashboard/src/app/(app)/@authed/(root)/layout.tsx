import { AlertProvider } from '@/components/alerts'
import { TicketSearchForm } from '@/components/forms/ticket-search-form'
import { Header } from '@/components/header'
import { ModalProvider } from '@/components/modals'
import { SheetProvider } from '@/components/sheets'
import { TicketFilterLoading, TicketFiltersServer } from '@/components/ticket-filters/ticket-filters.server'
import { Toaster } from '@seventy-seven/ui/sonner'
import { Suspense } from 'react'

type Props = {
  children: React.ReactNode
}

const AuthedLayout = ({ children }: Props) => {
  return (
    <>
      <Toaster position="top-center" />
      <ModalProvider />
      <AlertProvider />
      <SheetProvider />

      <div className="h-full overflow-hidden grid grid-rows-[auto_1fr]">
        <Header />

        <main className="flex flex-col overflow-hidden h-full">
          <div className="border-b flex justify-between gap-2 p-2">
            <TicketSearchForm className="md:max-w-md" />

            <Suspense fallback={<TicketFilterLoading />}>
              <TicketFiltersServer />
            </Suspense>
          </div>
          {children}
        </main>
      </div>
    </>
  )
}

export default AuthedLayout
