import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  isPending: boolean;
  onCancel: () => void;
  submitLabel: string;
}

export function FormActions({
  isSubmitting,
  isPending,
  onCancel,
  submitLabel,
}: FormActionsProps) {
  return (
    <div className="flex gap-2 p-6 pt-4 border-t">
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
        {submitLabel}
      </Button>
    </div>
  );
}
