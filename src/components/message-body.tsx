import type { Message } from '@/data'
import { format } from 'date-fns'

type Props = {
  message: Message
}

export const MessageBody = ({ message }: Props) => {
  return (
    <div className="flex-1 m-4">
      <time className="text-muted text-sm" dateTime={message.date.toISOString()}>
        {format(message.date, 'MMM d - HH:mm')}
      </time>
      <h2 className="font-medium text-lg">{message.subject}</h2>
      <p className="mt-4">{message.body}</p>
    </div>
  )
}
