"use client";

import {
  Employee,
  EmployeeStatus,
} from "../../../services/types/employee.type";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar } from "@/shared/components/ui/avatar";
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
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto max-h-[calc(100vh-24rem)] overflow-y-auto">
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
                    {employee.status
                      ? employee.status.replace("_", " ")
                      : "N/A"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {employees.map((employee) => (
          <div
            key={employee.id}
            onClick={() => handleRowClick(employee.id)}
            className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors space-y-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {employee.photo ? (
                  <Image
                    src={employee.photo}
                    alt={`${employee.name} ${employee.familyName}`}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-medium">
                    {employee.name[0]}
                    {employee.familyName?.[0] || ""}
                  </span>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {employee.name} {employee.familyName}
                </p>
                {employee.preferredName && (
                  <p className="text-sm text-muted-foreground truncate">
                    ({employee.preferredName})
                  </p>
                )}
              </div>
              <Badge variant={getStatusVariant(employee.status)}>
                {employee.status ? employee.status.replace("_", " ") : "N/A"}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Email:</span>
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Phone:</span>
                <span>{employee.phoneNumber}</span>
              </div>
              {employee.department && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Dept:</span>
                  <span>{employee.department}</span>
                </div>
              )}
              {employee.position && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    Position:
                  </span>
                  <span>{employee.position}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default EmployeeTable;
