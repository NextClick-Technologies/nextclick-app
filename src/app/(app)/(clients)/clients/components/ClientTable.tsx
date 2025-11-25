"use client";

import { Client } from "@/types/database.type";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Gender } from "@/const";

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="overflow-x-auto max-h-[calc(100vh-32rem)] overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Client
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Title
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Email
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Phone
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Gender
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
                      {client.familyName[0]}
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
                <Badge variant="outline">{client.title}</Badge>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">
                  {client.email || "-"}
                </p>
              </td>
              <td className="py-4">
                <p className="text-sm">{client.phoneNumber}</p>
              </td>
              <td className="py-4">
                <Badge
                  variant={
                    client.gender === Gender.MALE ? "default" : "secondary"
                  }
                >
                  {client.gender}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
