import { ChatResponseForm } from '@/components/forms/chat-response-form'
import { TicketChat } from '@/components/ticket-chat'
import { ticketsQueries } from '@/utils/supabase/queries/tickets'

type Props = {
  params: {
    ticketId: string
  }
}

const TicketPage = async ({ params }: Props) => {
  const ticket = await ticketsQueries.findById(params.ticketId)

  if (!ticket) {
    throw new Error('No ticket found')
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-4">
        <h1 className="text-xl">{ticket.subject}</h1>
        <span className="text-sm text-muted-foreground">
          {ticket.sender_full_name} - {ticket.sender_email}
        </span>
      </header>

      <div className="flex-1 overflow-auto">
        <TicketChat ticket={ticket} />
      </div>

      <div className="min-h-60 h-[15vh] border-t">
        <ChatResponseForm ticketId={ticket.id} />
      </div>
    </div>
  )
}

export default TicketPage
