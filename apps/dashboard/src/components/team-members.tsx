import { usersQueries } from '@/queries/users'
import { getRoleName } from '@/utils/get-role-name'
import { Badge } from '@seventy-seven/ui/badge'
import { Icon } from '@seventy-seven/ui/icon'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@seventy-seven/ui/table'
import { Avatar } from './avatar'
import { TeamActionsDropdown } from './team-actions-dropdown'

export const TeamMembers = async () => {
  const user = await usersQueries.myCurrentTeam()

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
          {user.current_team.members.map((member) => (
            <TableRow key={member.user.id} className="hover:bg-background">
              <TableCell>
                <div className="flex items-center gap-4">
                  <Avatar
                    name={member.user.full_name}
                    imageUrl={member.user.image_url ?? undefined}
                    className="size-8"
                  />
                  <div>
                    <p>{member.user.full_name}</p>
                    <p className="text-xs text-muted">{member.user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {getRoleName(member.role)}
                  </Badge>
                  <TeamActionsDropdown member={member} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const TeamMembersSkeleton = ({ numberOfItems = 3 }: { numberOfItems?: number }) => {
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
