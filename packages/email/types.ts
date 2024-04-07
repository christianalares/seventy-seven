export type LastMessage = {
  handler: {
    image_url: string | null
    full_name: string
  } | null
  body: string
  id: string
  created_at: Date
}
