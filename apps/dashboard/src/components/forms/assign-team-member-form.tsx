import { trpc } from '@/trpc/client'
import type { TicketsRouter } from '@/trpc/routers/tickets-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { ComboboxDropdown } from '@seventy-seven/ui/combobox-dropdown'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Avatar } from '../avatar'
import { popModal } from '../modals'

const assignTeamMemberFormSchema = z.object({
  teamMemberId: z.string({ required_error: 'Select a team member' }).uuid(),
})

type AssignTeamMemberFormValues = z.infer<typeof assignTeamMemberFormSchema>

type Props = {
  ticket: TicketsRouter.FindById
}

export const AssignTeamMemberForm = ({ ticket }: Props) => {
  const trpcUtils = trpc.useUtils()

  const unassignMutation = trpc.tickets.unassign.useMutation({
    onSuccess: () => {
      trpcUtils.tickets.findById.invalidate()
      trpcUtils.tickets.findMany.invalidate()

      toast.success('Ticket was unassigned')
      popModal('assignTicketModal')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const assignMutation = trpc.tickets.assign.useMutation({
    onSuccess: (updatedTicket) => {
      trpcUtils.tickets.findById.invalidate()
      trpcUtils.tickets.findMany.invalidate()

      toast.success(`Ticket was assigned to ${updatedTicket.assigned_to_user?.full_name}`)
      popModal('assignTicketModal')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm<AssignTeamMemberFormValues>({
    resolver: zodResolver(assignTeamMemberFormSchema),
    defaultValues: {
      teamMemberId: ticket.assigned_to_user?.id,
    },
  })

  const memberItems = ticket.team.members.map((member) => ({
    id: member.user.id,
    label: member.user.full_name,
    imgUrl: member.user.image_url ?? undefined,
  }))

  const onSubmit = form.handleSubmit((values) => {
    assignMutation.mutate({
      ticketId: ticket.id,
      memberId: values.teamMemberId,
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="teamMemberId"
          render={({ field }) => {
            const foundMember = memberItems.find((member) => member.id === field.value)

            return (
              <FormItem>
                <FormControl>
                  <ComboboxDropdown
                    placeholder="Select team member..."
                    searchPlaceholder="Search team member..."
                    emptyResults="No team member found"
                    items={memberItems}
                    selectedItem={foundMember}
                    onSelect={(item) => field.onChange(item.id)}
                    renderSelectedItem={(selectedItem) => (
                      <>
                        <Avatar name={selectedItem.label} imageUrl={selectedItem.imgUrl} className="mr-2 size-6" />
                        <span>{selectedItem.label}</span>
                      </>
                    )}
                    renderListItem={({ isChecked, item }) => {
                      return (
                        <>
                          <Icon name="check" className={cn('size-4 mr-2', isChecked ? 'opacity-100' : 'opacity-0')} />
                          <Avatar name={item.label} imageUrl={item.imgUrl} className="mr-2 size-6" />
                          <span>{item.label}</span>
                        </>
                      )
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <div className="mt-4 flex justify-end gap-2">
          {ticket.assigned_to_user && (
            <Button
              onClick={() => unassignMutation.mutate({ ticketId: ticket.id })}
              type="button"
              variant="destructive"
              disabled={assignMutation.isPending}
              loading={unassignMutation.isPending}
            >
              Unassign
            </Button>
          )}
          <Button type="submit" loading={assignMutation.isPending} disabled={unassignMutation.isPending}>
            Assign
          </Button>
        </div>
      </form>
    </Form>
  )
}
