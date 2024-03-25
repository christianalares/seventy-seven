import { AccountSubNav } from '@/components/account-sub-nav'

type Props = {
  children: React.ReactNode
}

const AccountLayout = ({ children }: Props) => {
  return (
    <div className="m-8">
      <AccountSubNav />

      <div className="mt-8">{children}</div>
    </div>
  )
}

export default AccountLayout
