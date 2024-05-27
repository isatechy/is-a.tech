import * as z from "zod"

export const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .min(5, {
    message: "Email must be made of at least 5 characters",
  })
  .max(64, {
    message: "Email must be made of at most 64 characters",
  })
  .email({
    message: "Please enter a valid email address",
  })

export const nameSchema = z
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
  .min(4, {
    message: "Name must be made of at least 4 characters",
  })
  .max(64, {
    message: "Name must be made of at most 64 characters",
  })

export const contactFormSchema = z.object({
  email: emailSchema,
})
export const ipv4Schema = z
  .string()
  .regex(/^(\d{1,3}\.){3}\d{1,3}$/, {
    message: "Please enter a valid IPv4 address",
  })
  .optional()

export const ipv6Schema = z
  .string()
  .regex(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, {
    message: "Please enter a valid IPv6 address",
  })
  .optional()

// url schema  widout http or https
export const urlSchema = z
  .string()
  .regex(/^(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/, {
    message: "Please enter a valid URL",
  })
  .optional()

export const nameVerificationSchema = z.object({
  name: nameSchema,
})

export const markEmailAsVerifiedSchema = z.object({
  token: z.string(),
})

export const checkIfEmailVerifiedSchema = z.object({
  email: emailSchema,
})

export type CheckIfEmailVerifiedInput = z.infer<
  typeof checkIfEmailVerifiedSchema
>

export type ContactFormInput = z.infer<typeof contactFormSchema>

export const TYPES = [
  "CNAME",
  "A",
  "AAAA",
  "TXT",
  "NS",
  // "SRV",
  // "LOC",
  // "MX",
  // "SPF",
  // "CERT",
  // "DNSKEY",
  // "DS",
  // "NAPTR",
  // "SMIMEA",
  // "SSHFP",
  // "TLSA",
  // "URI",
] as const

export type DnsType = (typeof TYPES)[number]

export const dnsSchema = z.object({
  content: z.string(),
  name: nameSchema,
  proxied: z.boolean().default(false),
  type: z.enum(TYPES),
  comment: z.string(),
  tags: z.array(z.string()),
  ttl: z.number().min(1).max(2147483647).default(1),
})

export const dnsResponseSchema = z.object({
  result: z.object({
    id: z.string(),
    zone_id: z.string(),
    zone_name: z.string(),
    name: z.string(),
    type: z.string(),
    content: z.string(),
    proxiable: z.boolean(),
    proxied: z.boolean().default(false),
    ttl: z.number().min(10).max(200),
    locked: z.boolean(),
    meta: z.object({
      auto_added: z.boolean(),
      managed_by_apps: z.boolean(),
      managed_by_argo_tunnel: z.boolean(),
    }),
    comment: z.string(),
    tags: z.array(z.string()),
    created_on: z.date(),
    modified_on: z.date(),
  }),
  success: z.boolean(),
  errors: z.array(z.string()),
  messages: z.array(z.string()),
})

export const dnsSchemaWhitEmail = dnsSchema.extend({
  email: emailSchema,
  ipv4: ipv4Schema,
  ipv6: ipv6Schema,
  url: urlSchema,
  ns: z.string().optional(),
})
export type DnsSchemaWhitEmail = z.infer<typeof dnsSchemaWhitEmail>
