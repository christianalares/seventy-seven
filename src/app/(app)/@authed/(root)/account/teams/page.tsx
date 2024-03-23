import { CreateTeamButton } from '@/components/create-team-button'
import { PageWrapper } from '@/components/page-wrapper'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/utils/supabase/session'
import { teamRoleEnumToWord } from '@/utils/teamRoleEnumToWord'

const AccountTeamsPage = async () => {
  const user = await getUser()

  const userTeams = await prisma.userOnTeam.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      role: true,
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return (
    <PageWrapper>
      <CreateTeamButton />

      {userTeams.length === 0 ? (
        <p className="mt-4">You don't belong to any team.</p>
      ) : (
        userTeams.map((userTeam) => (
          <div key={userTeam.team.id} className="mt-4 flex items-center justify-between p-4 rounded-md border">
            <div>
              <h2>{userTeam.team.name}</h2>
              <p className="text-sm text-muted-foreground">{teamRoleEnumToWord(userTeam.role)}</p>
            </div>

            <div>
              <Button size="sm" variant="outline">
                Manage
              </Button>
            </div>
          </div>
        ))
      )}
    </PageWrapper>
  )
}

export default AccountTeamsPage
