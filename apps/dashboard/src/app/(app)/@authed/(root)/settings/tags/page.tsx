import { CreateTagButton } from '@/components/create-tag-button'
import { EditTicketTagButton } from '@/components/edit-ticket-tag-button'
import { PageWrapper } from '@/components/page-wrapper'
import { usersQueries } from '@/queries/users'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@seventy-seven/ui/table'

const TagsPage = async () => {
  const user = await usersQueries.myCurrentTeam()

  return (
    <PageWrapper>
      {user.current_team.ticket_tags.length === 0 ? (
        <div className="flex flex-col">
          <CreateTagButton className="self-end">Create tag</CreateTagButton>
          <p className="border-t mt-4 pt-4">You have not yet created any tags</p>
        </div>
      ) : (
        <div className="flex flex-col">
          <CreateTagButton className="self-end">Create tag</CreateTagButton>

          <div className="border rounded-xl overflow-hidden mt-4">
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
        </div>
      )}
    </PageWrapper>
  )
}

export default TagsPage
