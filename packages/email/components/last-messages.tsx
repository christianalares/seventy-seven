import { Column, Hr, Img, Row, Section, Text } from '@react-email/components'
import { cn } from '@seventy-seven/ui/utils'
import type { Message } from '../types'

type Props = {
  messages: Message[]
}

export const LastMessages = ({ messages }: Props) => {
  return (
    <>
      {messages.map((message, i) => {
        const name = message.handler ? message.handler.full_name : message.sent_from_full_name ?? ''

        let initials = name.substring(0, 2).toUpperCase()

        const [namePart1, namePart2] = name.split(' ')

        if (namePart1 && namePart2) {
          initials = `${namePart1.charAt(0)}${namePart2.charAt(0)}`.toUpperCase()
        }

        const isLastMessage = i === 0

        return (
          <Section
            key={message.id}
            className={cn({
              'mt-4': i > 0,
              'opacity-50': !isLastMessage,
            })}
          >
            {message.handler ? (
              <Row>
                <Column width={48}>
                  {message.handler.image_url ? (
                    <Img src={message.handler.image_url} className="w-10 h-10 rounded-full" />
                  ) : (
                    <Text className="bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {initials}
                    </Text>
                  )}
                </Column>
                <Column className="font-bold">{message.handler.full_name}</Column>
                <Column className="text-xs" align="right">
                  {message.created_at.toLocaleDateString()} - {message.created_at.toLocaleTimeString()}
                </Column>
              </Row>
            ) : (
              <Row>
                <Column width={48}>
                  {message.sent_from_avatar_url ? (
                    <Img src={message.sent_from_avatar_url} className="w-10 h-10 rounded-full" />
                  ) : (
                    <Text className="bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {initials}
                    </Text>
                  )}
                </Column>
                <Column className="font-bold">{message.sent_from_full_name}</Column>
                <Column className="text-xs" align="right">
                  {message.created_at.toLocaleDateString()} - {message.created_at.toLocaleTimeString()}
                </Column>
              </Row>
            )}

            <Row>
              <Text className="text-base">{message.body}</Text>
            </Row>

            <Hr
              className={cn({
                'border-t-gray-500 border-t-2': isLastMessage,
              })}
            />
          </Section>
        )
      })}
    </>
  )
}
