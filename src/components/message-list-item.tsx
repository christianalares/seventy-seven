'use client'

import type { Message } from '@/data'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type Props = {
  message: Message
}

export const MessageListItem = ({ message }: Props) => {
  const segment = useSelectedLayoutSegment()
  const isActive = segment === message.id

  return (
    <Link
      href={`/inbox/${message.id}`}
      className={cn('block p-4 m-4 border rounded-md hover:border-border-hover', {
        'bg-foreground/5': isActive,
      })}
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2">
          {!message.read && <span className="rounded-full bg-blue-500 size-2" />}
          {message.from.name}
        </p>
        <time className="text-muted text-xs" dateTime={message.date.toISOString()}>
          {format(message.date, 'MMM d - HH:mm')}
        </time>
      </div>

      <div className="mt-2">
        <p className="truncate">{message.subject}</p>
        <p className="mt-2 text-muted line-clamp-2">{message.body}</p>
      </div>
    </Link>
  )
}
