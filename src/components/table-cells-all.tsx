"use client"

import type Prisma from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

const TableCellsAll = ({
  dns,
  deleteDns,
}: {
  dns: "not-found" | "error" | Prisma.DnsRecord[]
  deleteDns: (id: string) => Promise<"not-found" | "error" | "success">
}) => {
  if (dns === "not-found") {
    return (
      <TableRow>
        <TableCell colSpan={5} className=" p-0">
          <div className="flex flex-col items-center justify-center gap-2 space-x-2 border border-dashed border-primary/30 bg-primary/10 p-6">
            <Icons.alertCircle className="size-8" />
            <span>No DNS records found</span>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  if (dns === "error") {
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <div className="flex flex-col items-center justify-center gap-2 space-x-2 border border-dashed border-primary/30 bg-primary/10 p-6">
            <Icons.ghost className="size-8" />
            <span>Failed to fetch DNS records</span>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return dns.map((dns) => (
    <TableRow key={dns.id}>
      <TableCell className="font-medium">{`${dns.name}.${dns.domain}`}</TableCell>
      <TableCell>
        <Badge variant="outline">{dns.type}</Badge>
      </TableCell>
      <TableCell>{dns.content}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(dns.createdAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
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
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => void deleteDns(dns.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ))
}

export default TableCellsAll
