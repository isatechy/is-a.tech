"use client"

import * as React from "react"
import { createNewDns } from "@/actions/dns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  dnsSchemaCompleted,
  TYPES,
  type DnsSchemaCompleted,
  type DnsType,
} from "@/validations/dns"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

export function DnsForm(): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [defaultType, setDefaultType] = React.useState<DnsType>("CNAME")

  const form = useForm<DnsSchemaCompleted>({
    resolver: zodResolver(dnsSchemaCompleted),
    defaultValues: {
      name: "",
      content: "",
      type: "CNAME",
      proxied: false,
      comment: "",
      tags: [],
      ttl: 1,
    },
  })

  const onSubmit = (formData: DnsSchemaCompleted): void => {
    startTransition(async () => {
      try {
        const message = await createNewDns(formData)

        console.log({ message })

        switch (message) {
          case "success":
            toast({
              title: "Thank you!",
              description: "Your message has been sent",
            })
            form.reset()
            break
          case "invalid-input":
            toast({
              title: "error",
              description: "Dns Exist",
              variant: "destructive",
            })
            break
          default:
            toast({
              title: "need to login",
              description: "please login to create a new dns",
              variant: "destructive",
            })
        }
      } catch (error) {
        console.error({ error })
        toast({
          description: "Something went wrong. Please try again",
          variant: "destructive",
        })
      }
    })
  }

  const handleTypeChange = ({ element }: { element: DnsType }): void => {
    form.resetField("content")
    form.resetField("ipv4")
    form.resetField("ipv6")
    form.resetField("url")
    form.resetField("ns")
    setDefaultType(element)
    form.setValue("type", element)
  }

  const ttlValues = [
    {
      name: "Automatic",
      value: 1,
    },
    {
      name: "1 min",
      value: 60000,
    },
    {
      name: "2 min",
      value: 120000,
    },
    {
      name: "5 min",
      value: 300000,
    },
    {
      name: "10 min",
      value: 600000,
    },
    {
      name: "15 min",
      value: 900000,
    },
    {
      name: "30 min",
      value: 1800000,
    },
    {
      name: "1 h",
      value: 3600000,
    },
    {
      name: "2 h",
      value: 7200000,
    },
    {
      name: "5 h",
      value: 18000000,
    },
    {
      name: "10 h",
      value: 36000000,
    },
    {
      name: "12 h",
      value: 43200000,
    },
    {
      name: "1 day",
      value: 86400000,
    },
  ]

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-8"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="grid w-full gap-8 md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e)
                    handleTypeChange({ element: e as DnsType })
                  }}
                  defaultValue={defaultType}
                >
                  <FormControl className="h-12">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified DNS to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TYPES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of DNS record you want to create
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name (
                  <span className="text-sm text-yellow-400">required</span>)
                </FormLabel>
                <FormControl className="h-12">
                  <Input type="text" placeholder="john" required {...field} />
                </FormControl>
                <FormDescription>
                  <span className="text-sm">
                    {`E.g. ${form.getValues("name").toLowerCase() || "john"}.is-a.tech`}
                  </span>
                </FormDescription>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          {form.getValues("type") === "CNAME" && (
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Target (
                    <span className="text-sm text-yellow-400">required</span>)
                  </FormLabel>

                  <FormControl className="h-12">
                    <Input
                      type="text"
                      placeholder="john"
                      required={form.getValues("type") === "CNAME"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <span className="text-sm">E.g. www.example.com</span>
                  </FormDescription>
                  <FormMessage className="pt-2 sm:text-sm" />
                </FormItem>
              )}
            />
          )}

          {form.getValues("type") === "A" && (
            <FormField
              control={form.control}
              name="ipv4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    IPv4 address (
                    <span className="text-sm text-yellow-400">required</span>)
                  </FormLabel>

                  <FormControl className="h-12">
                    <Input
                      type="text"
                      placeholder="10.10.10.10"
                      required={form.getValues("type") === "A"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pt-2 sm:text-sm" />
                </FormItem>
              )}
            />
          )}

          {form.getValues("type") === "AAAA" && (
            <FormField
              control={form.control}
              name="ipv6"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    IPv6 address (
                    <span className="text-sm text-yellow-400">required</span>)
                  </FormLabel>

                  <FormControl className="h-12">
                    <Input
                      type="text"
                      placeholder="2345:0425:2CA1:0000:0000:0567:5673:23b5"
                      required={form.getValues("type") === "AAAA"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pt-2 sm:text-sm" />
                </FormItem>
              )}
            />
          )}

          {form.getValues("type") === "NS" && (
            <FormField
              control={form.control}
              name="ns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nameserver (
                    <span className="text-sm text-yellow-400">required</span>)
                  </FormLabel>

                  <FormControl className="h-12">
                    <Input
                      type="text"
                      placeholder="john"
                      required={form.getValues("type") === "NS"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <span className="text-sm">
                      {`E.g. ${form.getValues("name").toLowerCase() || "john"}.is-a.tech`}
                    </span>
                  </FormDescription>
                  <FormMessage className="pt-2 sm:text-sm" />
                </FormItem>
              )}
            />
          )}

          {form.getValues("type") === "TXT" && (
            <>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Content (
                      <span className="text-sm text-yellow-400">required</span>)
                    </FormLabel>

                    <FormControl className="h-20">
                      <Textarea
                        {...field}
                        placeholder="john"
                        className="text-base"
                        required={form.getValues("type") === "TXT"}
                      />
                    </FormControl>
                    <FormMessage className="pt-2 sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ttl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TTL</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={"1"}>
                      <FormControl className="h-12">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ttlValues.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button
          variant="outline"
          className="h-14 border bg-primary text-lg font-bold tracking-wide text-secondary hover:opacity-70"
          disabled={isPending}
        >
          {isPending && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          {isPending ? "Sending..." : "Send"}
          <span className="sr-only">Submit a new dns</span>
        </Button>
      </form>
    </Form>
  )
}
