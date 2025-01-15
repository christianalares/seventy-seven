'use client'

import { useRealtimeQuery } from '@/hooks/use-realtime-query'
import { useSelectedTicket } from '@/hooks/use-selected-ticket'
import { trpc } from '@/trpc/client'
import type { TicketsRouter } from '@/trpc/routers/tickets-router'
import { type ElementRef, useEffect, useRef } from 'react'
import { ChatMessageHandler } from './chat-message-handler'
import { ChatMessageUser } from './chat-message-user'

type Props = {
  messages: TicketsRouter.FindById['messages']
}

export const TicketChat = ({ messages }: Props) => {
  const trpcUtils = trpc.useUtils()

  const { ticketId } = useSelectedTicket()
  const ref = useRef<ElementRef<'div'>>(null)
  const isMountedRef = useRef(false)

  useRealtimeQuery(
    {
      event: 'INSERT',
      table: 'messages',
    },
    (payload) => {
      trpcUtils.tickets.findMany.invalidate()
      trpcUtils.tickets.findById.invalidate({ id: payload.new.ticket_id })
    },
  )

  useEffect(() => {
    if (!ticketId || !ref.current || messages.length <= 0) {
      return
    }

    // Scroll to bottom in chat
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: isMountedRef.current ? 'smooth' : 'instant',
    })

    isMountedRef.current = true
  }, [ticketId, messages.length])

  return (
    <div ref={ref} className="flex-1 overflow-scroll">
      <ul className="flex flex-col gap-4 m-2 md:m-8">
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
              id={message.id}
              date={message.created_at}
              name={message.sent_from_full_name ?? ''}
              body={message.body}
              avatar={message.sent_from_avatar_url ?? undefined}
              unableToParseContent={message.unable_to_parse_content}
            />
          )
        })}
      </ul>
    </div>
  )
}
