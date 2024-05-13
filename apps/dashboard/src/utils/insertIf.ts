export const insertIf = {
  array: <T extends any[]>(...args: [condition: boolean, ...rest: T]) => {
    const [condition, ...rest] = args
    return condition ? rest : []
  },
  object: <T extends Record<string, any>>(condition: boolean, obj: T) => {
    return condition ? obj : {}
  },
}

// const arr: Array<{ a: boolean, b: string }>
