"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  role?: string | null;
}

interface DeleteTeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteTeamMemberDialog({
  member,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteTeamMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Team Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove &ldquo;{member?.name}{" "}
            {member?.familyName}&rdquo; from this project? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
