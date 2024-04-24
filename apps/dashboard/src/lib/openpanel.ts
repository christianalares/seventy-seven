import { OpenpanelSdk } from '@openpanel/nextjs'

const OPEN_PANEL_CLIENT_ID_SERVER = process.env.OPEN_PANEL_CLIENT_ID_SERVER
const OPEN_PANEL_CLIENT_SECRET_SERVER = process.env.OPEN_PANEL_CLIENT_SECRET_SERVER

if (!OPEN_PANEL_CLIENT_ID_SERVER) {
  throw new Error('OPEN_PANEL_CLIENT_ID_SERVER is required')
}

if (!OPEN_PANEL_CLIENT_SECRET_SERVER) {
  throw new Error('OPEN_PANEL_CLIENT_SECRET_SERVER is required')
}

export const opServerClient = new OpenpanelSdk({
  clientId: OPEN_PANEL_CLIENT_ID_SERVER,
  clientSecret: OPEN_PANEL_CLIENT_SECRET_SERVER,
})
