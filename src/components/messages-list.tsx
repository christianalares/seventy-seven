import { messages } from '@/data'
import { MessageListItem } from './message-list-item'

export const MessagesList = () => {
  return (
    <ul className="flex flex-col gap-4">
      {messages.map((message) => (
        <li key={message.id}>
          <MessageListItem message={message} />
        </li>
      ))}
    </ul>
  )
}
