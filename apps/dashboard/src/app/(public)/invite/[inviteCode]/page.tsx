import { AcceptInvitationButton } from '@/components/accept-invitation-button'
import { trpc } from '@/trpc/server'
import { Logo } from '@seventy-seven/ui/logo'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { z } from 'zod'

const paramsSchema = z.object({
  inviteCode: z.string(),
})

type Props = {
  params: Record<string, string>
}

const InviteCodePage = async ({ params }: Props) => {
  const parsedParams = paramsSchema.safeParse(params)

  if (!parsedParams.success) {
    notFound()
  }

  const user = await trpc.users.me()

  try {
    const invite = await trpc.invites.get({ inviteCode: parsedParams.data.inviteCode })

    if (!invite) {
      notFound()
    }

    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="mx-4">
          <Logo className="size-16" />

          <div className="mt-4 flex flex-col gap-8 border-2 p-8 rounded-md">
            <div className="flex items-center gap-4">
              {invite.team.image_url && (
                <Image
                  src={invite.team.image_url}
                  alt={invite.team.name}
                  width={200}
                  height={200}
                  className="rounded-full size-16 object-cover"
                />
              )}
              <p className="text-3xl">{invite.team.name}</p>
            </div>
            <hr className="border-border" />
            <div>
              <h1 className="text-xl">Hello, {user.full_name}!</h1>
              <h2 className="mt-2">
                You have been invited to join the team {invite.team.name} by {invite.created_by.full_name}.
              </h2>
            </div>
            <div className="flex justify-end gap-2">
              <AcceptInvitationButton teamId={invite.team_id} />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (_error) {
    notFound()
  }
}

export default InviteCodePage
