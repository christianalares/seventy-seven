'use client'

import { trpc } from '@/trpc/client'
import { Icon } from '@seventy-seven/ui/icon'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@seventy-seven/ui/table'
import { InviteCodeBadge } from './invite-code-badge'
import { PendingMemberDropdown } from './pending-member-dropdown'

export const PendingTeamMembers = async () => {
  const [invites] = trpc.teams.invites.useSuspenseQuery()

  if (invites.length === 0) {
    return <p className="border-t pt-4">There are no pending invites on this team</p>
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="sr-only">
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role/Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => (
            <TableRow key={invite.id} className="hover:bg-background">
              <TableCell>{invite.email}</TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  <InviteCodeBadge code={invite.code} />
                  <PendingMemberDropdown inviteId={invite.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const PendingTeamMembersSkeleton = ({ numberOfItems = 3 }: { numberOfItems?: number }) => {
  const items = [...Array(numberOfItems)].map((_, i) => ({ key: i.toString() }))

  return (
    <div className="border rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="sr-only">
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role/Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.key} className="hover:bg-background">
              <TableCell>
                <div className="flex items-center gap-4">
                  <Skeleton className="size-8 rounded-full" />
                  <div>
                    <Skeleton className="w-28 h-4" />
                    <Skeleton className="w-44 h-3 mt-2" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  <Skeleton className="rounded-full w-14 h-6" />
                  <Icon name="moreHorizontal" className="text-muted/60 size-5 animate-pulse" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
