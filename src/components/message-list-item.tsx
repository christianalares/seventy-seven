'use client'

import type { Message } from '@/data'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

type Props = {
  message: Message
}

export const MessageListItem = ({ message }: Props) => {
  const params = useParams<{ messageId: string }>()
  const isActive = params.messageId === message.id
  const router = useRouter()

  const handleOnClick = () => {
    router.push(`/inbox/${message.id}`, { scroll: false })
  }

  return (
    <Link
      // type="button"
      href={`/inbox/${message.id}`}
      onClick={handleOnClick}
      className={cn('w-full text-left block p-4 border rounded-md hover:border-border-hover', {
        'bg-foreground/5': isActive,
      })}
    >
      <p className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          {!message.read && <span className="rounded-full bg-blue-500 size-2" />}
          {message.from.name}
        </span>

        <time className="text-muted text-xs" dateTime={message.date.toISOString()}>
          {format(message.date, 'MMM d - HH:mm')}
        </time>
      </p>

      <p className="mt-2">
        <span className="line-clamp-1">{message.subject}</span>
        <span className="mt-2 text-muted line-clamp-2">{message.body}</span>
      </p>
    </Link>
  )
}
