"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface CompanyInformationProps {
  companyName: string;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  contactPerson: string | null;
  industry: string | null;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function CompanyInformation({
  companyName,
  email,
  phoneNumber,
  address,
  contactPerson,
  industry,
  status,
  onEdit,
  onDelete,
}: CompanyInformationProps) {
  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    if (!status) return "outline";

    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-6">
      {/* Header with Company Name and Action Buttons */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4 sm:mb-0">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-xs">🏢</span>
            </div>
            <h2 className="text-lg font-semibold">{companyName}</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email:</p>
            <p className="text-sm">{email || "No email provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone:</p>
            <p className="text-sm">{phoneNumber || "No phone provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Address:
            </p>
            <p className="text-sm">{address || "No address provided"}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Contact Person:
            </p>
            <p className="text-sm">{contactPerson || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Industry:
            </p>
            <p className="text-sm">{industry || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status:</p>
            <div className="mt-1">
              <Badge variant={getStatusVariant(status)}>
                {status || "N/A"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
