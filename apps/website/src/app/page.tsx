'use client'

import { Container } from '@/components/container'
import { WaitlistForm } from '@/components/waitlist-form'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import productLight from '../../public/img/77-light.png'
import particles from '../../public/img/particles.png'

const IndexPage = () => {
  return (
    <div className="relative">
      <Image
        src={particles}
        alt="particles"
        className="absolute -z-10 top-48 mix-blend-darken dark:mix-blend-exclusion dark:invert"
      />

      <Container>
        <h1 className="leading-none [font-size:clamp(1.875rem,7vw,4.5rem)] text-center mt-16 font-maven-pro font-semibold">
          <Balancer>
            The open-source
            <br />
            alternative to Zendesk
          </Balancer>
        </h1>
        <h2 className="leading-normal [font-size:clamp(1.125rem,4vw,1.5rem)] font-abel text-center mt-[min(5vw,3rem)]">
          <Balancer>A modern and simple platform to make customer support extremely easy</Balancer>
        </h2>

        <div className="flex justify-center mt-[clamp(24px,15vw,140px)]">
          <WaitlistForm />
        </div>

        <div className="flex justify-center mt-[clamp(80px,15vw,10rem)]">
          <Image
            src={productLight}
            alt="Example of dashboard"
            className="border-2 rounded-lg shadow-[0_4px_40px_0_rgba(0,0,0,0.05)]"
          />
        </div>
      </Container>
    </div>
  )
}

export default IndexPage
