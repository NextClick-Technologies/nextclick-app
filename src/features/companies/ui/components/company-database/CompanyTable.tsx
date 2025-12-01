"use client";

import { useRouter } from "next/navigation";
import { Company } from "@/features/companies/domain/types";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
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
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto max-h-[calc(100vh-24rem)] overflow-y-auto">
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => handleRowClick(company.id)}
            className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors space-y-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 text-primary" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{company.name}</p>
                {company.industry && (
                  <p className="text-sm text-muted-foreground truncate">
                    {company.industry}
                  </p>
                )}
              </div>
              <Badge variant={getStatusVariant(company.status)}>
                {company.status}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              {company.email && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Email:</span>
                  <span className="truncate">{company.email}</span>
                </div>
              )}
              {company.phoneNumber && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Phone:</span>
                  <span>{company.phoneNumber}</span>
                </div>
              )}
              {company.address && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground text-xs shrink-0">
                    Address:
                  </span>
                  <span className="line-clamp-2">{company.address}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CompanyTable;
