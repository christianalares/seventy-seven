import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

type Props = {
  params: {
    ticketId: string
  }
}

const TicketPage = async ({ params }: Props) => {
  const sb = createClient()

  const { data: ticket } = await sb.from('tickets').select('*').eq('id', params.ticketId).single()

  const { data: messages } = await sb
    .from('messages')
    .select(`
    *,
    sent_by_user:users(id, full_name, image_url)
  `)
    .eq('ticket_id', params.ticketId)
    .order('created_at')

  if (!messages || !ticket) {
    return null
  }

  return (
    <div className="m-8">
      <h1 className="text-xl border-b pb-8 text-center">
        {ticket.subject}
        <br />
        <span className="text-sm text-muted-foreground">
          {ticket.sender_full_name} - {ticket.sender_email}
        </span>
      </h1>

      <ul className="flex flex-col gap-4 mt-8">
        {messages.map((message) => {
          return (
            <li
              key={message.id}
              className={cn('border rounded-md p-4 max-w-[80%]', {
                'self-end': !!message.sent_by_user_id,
                'self-start': !message.sent_by_user_id,
              })}
            >
              <p className="text-xs font-medium">
                {message.sent_by_user ? message.sent_by_user.full_name : ticket.sender_full_name}
              </p>
              <p className="mt-2">{message.body}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TicketPage
