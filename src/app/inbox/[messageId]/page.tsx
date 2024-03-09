import { MessageBody } from '@/components/message-body'
import { MessagesList } from '@/components/messages-list'
import { messages } from '@/data'

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
    <div className="flex h-[calc(100vh-80px)]">
      <div className="border-r w-96 overflow-scroll scrollbar-hide p-4 hidden md:block">
        <MessagesList />
      </div>

      <MessageBody message={message} />
    </div>
  )
}

export default MessageIdPage
