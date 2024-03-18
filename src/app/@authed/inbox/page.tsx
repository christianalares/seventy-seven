'use client'

import { MessageBody } from '@/components/message-body'
import { MessagesList } from '@/components/messages-list'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { messages } from '@/data'
import { useSelectedMessage } from '@/hooks/useSelectedMessage'
import { cn } from '@/lib/utils'
import { useMessagesListSheetStore } from '@/store'

const InboxPage = () => {
  const { open: openMessageListSheet } = useMessagesListSheetStore()
  const { messageId } = useSelectedMessage()

  const currentMessage = messages.find((message) => message.id === messageId)

  return (
    <div>
      <div className="px-4 md:px-6 border-b flex items-center gap-2 h-16 bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={openMessageListSheet}
          className={cn('text-primary/50 md:hidden', {
            hidden: !messageId,
          })}
        >
          <Icon name="list" />
        </Button>

        <p>Filters etc...</p>
      </div>

      <div className="flex h-[calc(100vh-144px)]">
        <div
          className={cn('md:w-[clamp(384px,35vw,600px)] overflow-auto md:border-r p-4', {
            'hidden md:block': !!messageId,
          })}
        >
          <MessagesList />
        </div>
        <div
          className={cn('md:flex-1', {
            'hidden md:block': !messageId,
          })}
        >
          {currentMessage ? (
            <div>
              <div className="h-12 px-4 text-sm border-b flex items-center">Controls etc...</div>
              <div className="p-4">
                <MessageBody message={currentMessage} />
              </div>
            </div>
          ) : (
            <p className="hidden md:flex flex-col gap-4 flex-1 h-full items-center justify-center text-2xl text-muted">
              Select a message
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default InboxPage
