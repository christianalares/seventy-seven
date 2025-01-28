'use client'

import { useSelectedTicket } from '@/hooks/use-selected-ticket'
import { trpc } from '@/trpc/client'
import { Icon } from '@seventy-seven/ui/icon'
import { Sheet, SheetDescription, SheetHeader, SheetTitle } from '@seventy-seven/ui/sheet'
import { Spinner } from '@seventy-seven/ui/spinner'
import { Avatar } from '../avatar'

export const TicketInfoSheet = () => {
  const { ticketId } = useSelectedTicket()

  const {
    data: ticket,
    isLoading,
    error,
  } = trpc.tickets.findById.useQuery(
    {
      id: ticketId.ticketId!,
    },
    {
      enabled: !!ticketId.ticketId,
    },
  )

  if (isLoading) {
    return (
      <Sheet>
        <SheetHeader>
          <SheetTitle>Ticket info</SheetTitle>
          <SheetDescription>Here is a brief summary of the ticket</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col items-center justify-center h-full gap-2">
          <Spinner />
          <p>Loading ticket info...</p>
        </div>
      </Sheet>
    )
  }

  if (error || !ticket) {
    return (
      <Sheet>
        <SheetHeader>
          <SheetTitle>Ticket info</SheetTitle>
          <SheetDescription>Here is a brief summary of the ticket</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col items-center justify-center h-full gap-2">
          <p className="text-destructive">{error?.message ?? 'Could not fetch ticket'}</p>
        </div>
      </Sheet>
    )
  }

  const lastCustomerMessage = ticket.messages.filter((msg) => !!msg.sent_from_full_name).at(-1)

  return (
    <Sheet>
      <SheetHeader>
        <SheetTitle>Ticket info</SheetTitle>
        <SheetDescription>Here is a brief summary of the ticket</SheetDescription>
      </SheetHeader>

      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium text-sm">Currenty assigned to:</p>
            <div className="flex items-center gap-2">
              {ticket.assigned_to_user ? (
                <>
                  <Avatar
                    name={ticket.assigned_to_user.full_name}
                    imageUrl={ticket.assigned_to_user.image_url ?? undefined}
                    className="size-6"
                  />
                  <span>{ticket.assigned_to_user.full_name}</span>
                </>
              ) : (
                <>
                  <Icon name="user" className="size-6 border border-muted-foreground rounded-full p-px" />
                  <span>Unassigned</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-sm">Customer:</p>
            <div className="flex items-center gap-2">
              {lastCustomerMessage?.sent_from_full_name ? (
                <>
                  <Avatar
                    name={lastCustomerMessage.sent_from_full_name}
                    imageUrl={lastCustomerMessage.sent_from_avatar_url ?? lastCustomerMessage.sent_from_full_name}
                    className="size-6 text-xs"
                  />
                  <span>{lastCustomerMessage.sent_from_full_name}</span>
                </>
              ) : null}
            </div>
          </div>

          {!!ticket.summary && (
            <div className="space-y-2 p-4 border rounded-md">
              <p className="font-medium text-sm flex items-center justify-between">
                <span>Summary:</span>
                <Icon name="sparkles" className="text-fuchsia-500 animate-ping repeat-[2] direction-alternate size-5" />
              </p>
              <p>{ticket.summary}</p>
            </div>
          )}
        </div>
      </div>
    </Sheet>
  )
}
