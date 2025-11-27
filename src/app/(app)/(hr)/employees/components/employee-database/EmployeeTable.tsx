"use client";

import { Employee, EmployeeStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const router = useRouter();

  const getStatusVariant = (
    status: EmployeeStatus | null
  ): "default" | "secondary" | "outline" | "destructive" => {
    if (!status) return "outline";

    switch (status) {
      case EmployeeStatus.ACTIVE:
        return "default";
      case EmployeeStatus.INACTIVE:
        return "secondary";
      case EmployeeStatus.ON_LEAVE:
        return "outline";
      case EmployeeStatus.TERMINATED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleRowClick = (employeeId: string) => {
    router.push(`/employees/${employeeId}`);
  };

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-32rem)] overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Employee
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Email
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Phone
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Department
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Position
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {employees.map((employee) => (
            <tr
              key={employee.id}
              onClick={() => handleRowClick(employee.id)}
              className="group hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center overflow-hidden">
                    {employee.photo ? (
                      <Image
                        src={employee.photo}
                        alt={`${employee.name} ${employee.familyName}`}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {employee.name[0]}
                        {employee.familyName?.[0] || ""}
                      </span>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {employee.name} {employee.familyName}
                    </p>
                    {employee.preferredName && (
                      <p className="text-xs text-muted-foreground">
                        ({employee.preferredName})
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">
                  {employee.email}
                </p>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">
                  {employee.phoneNumber}
                </p>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">
                  {employee.department || "-"}
                </p>
              </td>
              <td className="py-4">
                <p className="text-sm text-muted-foreground">
                  {employee.position || "-"}
                </p>
              </td>
              <td className="py-4">
                <Badge variant={getStatusVariant(employee.status)}>
                  {employee.status ? employee.status.replace("_", " ") : "N/A"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
