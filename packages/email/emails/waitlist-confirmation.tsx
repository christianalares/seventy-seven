import { Body, Container, Font, Head, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components'
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as React from 'react'

const baseUrl =
  process.env.VERCEL_ENV === 'production' ? 'https://seventy-seven.dev/email/' : 'http://localhost:3001/email'

const WaitlistConfirmation = () => {
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
      <Preview>Welcome to 77!</Preview>
      <title>Welcome to 77!</title>
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
            <Text className="text-2xl font-maven-pro">Welcome to Seventy Seven!</Text>

            <Text className="text-base">We're super happy that you are onboard, it means a lot to us! 🙏</Text>
            <Text className="text-base">
              The app is still under development but we'll let you know as soon as there is something that you can try
              out.
            </Text>

            <Text className="text-base">
              Until then, feel free to follow me on 𝕏 to keep you informed about the progress:{' '}
              <Link href="https://twitter.com/c_alares">@c_alares</Link>, I'll frequently post updates about our
              progress.
            </Text>

            <Text className="text-base">
              Also, everything we build is open source:{' '}
              <Link href="https://git.new/seventy-seven">git.new/seventy-seven</Link>
            </Text>

            <Hr />

            <Text className="text-base">
              Kind regards!
              <br />
              Christian Alares @ Seventy Seven
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default WaitlistConfirmation
