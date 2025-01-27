'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@seventy-seven/ui/tooltip'
import { format, formatDistance } from 'date-fns'
import { Avatar } from './avatar'
import { pushModal } from './modals'

type Props = {
  id: string
  name: string
  avatar?: string
  body: string
  date: Date
  unableToParseContent: boolean | null
}

export const ChatMessageUser = ({ id, name, avatar, body, date, unableToParseContent }: Props) => {
  return (
    <li className="border rounded-md p-2 md:p-4 w-[80%] max-w-4xl self-start">
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

      {unableToParseContent ? (
        <div className="flex flex-col mt-2 p-2 md:p-4 rounded-md bg-yellow-100/40">
          <Icon name="triangleAlert" className="text-yellow-600 size-5" />
          <p className="text-sm inline-block mt-2">This message contains content that the parser could not extract.</p>
          <Button
            variant="outline"
            className="mt-4 self-start"
            onClick={() => pushModal('viewOriginalMessageContentModal', { message: body, messageId: id })}
          >
            View original content
          </Button>
        </div>
      ) : (
        <p className="mt-2">{body}</p>
      )}
    </li>
  )
}
