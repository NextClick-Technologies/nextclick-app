"use client";

import { Button } from "@/shared/components/ui/button";
import { DialogFooter } from "@/shared/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isPending: boolean;
}

export function FormActions({
  onCancel,
  isSubmitting,
  isPending,
}: FormActionsProps) {
  return (
    <DialogFooter className="pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || isPending}>
        {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </DialogFooter>
  );
}
