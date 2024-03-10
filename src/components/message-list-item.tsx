'use client'

import type { Message } from '@/data'
import { useSelectedMessage } from '@/hooks/useSelectedMessage'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type Props = {
  message: Message
}

export const MessageListItem = ({ message }: Props) => {
  const { messageId, setMessageId } = useSelectedMessage()
  const isActive = messageId === message.id

  const handleOnClick = () => {
    setMessageId(message.id)
  }

  return (
    <button
      type="button"
      onClick={handleOnClick}
      className={cn('relative w-full text-left block p-4 border rounded-md hover:border-border-hover overflow-hidden', {
        'bg-foreground/5': isActive,
      })}
    >
      {!message.read && <span className="absolute top-2 right-2 rounded-full bg-blue-500 size-2" />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src="https://github.com/christianalares.png" alt="@christianalares" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <span>{message.from.name}</span>
        </div>

        <time className="text-muted text-xs" dateTime={message.date.toISOString()}>
          {format(message.date, 'MMM d - HH:mm')}
        </time>
      </div>

      <p className="mt-2">
        <span className="line-clamp-1">{message.subject}</span>
        <span className="mt-2 text-muted line-clamp-2">{message.body}</span>
      </p>
    </button>
  )
}
