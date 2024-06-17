type Props = {
  children: React.ReactNode
}

const AccountLayout = ({ children }: Props) => {
  return <main className="overflow-y-scroll">{children}</main>
}

export default AccountLayout
