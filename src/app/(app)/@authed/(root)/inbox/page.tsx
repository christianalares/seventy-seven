import { TicketsList } from '@/components/tickets-list'
import { prisma } from '@/lib/prisma'
import { getSessionOrThrow } from '@/utils/supabase/session'

const InboxPage = async () => {
  const session = await getSessionOrThrow()

  const me = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  })

  let currentTeamId = me.current_team_id

  if (!me.current_team_id) {
    const firstUserTeam = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            user_id: me.id,
          },
        },
      },
    })

    currentTeamId = firstUserTeam?.id ?? null
  }

  if (!currentTeamId) {
    throw new Error('No team found')
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      team_id: currentTeamId,
    },
    select: {
      id: true,
      created_at: true,
      subject: true,
      sender_full_name: true,
      sender_email: true,
    },
  })

  if (tickets.length === 0) {
    return (
      <div className="flex flex-1 h-full justify-center items-center">
        <p className="text-muted-foreground text-2xl">No tickets found</p>
      </div>
    )
  }

  return <TicketsList tickets={tickets} />
}

export default InboxPage
