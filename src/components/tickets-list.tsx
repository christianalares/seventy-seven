import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/supabase/session'
import { TicketListItem } from './ticket-list-item'

export const TicketsList = async () => {
  const sb = createClient()
  const user = await getUser()

  if (!user) {
    return null
  }

  const { data: tickets } = await sb.from('tickets').select('*').eq('team_id', user.current_team_id)

  if (!tickets) {
    return null
  }

  return (
    <ul className="flex flex-col gap-4">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketListItem ticket={ticket} />
        </li>
      ))}
    </ul>
  )
}
