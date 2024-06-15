import { z } from 'zod'

export const imageTypeSchema = z.union([z.literal('image/jpeg'), z.literal('image/png'), z.literal('image/webp')])
