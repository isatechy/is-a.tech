import { getDnsRecords } from "@/actions/dns"
import type Prisma from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Icons } from "@/components/icons"

export default async function AccountPage(): Promise<JSX.Element> {
  const alldns = await getDnsRecords()

  const TableCellsAll = () => {
    if (alldns === "not-found") {
      return <TableCell colSpan={5}>No DNS records found</TableCell>
    } else if (alldns === "error") {
      return <TableCell colSpan={5}>Error fetching DNS records</TableCell>
    } else {
      return alldns.map((dns: Prisma.DnsRecord) => (
        <>
          <TableCell className="font-medium">{`${dns.name}.${dns.domain}`}</TableCell>
          <TableCell>
            <Badge variant="outline">{dns.type}</Badge>
          </TableCell>
          <TableCell>{dns.content}</TableCell>
          <TableCell className="hidden md:table-cell">
            {new Date(dns.createdAt).toLocaleDateString()}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="icon"
                  variant="ghost"
                  className="border-0"
                >
                  <Icons.moreHorizontal className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </>
      ))
    }
  }

  return (
    <Card className="container relative max-w-2xl items-center justify-center p-2">
      <CardHeader className="pb-3">
        <CardTitle>Your DNS</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          Manage your domain names and view their analytics.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>Create a new DNS</Button>
      </CardFooter>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DNS</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCellsAll />
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
