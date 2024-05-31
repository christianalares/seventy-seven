import { EditTicketTagButton } from '@/components/edit-ticket-tag-button'
import { PageWrapper } from '@/components/page-wrapper'
import { usersQueries } from '@/queries/users'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@seventy-seven/ui/table'

const TagsPage = async () => {
  const user = await usersQueries.myCurrentTeam()

  return (
    <PageWrapper>
      <div className="border rounded-xl overflow-hidden">
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
      </div>
    </PageWrapper>
  )
}

export default TagsPage
