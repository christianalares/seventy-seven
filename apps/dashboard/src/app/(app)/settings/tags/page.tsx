import { CreateTagButton } from '@/components/create-tag-button'
import { PageWrapper } from '@/components/page-wrapper'
import { TicketTagsTable } from '@/components/ticket-tags-table'
import { api } from '@/queries'
import { HydrateClient, trpc } from '@/trpc/server'

const TagsPage = async () => {
  const user = await api.users.queries.myCurrentTeam()
  trpc.users.myCurrentTeam.prefetch()

  return (
    <HydrateClient>
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
              <TicketTagsTable />
            </div>
          </div>
        )}
      </PageWrapper>
    </HydrateClient>
  )
}

export default TagsPage
