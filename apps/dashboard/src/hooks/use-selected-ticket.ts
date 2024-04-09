import { parseAsString, useQueryState } from 'nuqs'

export const useSelectedTicket = () => {
  const [ticketId, setTicketId] = useQueryState(
    'ticketId',
    parseAsString.withOptions({
      shallow: false,
      history: 'push',
    }),
  )

  return { ticketId, setTicketId }
}
