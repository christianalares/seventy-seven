import { format } from 'date-fns'
import { Avatar } from './avatar'

type Props = {
  name: string
  avatar?: string
  body: string
  date: Date
}

export const ChatMessageUser = ({ name, avatar, body, date }: Props) => {
  return (
    <li className="border rounded-md p-4 w-[80%] max-w-4xl self-start">
      <div className="flex justify-between text-xs font-medium items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={name} imageUrl={avatar} className="size-8 border" />
          <p className="text-sm">{name}</p>
        </div>

        <time className="text-muted" dateTime={date.toISOString()}>
          {format(date, 'HH:mm')}
        </time>
      </div>

      <p className="mt-2">{body}</p>
    </li>
  )
}
