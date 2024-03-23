import { Avatar } from '@/components/avatar'
import { ChatMessageHandler } from '@/components/chat-message-handler'
import { ChatMessageUser } from '@/components/chat-message-user'
import { ChatResponseForm } from '@/components/forms/chat-response-form'
import { TicketChat } from '@/components/ticket-chat'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/utils/supabase/session'
import { format } from 'date-fns'

type Props = {
  params: {
    ticketId: string
  }
}

const TicketPage = async ({ params }: Props) => {
  const user = await getUser()

  let currentTeamId = user.current_team_id

  if (!user.current_team_id) {
    const firstUserTeam = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            user_id: user.id,
          },
        },
      },
    })

    currentTeamId = firstUserTeam?.id ?? null
  }

  if (!currentTeamId) {
    throw new Error('No team found')
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      team_id: currentTeamId,
      id: params.ticketId,
    },
    select: {
      id: true,
      subject: true,
      sender_full_name: true,
      sender_email: true,
      messages: {
        select: {
          created_at: true,
          id: true,
          sent_by_user: {
            select: {
              id: true,
              full_name: true,
              image_url: true,
            },
          },
          body: true,
        },
        orderBy: {
          created_at: 'asc',
        },
      },
    },
  })

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

      {/* <div className="bg-red-500 h-8" /> */}

      <div className="min-h-60 h-[15vh] border-t">
        <ChatResponseForm ticketId={ticket.id} />
      </div>
    </div>
  )
}

export default TicketPage
