"use client";

import { Client } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="overflow-x-auto">
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
              Email
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Status
            </th>
            <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
              Value
            </th>
            <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
              Projects
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
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <p className="text-sm">{client.company}</p>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </td>
              <td className="py-4">
                <Badge
                  variant={client.status === "active" ? "default" : "secondary"}
                >
                  {client.status}
                </Badge>
              </td>
              <td className="py-4 text-right">
                <p className="font-medium">
                  ${(client.value / 1000).toFixed(0)}K
                </p>
              </td>
              <td className="py-4 text-right">
                <p className="text-sm text-muted-foreground">
                  {client.projects} projects
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
