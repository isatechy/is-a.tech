import Link from "next/link"

import { Icons } from "@/components/icons"

export default function Component(): JSX.Element {
  return (
    <div className="flex h-[80dvh] w-full flex-col items-center justify-center bg-background px-4">
      <Icons.ghost className="size-16 text-gray-900 dark:text-gray-200" />
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">
          Sorry, we can&apos;t find that page!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Don&apos;t worry though, everything is STILL AWESOME!
        </p>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="/"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
