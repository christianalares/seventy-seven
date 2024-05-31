import { randomInt } from './random'

export const ticketTagColors = [
  '#f9d4f4',
  '#eddee0',
  '#eaface',
  '#f5ebea',
  '#ddeff0',
  '#e9dbf9',
  '#ebface',
  '#f5ebea',
  '#d6f5fb',
  '#ebfce0',
  '#f4e9ea',
  '#d7faf3',
  '#f5e6dc',
  '#f8fcdf',
  '#eae0fa',
  '#e1dff4',
  '#f5eee9',
  '#f5e8dc',
]

export const getRandomTagColor = () => {
  const index = randomInt(0, ticketTagColors.length - 1)
  const color = ticketTagColors[index]!

  return color
}
