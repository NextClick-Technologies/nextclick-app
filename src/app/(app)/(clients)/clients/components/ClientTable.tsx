"use client";

import { Client, ClientStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface ClientTableProps {
  clients: Client[];
  companies?: { id: string; name: string }[];
  projectCounts?: { clientId: string; count: number }[];
}

export function ClientTable({
  clients,
  companies = [],
  projectCounts = [],
}: ClientTableProps) {
  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return "-";
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "-";
  };

  const getProjectCount = (clientId: string) => {
    const projectCount = projectCounts.find((pc) => pc.clientId === clientId);
    return projectCount?.count || 0;
  };

  const getStatusVariant = (
    status: ClientStatus
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case ClientStatus.ACTIVE:
        return "default";
      case ClientStatus.INACTIVE:
        return "secondary";
      case ClientStatus.PENDING:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-32rem)] overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Client
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Company
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Total Projects
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Total Contract Value
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {clients.map((client) => (
            <tr key={client.id} className="group hover:bg-muted/50">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {client.name[0]}
                      {client.familyName?.[0] || ""}
                    </span>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {client.name} {client.familyName}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">
                  {getCompanyName(client.companyId)}
                </p>
              </td>
              <td className="py-4">
                <Badge variant="outline">{getProjectCount(client.id)}</Badge>
              </td>
              <td className="py-4">
                <p className="text-sm font-medium">
                  ${(client.totalContractValue ?? 0).toLocaleString()}
                </p>
              </td>
              <td className="py-4">
                <Badge variant={getStatusVariant(client.status)}>
                  {client.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
