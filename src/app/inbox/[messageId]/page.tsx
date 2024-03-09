import { messages } from '@/data'
import { format } from 'date-fns'

type Props = {
  params: {
    messageId: string
  }
}

const MessageIdPage = ({ params }: Props) => {
  const message = messages.find((message) => message.id === params.messageId)

  if (!message) {
    return null
  }

  return (
    <div>
      <time className="text-muted text-sm" dateTime={message.date.toISOString()}>
        {format(message.date, 'MMM d - HH:mm')}
      </time>
      <h2 className="font-medium text-lg">{message.subject}</h2>
      <p className="mt-4">{message.body}</p>
    </div>
  )
}

export default MessageIdPage
