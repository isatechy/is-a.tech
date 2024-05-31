"use server"

import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { prisma } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { dnsSchemaWhitEmail, type DnsSchemaWhitEmail } from "@/validations/dns"

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

  const email = session.user.email || validatedInput.data.email

  const DataDb = {
    content,
    createdAt: new Date(),
    disabled: false,
    domain: "is-a.tech",
    name: validatedInput.data.name,
    order: 1,
    priority: 1,
    ttl: validatedInput.data.ttl,
    type: validatedInput.data.type,
    updatedAt: new Date(),
    user: {
      connect: {
        email,
      },
    },
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    })

    if (!user) {
      throw new Error(
        `No se encontró un usuario con el correo electrónico: ${email}`
      )
    }

    await prisma.dnsRecord.create({
      data: DataDb,
    })
  } catch (error) {
    await prisma.error.create({
      data: {
        message: "[dnsRecord]" + email + JSON.stringify(error),
        createdAt: new Date(),
      },
    })
    return "error"
  }

  try {
    const newDns = {
      content,
      name: `${validatedInput.data.name}.is-a.tech`,
      proxied: validatedInput.data.proxied,
      type: validatedInput.data.type,
      comment: `Domain verification record created by ${email}`,
      tags: validatedInput.data.tags,
      ttl: validatedInput.data.ttl,
    }

    await fetch(
      `https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDns),
      }
    )

    return "success"
  } catch (error) {
    await prisma.error.create({
      data: {
        message: "[dnsRecord cloudflare]" + email + JSON.stringify(error),
        createdAt: new Date(),
      },
    })

    throw new Error("Error resending email verification link")
  } finally {
    console.log("DNS record created")
  }
}
