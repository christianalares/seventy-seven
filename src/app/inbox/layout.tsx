import { MessageListItem } from '@/components/message-list-item'
import { messages } from '@/data'

type Props = {
  children: React.ReactNode
}

const InboxLayout = ({ children }: Props) => {
  return (
    <div className="flex h-[calc(100vh-80px)]">
      <div className="border-r w-96 overflow-scroll scrollbar-hide">
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <MessageListItem message={message} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 m-8">{children}</div>
    </div>
  )
}

export default InboxLayout
