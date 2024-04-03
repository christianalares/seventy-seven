import { ChatResponseForm } from '@/components/forms/chat-response-form'
import { TicketChat } from '@/components/ticket-chat'
import { TicketChatHeader } from '@/components/ticket-chat-header'
import { ticketsQueries } from '@/queries/tickets'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    ticketId: string
  }
}

const TicketPage = async ({ params }: Props) => {
  const ticket = await ticketsQueries.findById(params.ticketId)

  if (!ticket) {
    notFound()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden">
      <TicketChatHeader ticket={ticket} />
      <TicketChat ticket={ticket} />

      <div className="min-h-60 h-[15vh] border-t">
        <ChatResponseForm ticketId={ticket.id} />
      </div>
    </div>
  )
}

export default TicketPage
