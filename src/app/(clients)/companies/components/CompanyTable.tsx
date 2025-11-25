"use client"

import { Company } from "@/types/database"
import { Avatar } from "@/components/ui/avatar"
import { Building2 } from "lucide-react"

interface CompanyTableProps {
  companies: Company[]
}

export function CompanyTable({ companies }: CompanyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Company
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Email
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Phone
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Address
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {companies.map((company) => (
            <tr key={company.id} className="group hover:bg-muted/50">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </Avatar>
                  <div>
                    <p className="font-medium">{company.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">{company.email || "-"}</p>
              </td>
              <td className="py-4">
                <p className="text-sm">{company.phoneNumber || "-"}</p>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground max-w-xs truncate">
                  {company.address || "-"}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
