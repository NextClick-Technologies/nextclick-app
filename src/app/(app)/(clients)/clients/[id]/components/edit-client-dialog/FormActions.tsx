import { Button } from "@/components/ui/button";
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
    <div className="flex gap-2 p-2 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onCancel}
        disabled={isSubmitting || isPending}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="flex-1"
        disabled={isSubmitting || isPending}
      >
        {(isSubmitting || isPending) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Save Changes
      </Button>
    </div>
  );
}
