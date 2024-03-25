import { Header } from '@/components/header'
import { AllModals } from '@/components/modals/all-modals'
import { AllSheets } from '@/components/sheets/all-sheets'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@seventy-seven/ui/sonner'

type Props = {
  children: React.ReactNode
}

const AuthedLayout = ({ children }: Props) => {
  return (
    <>
      <Toaster position="top-center" />
      <AllModals />
      <AllSheets />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}

export default AuthedLayout
