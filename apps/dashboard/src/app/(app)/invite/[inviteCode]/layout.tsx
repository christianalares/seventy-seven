import { Toaster } from '@seventy-seven/ui/sonner'

type Props = {
  children: React.ReactNode
}

const InviteCodeLayout = ({ children }: Props) => {
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  )
}

export default InviteCodeLayout
