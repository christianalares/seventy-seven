import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Icon } from './ui/icon'

type Message = {
  id: string
  from: {
    name: string
    email: string
  }
  subject: string
  date: string
  body: string
  read: boolean
}

type Props = {
  message: Message
}

export const Message = ({ message }: Props) => {
  return (
    <Link href="/">
      <Card className="relative hover:border-gray-700">
        <CardHeader>
          <CardTitle
            className={cn('flex items-center gap-2', {
              'opacity-30': message.read,
            })}
          >
            <Icon name={message.read ? 'mailOpen' : 'mail'} className={cn('size-4')} />
            {message.from.name}
          </CardTitle>
          <CardDescription>{message.subject}</CardDescription>
        </CardHeader>

        <CardContent>{message.body}</CardContent>
      </Card>
    </Link>
  )
}
