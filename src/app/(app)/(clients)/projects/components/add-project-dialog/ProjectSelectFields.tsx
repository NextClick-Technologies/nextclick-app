import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PaymentTerms,
  ProjectStatus,
  ProjectPriority,
} from "@/types/project.type";
import { Control, Controller } from "react-hook-form";

interface ProjectSelectFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

export function ProjectSelectFields({ control }: ProjectSelectFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="paymentTerms"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentTerms.NET_30D}>
                    Net 30 Days
                  </SelectItem>
                  <SelectItem value={PaymentTerms.NET_60D}>
                    Net 60 Days
                  </SelectItem>
                  <SelectItem value={PaymentTerms.NET_90D}>
                    Net 90 Days
                  </SelectItem>
                  <SelectItem value={PaymentTerms.IMMEDIATE}>
                    Immediate
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProjectStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={ProjectStatus.COMPLETED}>
                    Completed
                  </SelectItem>
                  <SelectItem value={ProjectStatus.ON_HOLD}>On Hold</SelectItem>
                  <SelectItem value={ProjectStatus.CANCELLED}>
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProjectPriority.LOW}>Low</SelectItem>
                <SelectItem value={ProjectPriority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={ProjectPriority.HIGH}>High</SelectItem>
                <SelectItem value={ProjectPriority.URGENT}>Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />
    </>
  );
}
