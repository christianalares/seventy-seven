import { InstallProvider } from '@slack/oauth'

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET
const SLACK_OAUTH_REDIRECT_URL = process.env.SLACK_OAUTH_REDIRECT_URL
const SLACK_STATE_SECRET = process.env.SLACK_STATE_SECRET

if (!SLACK_CLIENT_ID) {
  throw new Error('SLACK_CLIENT_ID is not defined')
}

if (!SLACK_CLIENT_SECRET) {
  throw new Error('SLACK_CLIENT_SECRET is not defined')
}

if (!SLACK_OAUTH_REDIRECT_URL) {
  throw new Error('SLACK_OAUTH_REDIRECT_URL is not defined')
}

if (!SLACK_STATE_SECRET) {
  throw new Error('SLACK_STATE_SECRET is not defined')
}

export const slackInstaller = new InstallProvider({
  clientId: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  stateSecret: SLACK_STATE_SECRET,
})

export const getInstallUrl = ({ teamId, userId }: { teamId: string; userId: string }) => {
  return slackInstaller.generateInstallUrl({
    scopes: ['incoming-webhook', 'chat:write', 'chat:write.public', 'team:read'],
    redirectUri: SLACK_OAUTH_REDIRECT_URL,
    metadata: JSON.stringify({ teamId, userId }),
  })
}
