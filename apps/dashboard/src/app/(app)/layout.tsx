import { AlertProvider } from '@/components/alerts'
import { AnalyticsSetProfile } from '@/components/analytics-set-profile'
import { Header } from '@/components/header'
import { ModalProvider } from '@/components/modals'
import { SheetProvider } from '@/components/sheets'
import { HydrateClient, trpc } from '@/trpc/server'
import { Toaster } from '@seventy-seven/ui/sonner'

type Props = {
  children: React.ReactNode
}

const AuthedLayout = ({ children }: Props) => {
  trpc.users.me.prefetch()

  return (
    <>
      <HydrateClient>
        <Toaster position="top-center" />
        <ModalProvider />
        <AlertProvider />
        <SheetProvider />

        <AnalyticsSetProfile />

        <div className="h-full overflow-hidden grid grid-rows-[auto_1fr]">
          <Header />

          {children}
        </div>
      </HydrateClient>
    </>
  )
}

export default AuthedLayout
