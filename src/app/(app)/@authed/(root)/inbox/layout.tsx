type Props = {
  children: React.ReactNode
}

const InboxLayout = ({ children }: Props) => {
  return <main className="m-8">{children}</main>
}

export default InboxLayout
