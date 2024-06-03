import { revalidatePath } from "next/cache"
import Link from "next/link"
import { deleteDns, getDnsRecords } from "@/actions/dns"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TableCellsAll from "@/components/table-cells-all"

export default async function AccountPage(): Promise<JSX.Element> {
  const alldns = await getDnsRecords()

  const handleDeleteDns = async (
    id: string
  ): Promise<"not-found" | "error" | "success"> => {
    "use server"
    const result = await deleteDns(id)
    if (result === "success") {
      revalidatePath("/dashboard/account")
    }
    return result
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
        <Link
          aria-label="Back to initial page"
          href="/"
          className={buttonVariants({ variant: "default" })}
        >
          Create a new DNS
        </Link>
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
              <TableCellsAll dns={alldns} deleteDns={handleDeleteDns} />
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
