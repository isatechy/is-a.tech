"use server"

import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import {
  dnsSchemaWhitEmail,
  type dnsResponseSchema,
  type DnsSchemaWhitEmail,
} from "@/validations/dns"

import auth from "@/lib/auth"

export async function createNewDns(
  rawInput: DnsSchemaWhitEmail
): Promise<
  "invalid-input" | "not-found" | "error" | "success" | "user-notFound"
> {
  const validatedInput = dnsSchemaWhitEmail.safeParse(rawInput)

  if (!validatedInput.success) return "invalid-input"
  const session = await auth()
  if (!session) {
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)
  }

  const content =
    validatedInput.data.content ||
    validatedInput.data.url ||
    validatedInput.data.ns ||
    validatedInput.data.ipv4 ||
    validatedInput.data.ipv6

  if (!content) return "invalid-input"

  try {
    const newDns = {
      content,
      name: `${validatedInput.data.name}.is-a.tech`,
      proxied: validatedInput.data.proxied,
      type: validatedInput.data.type,
      comment: `Domain verification record created for ${validatedInput.data.email}`,
      tags: validatedInput.data.tags,
      ttl: validatedInput.data.ttl,
    }

    const response = await fetch(
      "https://api.cloudflare.com/client/v4/zones/3ebe18b5e8862d24f894cea65bd0d1fe/dns_records",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDns),
      }
    )

    const data = (await response.json()) as typeof dnsResponseSchema

    console.log({ data })
    // add on prisma

    return "success"
  } catch (error) {
    console.error(error)
    throw new Error("Error resending email verification link")
  } finally {
    console.log("DNS record created")
  }
}
