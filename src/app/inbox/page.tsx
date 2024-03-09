import { MessagesList } from '@/components/messages-list'

const InboxPage = () => {
  return (
    <div className="flex h-[calc(100vh-80px)]">
      <div className="md:border-r md:w-96 overflow-scroll scrollbar-hide p-4">
        <MessagesList />
      </div>

      <p className="hidden md:flex flex-col gap-4 flex-1 h-full items-center justify-center text-2xl text-muted">
        Select a message
      </p>
    </div>
  )
}

export default InboxPage
