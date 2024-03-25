import type { Message } from '@/data'
// import { AvatarImage } from '@radix-ui/react-avatar'
import { format } from 'date-fns'
import { Avatar } from './avatar'
// import { Avatar, AvatarFallback } from './ui/avatar'

type Props = {
  message: Message
}

export const MessageBody = ({ message }: Props) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Avatar imageUrl="https://github.com/christianalares.png" name="Christian Alares" />

        <h1 className="flex items-center justify-between gap-4 font-medium text-lg">{message.from.name}</h1>

        <time className="text-muted text-sm flex items-center gap-2" dateTime={message.date.toISOString()}>
          {format(message.date, 'MMM d - HH:mm')}
        </time>
      </div>

      <div className="mt-2 space-y-2">
        <h2 className="font-medium">{message.subject}</h2>
        <p>{message.body}</p>
      </div>
    </div>
  )
}
