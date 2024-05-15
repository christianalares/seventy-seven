import { ChatResponseForm } from '@/components/forms/chat-response-form'
import { TicketChat } from '@/components/ticket-chat'
import { TicketChatHeader } from '@/components/ticket-chat-header'
import { ticketsQueries } from '@/queries/tickets'
import { notFound } from 'next/navigation'

type Props = {
  id: string
}

const SelectedTicket = async ({ id }: Props) => {
  const ticket = await ticketsQueries.findById(id)

  if (!ticket) {
    notFound()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.36))] overflow-hidden">
      <TicketChatHeader ticket={ticket} />
      <TicketChat messages={ticket.messages} />

      <div className="min-h-60 h-[15vh] border-t">
        <ChatResponseForm ticketId={ticket.id} />
      </div>
    </div>
  )
}

export default SelectedTicket
