import { Rowdies } from "next/font/google"
import localFont from "next/font/local"

export const fontHeading = localFont({
  src: "../../public/fonts/cal-sans-semi-bold.woff2",
  variable: "--font-heading",
})

export const fontRowdies = Rowdies({
  subsets: ["latin"],
  variable: "--font-rowdies",
  weight: ["400", "700"],
})
