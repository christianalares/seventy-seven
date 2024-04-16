export const pluralize = (nr: number, singular: string, plural: string) => {
  if (nr === 1) {
    return `${nr} ${singular}`
  }

  return `${nr} ${plural}`
}
