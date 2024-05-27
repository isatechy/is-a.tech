import { type NavItem, type NavItemFooter } from "@/types"

const links = {
  github: "https://github.com/isatechy/is-a.tech",
  twitter: "https://x.com/Gantit",
  linkedin: "",
  discord: "",
  authorsWebsite: "https://joca.dev",
  authorsGitHub: "https://github.com/gantit",
  openGraphImage: "https://saasyland.com/images/opengraph-image.png",
}

export const siteConfig = {
  name: "is-a.tech",
  description: "Free DNS for your custom domain. To create a tech culture.",
  links,
  url: "https://is-a.tech",
  author: "is-a.tech",
  hostingRegion: "fra1",
  keywords: [
    "free dns",
    "dns",
    "domain",
    "subdomain",
    "free domain",
    "free subdomain",
  ],
  navItems: [] satisfies NavItem[],
  navItemsMobile: [],
  navItemsFooter: [] satisfies NavItemFooter[],
}
