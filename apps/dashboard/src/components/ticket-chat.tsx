'use client'

import { useSelectedTicket } from '@/hooks/use-selected-ticket'
import type { TicketsFindById } from '@/queries/tickets'
import { type ElementRef, useEffect, useRef } from 'react'
import { ChatMessageHandler } from './chat-message-handler'
import { ChatMessageUser } from './chat-message-user'

type Props = {
  messages: TicketsFindById['messages']
}

export const TicketChat = ({ messages }: Props) => {
  const { ticketId } = useSelectedTicket()
  const ref = useRef<ElementRef<'div'>>(null)

  useEffect(() => {
    if (ticketId && ref.current) {
      // scroll to bottom in chat
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        // behavior: 'smooth',
      })
    }
  }, [ticketId])

  return (
    <div ref={ref} className="flex-1 overflow-scroll">
      <ul className="flex flex-col gap-4 m-8">
        {messages.map((message) => {
          if (message.handler) {
            return (
              <ChatMessageHandler
                key={message.id}
                date={message.created_at}
                name={message.handler.full_name}
                body={message.body}
                avatar={message.handler.image_url ?? undefined}
              />
            )
          }
          return (
            <ChatMessageUser
              key={message.id}
              date={message.created_at}
              name={message.sent_from_full_name ?? ''}
              body={message.body}
              avatar={message.sent_from_avatar_url ?? undefined}
            />
          )
        })}
      </ul>
    </div>
  )
}
