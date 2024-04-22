import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as React from 'react'
import { Footer } from '../components/footer'

const baseUrl =
  process.env.VERCEL_ENV === 'production' ? 'https://seventy-seven.dev/email/' : 'http://localhost:3001/email'

type Props = {
  invitedBy: string
  code: string
  team: {
    name: string
    id: string
  }
}

const TeamInvite = ({ invitedBy, code, team }: Props) => {
  const message = `${invitedBy} has invited you to join ${team.name}`
  const ticketUrl =
    process.env.VERCEL_ENV === 'production'
      ? `https://seventy-seven.dev/invite/${code}`
      : `http://localhost:3000/invite/${code}`

  return (
    <Html>
      <Head>
        <Font
          fontFamily="MavenPro"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/mavenpro/v33/7Auup_AqnyWWAxW2Wk3swUz56MS91Eww8fvx5nA.ttf',
            format: 'truetype',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{message}</Preview>
      <title>{message}</title>
      <Tailwind
        config={{
          theme: {
            fontFamily: {
              sans: ['Roboto', 'Verdana', 'sans-serif'],
              'maven-pro': ['Maven Pro', 'sans-serif'],
            },
          },
        }}
      >
        <Body className="bg-[#f3f4f6]">
          <Container className="p-4 bg-white rounded-md">
            <Img src={`${baseUrl}/77-logo.png`} alt="77" className="w-12" />
            <Heading as="h1" className="font-maven-pro text-xl">
              {message}
            </Heading>

            <Text className="text-base">
              You have been invited by {invitedBy} to join the team {team.name} on 77.
            </Text>

            <Button href={ticketUrl} className="border border-solid rounded-md text-black py-2 px-3">
              Join team
            </Button>

            <Hr className="mt-4" />

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

TeamInvite.PreviewProps = {
  invitedBy: 'Donald Duck',
  code: 'abc123',
  team: {
    name: 'Duckberg',
    id: 'def456',
  },
} satisfies Props

export default TeamInvite
