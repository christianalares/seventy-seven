import { TriggerClient } from '@trigger.dev/sdk'

export const jobsClient = new TriggerClient({
  id: 'dashboard-3XzR',
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
})
