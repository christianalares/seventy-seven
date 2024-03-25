type Props = {
  children: React.ReactNode
}

const TicketIdLayout = ({ children }: Props) => {
  // theme(spacing.20) refers to the height of the header
  return <main className="h-[calc(100vh-theme(spacing.20))]">{children}</main>
}

export default TicketIdLayout
