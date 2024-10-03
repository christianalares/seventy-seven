import { ChatResponseForm } from '@/components/forms/chat-response-form'
import { TicketChat } from '@/components/ticket-chat'
import { TicketChatHeader } from '@/components/ticket-chat-header'
import { api } from '@/queries'
import { Icon } from '@seventy-seven/ui/icon'
import { Skeleton } from '@seventy-seven/ui/skeleton'

type Props = {
  id: string
}

export const SelectedTicket = async ({ id }: Props) => {
  const ticket = await api.tickets.queries.findById(id)

  if (!ticket) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-muted-foreground text-2xl flex flex-col items-center gap-2">
          <Icon name="mailQuestion" className="size-8" />
          Ticket not found
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <TicketChatHeader ticket={ticket} />
      <TicketChat messages={ticket.messages} />

      <div className="border-t">
        <ChatResponseForm ticketId={ticket.id} />
      </div>
    </div>
  )
}

export const SelectedTicketSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="border-b p-2 md:p-4 flex items-center gap-2">
        <div className="flex-1">
          {/* Subject */}
          <Skeleton className="h-5 w-24" />
          {/* Name */}
          <Skeleton className="h-4 w-1/3 mt-3" />
        </div>

        <div className="ml-auto">
          {/* Actions */}
          <Skeleton className="h-9 w-24" />
        </div>
      </header>

      <ul className="flex flex-col gap-4 m-2 md:m-8 flex-1">
        {/* User message */}
        <li className="border rounded-md p-2 md:p-4 w-[80%] max-w-4xl self-start">
          <div className="flex justify-between text-xs font-medium items-center gap-2">
            <div className="flex items-center gap-2 w-full">
              {/* Avatar */}
              <Skeleton className="size-8 rounded-full" />
              {/* Name */}
              <Skeleton className="h-4 w-1/3" />
              {/* Date */}
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2 mt-4">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </li>

        {/* Handler message */}
        <li className="border rounded-md p-2 md:p-4 w-[80%] max-w-4xl self-end">
          <div className="flex justify-between text-xs font-medium items-center gap-2">
            <div className="flex items-center gap-2 w-full">
              {/* Avatar */}
              <Skeleton className="size-8 rounded-full" />
              {/* Name */}
              <Skeleton className="h-4 w-1/3" />
              {/* Date */}
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2 mt-4">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </li>

        {/* User message */}
        <li className="border rounded-md p-2 md:p-4 w-[80%] max-w-4xl self-start">
          <div className="flex justify-between text-xs font-medium items-center gap-2">
            <div className="flex items-center gap-2 w-full">
              {/* Avatar */}
              <Skeleton className="size-8 rounded-full" />
              {/* Name */}
              <Skeleton className="h-4 w-1/3" />
              {/* Date */}
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2 mt-4">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </li>
      </ul>

      {/* Bottom form */}
      <div className="min-h-60 h-[15vh] border-t">
        <div className="p-4 flex flex-col h-full">
          <div className="flex-1 flex flex-col gap2">
            {/* Label */}
            <Skeleton className="h-3 w-16" />
            {/* Textarea */}
            <Skeleton className="h-36 w-full mt-4" />
          </div>

          {/* Submit button */}
          <div className="mt-4 flex justify-end">
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
