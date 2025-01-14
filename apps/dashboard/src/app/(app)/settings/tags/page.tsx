'use client'

import { CreateTagButton } from '@/components/create-tag-button'
import { TicketTagsTable } from '@/components/ticket-tags-table'
import { trpc } from '@/trpc/client'

const TagsPage = () => {
  const [user] = trpc.users.myCurrentTeam.useSuspenseQuery()

  return (
    <>
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
    </>
  )
}

export default TagsPage
