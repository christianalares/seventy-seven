'use client'

import { useSelectedTicket } from '@/hooks/use-selected-ticket'
import type { TicketsRouter } from '@/trpc/routers/tickets-router'
import { createClient } from '@seventy-seven/supabase/clients/client'
import { useRouter } from 'next/navigation'
import { type ElementRef, useEffect, useRef } from 'react'
import { ChatMessageHandler } from './chat-message-handler'
import { ChatMessageUser } from './chat-message-user'

type Props = {
  messages: TicketsRouter.FindById['messages']
}

export const TicketChat = ({ messages }: Props) => {
  const router = useRouter()
  const supabase = createClient()

  const { ticketId } = useSelectedTicket()
  const ref = useRef<ElementRef<'div'>>(null)
  const isMountedRef = useRef(false)

  useEffect(() => {
    const channel = supabase
      .channel('realtime_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (_payload) => {
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

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
