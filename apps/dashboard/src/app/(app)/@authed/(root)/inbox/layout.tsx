type Props = {
  children: React.ReactNode
  inboxHeader: React.ReactNode
}

const InboxLayout = ({ children, inboxHeader }: Props) => {
  return (
    <main className="flex flex-col overflow-hidden h-full">
      {inboxHeader}
      {children}
    </main>
  )
}

export default InboxLayout
