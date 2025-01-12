'use client'

import { trpc } from '@/trpc/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@seventy-seven/ui/table'
import { EditTicketTagButton } from './edit-ticket-tag-button'

export const TicketTagsTable = () => {
  const [user] = trpc.users.myCurrentTeam.useSuspenseQuery()

  return (
    <Table>
      <TableHeader className="sr-only">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {user.current_team.ticket_tags.map((tag) => (
          <TableRow key={tag.id} className="hover:bg-background">
            <TableCell className="py-2 px-4">
              <div className="flex items-center gap-2">
                <div className="size-4 rounded-full" style={{ backgroundColor: tag.color }} />
                <span>{tag.name}</span>
              </div>
            </TableCell>
            <TableCell className="p-2" align="right">
              <EditTicketTagButton tag={tag} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
