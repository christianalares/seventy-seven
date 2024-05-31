import type { TicketsFindMany } from '@/queries/tickets'
import { Badge } from '@seventy-seven/ui/badge'
import { Icon } from '@seventy-seven/ui/icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@seventy-seven/ui/tooltip'
import { format, isToday } from 'date-fns'
import { Avatar } from './avatar'

type Props = {
  ticket: TicketsFindMany[number]
}

export const TicketListItemBadges = ({ ticket }: Props) => {
  if (
    !ticket.snoozed_until &&
    !ticket.starred_at &&
    !ticket.closed_at &&
    !ticket.isUnhandled &&
    !ticket.assigned_to_user &&
    ticket.tags.length === 0
  ) {
    return null
  }

  return (
    <>
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {ticket.tags.length > 0 && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Icon name="tag" className="size-4" />
                </span>
              </TooltipTrigger>

              <TooltipContent asChild>
                <ul>
                  {ticket.tags.map((tag) => (
                    <li key={tag.id} className="text-xs flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{
                          backgroundColor: tag.color,
                        }}
                      />
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {ticket.snoozed_until && (
          <Badge variant="outline" className="gap-2 font-normal items-center text-muted-foreground">
            {format(ticket.snoozed_until, isToday(ticket.snoozed_until) ? 'HH:mm' : 'MMM dd (HH:mm)')}
            <Icon name="alarmClock" className="size-4 text-orange-500" />
          </Badge>
        )}

        {ticket.starred_at && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Icon name="star" className="size-4 text-amber-500" />
                </span>
              </TooltipTrigger>

              <TooltipContent asChild>
                <span className="text-xs">Starred ticket</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {ticket.closed_at && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Icon name="checkCircle" className="size-4 text-destructive" />
                </span>
              </TooltipTrigger>

              <TooltipContent asChild>
                <span className="text-xs">Closed ticket</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {ticket.isUnhandled && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Icon name="circleDashed" className="size-4 text-blue-500" />
                </span>
              </TooltipTrigger>

              <TooltipContent asChild>
                <span className="text-xs">Unanswered message</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {ticket.assigned_to_user && (
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Avatar
                    name={ticket.assigned_to_user.full_name}
                    imageUrl={ticket.assigned_to_user.image_url ?? undefined}
                    className="size-4"
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent asChild>
                <span className="text-xs">{ticket.assigned_to_user.full_name}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  )
}
