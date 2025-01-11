import { baseProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace UsersRouter {
  export type GetMaybeMe = RouterOutputs['users']['maybeMe']
}

export const usersRouter = createTRPCRouter({
  maybeMe: baseProcedure.query(async ({ ctx }) => {
    const me = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user?.id,
      },
    })

    return me
  }),
})
