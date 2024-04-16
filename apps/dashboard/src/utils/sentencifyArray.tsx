export const sentencifyArray = (items: string[]) => {
  if (items.length === 0) {
    return ''
  }

  if (items.length === 1) {
    return items[0] ?? ''
  }

  const lastItem = items.pop()
  return `${items.join(', ')} and ${lastItem}`
}
