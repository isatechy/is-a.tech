import Balancer from "react-wrap-balancer"

import { DnsForm } from "@/components/forms/dns-form"
import TypeAnimation from "@/components/type-animation"

export function DnsSection(): JSX.Element {
  return (
    <section
      id="contact-section"
      aria-label="contact section"
      className="flex size-full items-center justify-center  "
    >
      <div className="container grid max-w-4xl grid-cols-1 justify-center gap-8 md:gap-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              Get&apos;s{" "}
              <span className="bg-gradient-to-r from-primary to-yellow-700 bg-clip-text text-transparent">
                a free DNS record{" "}
              </span>
            </Balancer>
            <span className="block font-rowdies font-bold text-yellow-700">
              <TypeAnimation />
              .is-a.tech{" "}
            </span>
          </h2>
          <h3 className="max-w-2xl text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              Create a DNS record for your domain to verify your ownership
            </Balancer>
          </h3>
        </div>
        <DnsForm />
      </div>
    </section>
  )
}
