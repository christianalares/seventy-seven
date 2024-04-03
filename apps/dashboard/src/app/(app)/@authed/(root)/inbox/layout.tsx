import { TicketsListV2 } from '@/components/tickets-list'

type Props = {
  children: React.ReactNode
}

const InboxLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <div className="h-[calc(100vh-theme(spacing.20))] overflow-y-scroll border-r w-[35vw] max-w-lg min-w-96 p-4">
        <TicketsListV2 />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default InboxLayout
