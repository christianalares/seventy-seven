import { parseAsString, useQueryState } from 'nuqs'

export const useSelectedTicket = () => {
  const [ticketId, setTicketId] = useQueryState(
    'ticketId',
    parseAsString.withOptions({
      history: 'push',
    }),
  )

  return { ticketId, setTicketId }
}
