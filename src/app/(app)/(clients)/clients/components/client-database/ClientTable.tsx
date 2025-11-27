"use client";

import { Client, ClientStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  const handleRowClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto max-h-[calc(100vh-24rem)] overflow-y-auto">
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
              <tr
                key={client.id}
                onClick={() => handleRowClick(client.id)}
                className="group hover:bg-muted/50 cursor-pointer transition-colors"
              >
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => handleRowClick(client.id)}
            className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors space-y-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {client.name[0]}
                  {client.familyName?.[0] || ""}
                </span>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {client.name} {client.familyName}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {getCompanyName(client.companyId)}
                </p>
              </div>
              <Badge variant={getStatusVariant(client.status)}>
                {client.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Projects</p>
                  <Badge variant="outline" className="mt-1">
                    {getProjectCount(client.id)}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Contract Value
                  </p>
                  <p className="font-medium mt-1">
                    ${(client.totalContractValue ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
