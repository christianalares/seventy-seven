import { AlertProvider } from '@/components/alerts'
import { Header } from '@/components/header'
import { ModalProvider } from '@/components/modals'
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

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1">{children}</div>
      </div>
    </>
  )
}

export default AuthedLayout
