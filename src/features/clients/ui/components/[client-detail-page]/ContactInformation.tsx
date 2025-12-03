"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ClientStatus } from "@/features/clients/domain/types";
import Link from "next/link";

interface ContactInformationProps {
  clientName: string;
  familyName: string;
  email: string | null;
  phoneNumber: string;
  contactPerson: string;
  status: ClientStatus;
  joinDate: string | null;
  companyName: string;
  companyId: string | null;
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function ContactInformation({
  clientName,
  familyName,
  email,
  phoneNumber,
  contactPerson,
  status,
  joinDate,
  companyName,
  companyId,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: ContactInformationProps) {
  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      case "pending":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <Card className="p-6">
      {/* Header with Client Name and Action Buttons */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4 sm:mb-0">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-xs">✉</span>
            </div>
            <h2 className="text-lg font-semibold">
              {clientName} {familyName}
            </h2>
          </div>
          {(canEdit || canDelete) && (
            <div className="hidden sm:flex items-center gap-2">
              {canEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
        {(canEdit || canDelete) && (
          <div className="flex sm:hidden items-center gap-2">
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex-1"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email:</p>
          <p className="text-sm">{email || "No email provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Phone:</p>
          <p className="text-sm">{phoneNumber}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Contact Person:
          </p>
          <p className="text-sm">{contactPerson}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status:</p>
          <Badge className={getStatusColor(status)}>{status}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Join Date:
          </p>
          <p className="text-sm">
            {joinDate ? new Date(joinDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Company:</p>
          {companyId ? (
            <Link
              href={`/companies/${companyId}`}
              className="text-sm text-primary hover:underline"
            >
              {companyName}
            </Link>
          ) : (
            <p className="text-sm">{companyName}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
