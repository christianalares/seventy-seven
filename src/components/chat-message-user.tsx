import { format } from 'date-fns'

type Props = {
  name: string
  body: string
  date: Date
}

export const ChatMessageUser = ({ name, body, date }: Props) => {
  return (
    <li className="border rounded-md p-4 w-[80%] max-w-4xl self-start">
      <p className="flex justify-between text-xs font-medium">
        <span>{name}</span>
        <time className="text-muted" dateTime={date.toISOString()}>
          {format(date, 'HH:mm')}
        </time>
      </p>
      <p className="mt-2">{body}</p>
    </li>
  )
}
