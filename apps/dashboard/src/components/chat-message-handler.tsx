import { Icon } from '@seventy-seven/ui/icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@seventy-seven/ui/tooltip'
import { format, formatDistance } from 'date-fns'
import { Avatar } from './avatar'

type Props = {
  name: string
  avatar?: string
  body: string
  date: Date
}

export const ChatMessageHandler = ({ name, avatar, body, date }: Props) => {
  return (
    <li className="border rounded-md p-4 w-[80%] max-w-4xl self-end">
      <div className="flex justify-between text-xs font-medium items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={name} imageUrl={avatar} className="size-8 border" />
          <p className="text-sm">{name}</p>
        </div>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <time className="text-muted font-normal" dateTime={date.toISOString()}>
                {formatDistance(date, new Date(), { addSuffix: true })}
              </time>
            </TooltipTrigger>
            <TooltipContent asChild>
              <span className="text-xs font-normal flex items-center gap-2">
                <Icon name="calendar" strokeWidth={2} className="size-3" />
                {format(date, 'PPpp')}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="mt-2">{body}</p>
    </li>
  )
}
