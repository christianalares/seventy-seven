import { Prisma } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export const cacheExtension = ({ ttl }: { ttl: number }) => {
  const cachedOperations = [
    'findUnique',
    'findMany',
    'findFirst',
    'count',
    'aggregate',
    'groupBy',
    'findUniqueOrThrow',
    'findFirstOrThrow',
  ]

  return Prisma.defineExtension({
    name: 'cache',
    query: {
      $allModels: {
        $allOperations: ({ model, operation, args, query }) => {
          if (!cachedOperations.includes(operation)) {
            return query(args)
          }

          if (!('where' in args)) {
            return query(args)
          }

          const cacheKey = JSON.stringify(args.where)

          const cachedQuery = unstable_cache(
            () => {
              console.log('cache miss', [model, cacheKey])

              return query(args)
            },
            [model, cacheKey],
            {
              tags: [model],
              revalidate: ttl,
            },
          )()

          return cachedQuery
        },
      },
    },
  })
}
