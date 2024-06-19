import { Prisma } from '@prisma/client'

export const loggingExtension = () => {
  if (process.env.NODE_ENV !== 'development') {
    return Prisma.defineExtension({
      name: 'logging',
    })
  }

  const queryOperations = [
    'findUnique',
    'findMany',
    'findFirst',
    'count',
    'aggregate',
    'groupBy',
    'findUniqueOrThrow',
    'findFirstOrThrow',
  ]

  const mutationOperations = ['create', 'createMany', 'update', 'updateMany', 'upsert', 'delete', 'deleteMany']

  return Prisma.defineExtension({
    name: 'logging',
    query: {
      $allModels: {
        $allOperations: async ({ model, operation, args, query }) => {
          const now = performance.now()
          const results = await query(args)
          const elapsed = performance.now() - now

          const queryType = (() => {
            if (queryOperations.includes(operation)) {
              return '[QUERY]'
            }

            if (mutationOperations.includes(operation)) {
              return '[MUTATION]'
            }

            return ''
          })()

          const loggingResult = `${queryType} ${model}.${operation} took ${elapsed}ms`
          const hr = new Array(loggingResult.length).fill('-').join('')

          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(loggingResult)
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(hr)

          return results
        },
      },
    },
  })
}
