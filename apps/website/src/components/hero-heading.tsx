import Balancer from 'react-wrap-balancer'

export const HeroHeading = () => {
  return (
    <h1 className="leading-none [font-size:clamp(1.875rem,7vw,4.5rem)] text-center mt-16 font-maven-pro font-semibold dark:text-white">
      <Balancer>
        The open-source
        <br />
        alternative to Zendesk
      </Balancer>
    </h1>
  )
}
