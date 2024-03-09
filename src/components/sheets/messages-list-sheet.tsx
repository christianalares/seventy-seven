import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { type Message, messages } from '@/data'
import { cn } from '@/lib/utils'
import { useMessagesListSheetStore } from '@/store'
import { format } from 'date-fns'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

type MenuItemProps = {
  message: Message
}

const MessageItem = ({ message }: MenuItemProps) => {
  const { close } = useMessagesListSheetStore()

  const params = useParams<{ messageId: string }>()
  const isActive = params.messageId === message.id
  const router = useRouter()

  const handleOnClick = () => {
    router.push(`/inbox/${message.id}`, { scroll: false })
    close()
  }

  return (
    <li>
      <Link
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
    </li>
  )
}

export const MessagesListSheet = () => {
  const { isOpen, close } = useMessagesListSheetStore()

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent side="left" className="w-[85vw] sm:max-w-xl overflow-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Messages</SheetTitle>
        </SheetHeader>

        <div className="mt-8">
          <nav>
            <ul className="flex flex-col gap-2 ">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
