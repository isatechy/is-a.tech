"use server"

import { redirect } from "next/navigation"
import { type DNSCreate } from "@/types"
import type Prisma from "@prisma/client"

import { env } from "@/env.mjs"
import { prisma } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { dnsSchemaCompleted, type DnsSchemaCompleted } from "@/validations/dns"

import auth from "@/lib/auth"

export async function createNewDns(
  rawInput: DnsSchemaCompleted
): Promise<
  | "invalid-input"
  | "not-found"
  | "error"
  | "success"
  | "user-notFound"
  | "already-exists"
> {
  const validatedInput = dnsSchemaCompleted.safeParse(rawInput)

  if (!validatedInput.success) return "invalid-input"
  const session = await auth()
  if (!session) {
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)
  }

  if (!session.user.email) {
    return "user-notFound"
  }

  const content =
    validatedInput.data.content ||
    validatedInput.data.url ||
    validatedInput.data.ns ||
    validatedInput.data.ipv4 ||
    validatedInput.data.ipv6

  if (!content) return "invalid-input"

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
    user: { connect: { email: session.user.email } },
  }

  let data = {} as DNSCreate

  try {
    const newDns = {
      content,
      name: `${validatedInput.data.name}.is-a.tech`,
      proxied: validatedInput.data.proxied,
      type: validatedInput.data.type,
      comment: `Domain verification record created by ${session.user.email}`,
      tags: validatedInput.data.tags,
      ttl: validatedInput.data.ttl,
    }

    const result = await fetch(
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

    data = (await result.json()) as DNSCreate

    const message = `[dnsRecord cloudflare] - ${session.user.email}  ${JSON.stringify(data)}`

    await sendToDiscord(message)

    if (data.success === false) {
      const alreadyExistsError = data.errors?.find(
        (error) => error?.code === 81053
      )

      await prisma.error.create({
        data: {
          message,
          createdAt: new Date(),
        },
      })

      if (alreadyExistsError) {
        return "already-exists"
      }

      return "invalid-input"
    }
  } catch (error) {
    await prisma.error.create({
      data: {
        message: `[dnsRecord cloudflare] - ${session.user.email}  ${JSON.stringify(error)}`,
        createdAt: new Date(),
      },
    })
  }

  try {
    await prisma.dnsRecord.create({
      data: {
        ...DataDb,
        cloudflareId: data.result.id,
        zoneId: data.result.zone_id,
      },
    })

    return "success"
  } catch (error) {
    await prisma.error.create({
      data: {
        message: `[dnsRecord prisma] - ${session.user.id}  ${JSON.stringify(error)}`,
        createdAt: new Date(),
      },
    })
    console.log("Error adding dns record", error)
    throw new Error("Error adding dns record")
  }
}

export async function deleteDns(
  id: string
): Promise<"not-found" | "error" | "success"> {
  const session = await auth()
  if (!session) {
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)
  }

  try {
    const dns = await prisma.dnsRecord.findUnique({
      where: { id },
    })

    if (!dns) {
      return "not-found"
    }

    await fetch(
      `https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/dns_records/${dns.cloudflareId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${env.CF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    await prisma.dnsRecord.delete({
      where: { id },
    })

    return "success"
  } catch (error) {
    await prisma.error.create({
      data: {
        message: "[deleteDns]" + JSON.stringify(error),
        createdAt: new Date(),
      },
    })

    return "error"
  }
}

export async function getDnsRecords(): Promise<
  "not-found" | "error" | Prisma.DnsRecord[]
> {
  const session = await auth()
  if (!session) {
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)
  }

  try {
    const dns = await prisma.dnsRecord.findMany({
      where: { userId: session.user.id },
    })

    if (!dns || !dns.length) {
      return "not-found"
    }

    return dns
  } catch (error) {
    await prisma.error.create({
      data: {
        message: "[getDnsRecords]" + JSON.stringify(error),
        createdAt: new Date(),
      },
    })

    return "error"
  }
}

const sendToDiscord = async (message: string) => {
  console.log("sendToDiscord")

  try {
    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.DISCORD_WEBHOOK_TOKEN}`,
      },
      body: JSON.stringify({ "is-a.tech": message }),
    })

    console.log("Discord message sent")
  } catch (error) {
    console.log("error", error)
  }
}
