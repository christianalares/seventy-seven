import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as React from 'react'
import { Footer } from '../components/footer'

const baseUrl =
  process.env.VERCEL_ENV === 'production' ? 'https://seventy-seven.dev/email/' : 'http://localhost:3001/email'

type Props = {
  company: {
    name: string
    imageUrl?: string
  }
  shortId: string
  subject: string
  message: {
    fullName: string
    createdAt: Date
    avatarUrl?: string
    body: string
  }
  ticketUrl: string
}

const NewTicket = ({ company, shortId, subject, message, ticketUrl }: Props) => {
  let initials = message.fullName.substring(0, 2).toUpperCase()

  const [namePart1, namePart2] = message.fullName.split(' ')

  if (namePart1 && namePart2) {
    initials = `${namePart1.charAt(0)}${namePart2.charAt(0)}`.toUpperCase()
  }

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

      <Preview>You have a new incoming ticket #{shortId}</Preview>

      <title>You have a new incoming ticket #{shortId}</title>

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
          <Container className="p-4 max-w-4xl bg-white rounded-md">
            {company.imageUrl ? (
              <Img src={company.imageUrl} alt="Acme" className="h-16" />
            ) : (
              <Text className="text-4xl">{company.name}</Text>
            )}

            <Text className="font-maven-pro text-2xl">You have a new incoming ticket</Text>
            <Text className="font-maven-pro text-lg flex items-center gap-4 mb-0 mt-8">{subject}</Text>

            <Section className="mt-4">
              <Row>
                <Column width={48}>
                  {message.avatarUrl ? (
                    <Img src={message.avatarUrl} className="w-10 h-10 rounded-full" />
                  ) : (
                    <Text className="bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {initials}
                    </Text>
                  )}
                </Column>
                <Column className="font-bold">{message.fullName}</Column>
                <Column className="text-xs" align="right">
                  {message.createdAt.toLocaleDateString()} - {message.createdAt.toLocaleTimeString()}
                </Column>
              </Row>

              <Row>
                <Text>{message.body}</Text>
              </Row>
            </Section>

            <Section className="mb-12">
              <Row>
                <Button href={ticketUrl} className="border border-solid rounded-md text-black py-2 px-3 mt-4">
                  Go to ticket
                </Button>
              </Row>
            </Section>

            <Hr className="mt-4" />

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

NewTicket.PreviewProps = {
  company: {
    name: 'Acme',
    imageUrl: `${baseUrl}/acme.png`,
  },
  shortId: 'g11on82o65',
  subject: 'This specific thing does not work',
  ticketUrl: 'https://app.seventy-seven.dev/inbox?ticketId=5f1634a6-358e-42dd-8875-e38b383b35da',
  message: {
    body: `Hi! It seems like i can't update me username. I only get the error "Error updating username" and when I click retry, the same error message appears.`,
    createdAt: new Date(),
    fullName: 'Donald Duck',
    avatarUrl: 'https://avatars.githubusercontent.com/u/97747758?v=4',
  },
} satisfies Props

export default NewTicket
