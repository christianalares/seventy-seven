import { createAnalyticsClient } from '@seventy-seven/analytics'

const NEXT_PUBLIC_OPENPANEL_WEBSITE_CLIENT_ID = process.env.NEXT_PUBLIC_OPENPANEL_WEBSITE_CLIENT_ID
const OPENPANEL_WEBSITE_CLIENT_SECRET = process.env.OPENPANEL_WEBSITE_CLIENT_SECRET

if (!NEXT_PUBLIC_OPENPANEL_WEBSITE_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_OPENPANEL_WEBSITE_CLIENT_ID is required')
}

if (!OPENPANEL_WEBSITE_CLIENT_SECRET) {
  throw new Error('OPENPANEL_WEBSITE_CLIENT_SECRET is required')
}

export const opServerClient = createAnalyticsClient({
  clientId: NEXT_PUBLIC_OPENPANEL_WEBSITE_CLIENT_ID,
  clientSecret: OPENPANEL_WEBSITE_CLIENT_SECRET,
})
