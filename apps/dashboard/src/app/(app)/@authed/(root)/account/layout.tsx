import { AccountSubNav } from '@/components/account-sub-nav'

type Props = {
  children: React.ReactNode
}

const AccountLayout = ({ children }: Props) => {
  return (
    <main className="overflow-y-scroll">
      <div className="m-4 md:m-8">
        <AccountSubNav />
        <div className="mt-8">{children}</div>
      </div>
    </main>
  )
}

export default AccountLayout
