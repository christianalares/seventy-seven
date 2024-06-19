import { PrismaClient } from '@prisma/client'
import { loggingExtension } from './prisma/extensions/loggingExtension'
export * from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['info', 'query'] : [],
  }).$extends(loggingExtension())
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
