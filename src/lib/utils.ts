import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export const getRowdies = async (): Promise<ArrayBuffer> => {
  const response = await fetch(
    new URL("@/config/Rowdies/Rowdies-Regular.ttf", import.meta.url)
  )
  const font = await response.arrayBuffer()
  return font
}
