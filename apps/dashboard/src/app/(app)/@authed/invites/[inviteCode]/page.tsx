import { prisma } from '@seventy-seven/orm/prisma'
import { notFound } from 'next/navigation'
import { z } from 'zod'

const paramsSchema = z.object({
  inviteCode: z.string(),
})

type Props = {
  params: Record<string, string>
  searchParams: Record<string, string>
}

const InviteCodePage = async ({ params, searchParams }: Props) => {
  const parsedParams = paramsSchema.safeParse(params)

  if (!parsedParams.success) {
    notFound()
  }

  // const invite = await prisma.teamInvite.findUnique({
  //   where: {
  //     code: parsedParams.data.inviteCode,
  //   },
  //   select: {
  //     team_id: true,
  //     email: true,
  //   },
  // })

  return (
    <div className="flex-1 flex justify-center items-center">
      <p>hejsan</p>
    </div>
  )
}

export default InviteCodePage
