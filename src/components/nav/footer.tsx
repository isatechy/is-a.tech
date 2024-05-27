import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export function Footer(): JSX.Element {
  return (
    <footer
      id="footer"
      aria-label="footer"
      className="grid gap-8 border-t border-muted-foreground bg-muted py-4"
    >
      <div className="container flex items-center justify-between">
        <p className="text-sm text-muted-foreground xl:text-base">
          <Balancer>
            Built in public by{" "}
            <Link
              href={siteConfig.links.authorsGitHub}
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline-offset-8 transition-all hover:underline hover:opacity-70"
            >
              Joca
            </Link>{" "}
            <span className="hidden md:inline-flex">
              Freely available under the MIT license. Enjoy :)
            </span>
          </Balancer>
        </p>
        <div className="flex items-center justify-center">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "icon", variant: "ghost" }),
              "rounded-full"
            )}
          >
            <Icons.gitHub className="size-[18px]" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
