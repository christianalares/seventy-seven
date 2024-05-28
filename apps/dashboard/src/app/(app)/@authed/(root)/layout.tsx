import { AlertProvider } from '@/components/alerts'
import { Header } from '@/components/header'
import { ModalProvider } from '@/components/modals'
import { SheetProvider } from '@/components/sheets'
import { Toaster } from '@seventy-seven/ui/sonner'

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

        {children}
      </div>
    </>
  )
}

export default AuthedLayout
