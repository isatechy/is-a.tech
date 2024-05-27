import { DnsSection } from "@/components/sections/dns-section"

export default function LandingPage(): JSX.Element {
  return (
    <div className="grid size-full grid-cols-1 items-center justify-center gap-16 md:gap-32">
      <DnsSection />
    </div>
  )
}
