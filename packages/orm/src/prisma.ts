import { PrismaClient } from '@prisma/client'
export * from '@prisma/client'
import { cacheExtension } from './prisma/extensions/cacheExtension'

// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

const prismaClientSingleton = () => {
  return new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['info', 'query'] : [],
  }).$extends(cacheExtension({ ttl: 60 }))
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
