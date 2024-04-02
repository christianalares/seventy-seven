import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuwxyz0123456789', 10)

export const shortId = () => {
  return nanoid()
}
