// Simplified AddEmployeeDialog - Full implementation with all form fields would go here
// For now, creating a placeholder that can be enhanced with all fields later

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
}: AddEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <div className="py-8 text-center text-muted-foreground">
          <p>Employee creation form</p>
          <p className="text-sm mt-2">
            Full form implementation with all fields coming soon
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="flex-1" disabled>
            <Loader2 className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
