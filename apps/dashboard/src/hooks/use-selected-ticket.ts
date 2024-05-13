import { ticketIdParsers } from '@/lib/search-params'
import { useQueryStates } from 'nuqs'

export const useSelectedTicket = () => {
  const [ticketId, setTicketId] = useQueryStates(ticketIdParsers, {
    shallow: false,
    history: 'push',
  })

  return { ticketId, setTicketId }
}
