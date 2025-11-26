"use client";

import { useRouter } from "next/navigation";
import { Company } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

interface CompanyTableProps {
  companies: Company[];
}

export function CompanyTable({ companies }: CompanyTableProps) {
  const router = useRouter();

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleRowClick = (companyId: string) => {
    router.push(`/companies/${companyId}`);
  };

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-32rem)] overflow-y-auto">
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
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {companies.map((company) => (
            <tr
              key={company.id}
              onClick={() => handleRowClick(company.id)}
              className="group hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </Avatar>
                  <div>
                    <p className="font-medium">{company.name}</p>
                    {company.industry && (
                      <p className="text-sm text-muted-foreground">
                        {company.industry}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">
                  {company.email || "-"}
                </p>
              </td>
              <td className="py-4">
                <p className="text-sm">{company.phoneNumber || "-"}</p>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground max-w-xs truncate">
                  {company.address || "-"}
                </p>
              </td>
              <td className="py-4">
                <Badge variant={getStatusVariant(company.status)}>
                  {company.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
