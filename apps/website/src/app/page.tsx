import { Container } from '@/components/container'
import { HeroHeading } from '@/components/hero-heading'
import { Waves } from '@/components/waves'
import { Button } from '@seventy-seven/ui/button'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import productDark from '../../public/img/77-dark.webp'
import productLight from '../../public/img/77-light.webp'

const IndexPage = () => {
  return (
    <div className="relative">
      <div className="h-[60vh] absolute -z-10 top-0 w-screen">
        <Waves />
      </div>

      <Container>
        <HeroHeading />

        <h2 className="leading-normal [font-size:clamp(1.125rem,4vw,1.5rem)] font-abel text-center mt-[min(5vw,3rem)]">
          <Balancer>A modern and simple platform to make customer support extremely easy</Balancer>
        </h2>

        <div className="flex justify-center mt-12">
          <Button
            asChild
            type="button"
            size="xl"
            className="bg-transparent [&:not(:disabled)]:hover:bg-transparent bg-gradient-to-br from-foreground to-foreground/70 shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <a href="https://app.seventy-seven.dev">Try it out</a>
          </Button>
        </div>

        <div className="flex justify-center mt-20">
          <Image
            priority
            src={productLight}
            quality={100}
            alt="Example of dashboard"
            className="border-2 rounded-lg shadow-[0_4px_40px_0_rgba(0,0,0,0.05)] dark:hidden"
          />
          <Image
            priority
            src={productDark}
            quality={100}
            alt="Example of dashboard"
            className="border-2 rounded-lg shadow-[0_4px_40px_0_rgba(0,0,0,0.05)] hidden dark:block"
          />
        </div>
      </Container>
    </div>
  )
}

export default IndexPage
