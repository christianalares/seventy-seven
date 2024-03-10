import { parseAsString, useQueryState } from 'nuqs'

export const useSelectedMessage = () => {
  const [messageId, setMessageId] = useQueryState(
    'messageId',
    parseAsString.withOptions({
      history: 'push',
    }),
  )

  return { messageId, setMessageId }
}
