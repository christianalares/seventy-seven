import { PrismaClient } from '@prisma/client/edge'
export * from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { withOptimize } from '@prisma/extension-optimize'

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'development') {
    return new PrismaClient().$extends(withAccelerate()).$extends(withOptimize())
  }

  return new PrismaClient().$extends(withAccelerate())
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
