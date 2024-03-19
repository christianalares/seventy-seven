import { AllModals } from '@/components/modals/all-modals'

type Props = {
  children: React.ReactNode
}

const AuthedLayout = ({ children }: Props) => {
  return (
    <>
      <AllModals />
      {children}
    </>
  )
}

export default AuthedLayout
