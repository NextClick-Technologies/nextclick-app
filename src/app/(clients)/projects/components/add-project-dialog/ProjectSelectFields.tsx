import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentTerms, ProjectStatus, ProjectPriority } from "@/const";

interface ProjectSelectFieldsProps {
  paymentTerms: (typeof PaymentTerms)[keyof typeof PaymentTerms];
  status: (typeof ProjectStatus)[keyof typeof ProjectStatus];
  priority: (typeof ProjectPriority)[keyof typeof ProjectPriority];
  onPaymentTermsChange: (
    value: (typeof PaymentTerms)[keyof typeof PaymentTerms]
  ) => void;
  onStatusChange: (
    value: (typeof ProjectStatus)[keyof typeof ProjectStatus]
  ) => void;
  onPriorityChange: (
    value: (typeof ProjectPriority)[keyof typeof ProjectPriority]
  ) => void;
}

export function ProjectSelectFields({
  paymentTerms,
  status,
  priority,
  onPaymentTermsChange,
  onStatusChange,
  onPriorityChange,
}: ProjectSelectFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select
            value={paymentTerms}
            onValueChange={(value) =>
              onPaymentTermsChange(
                value as (typeof PaymentTerms)[keyof typeof PaymentTerms]
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PaymentTerms.NET_30D}>Net 30 Days</SelectItem>
              <SelectItem value={PaymentTerms.NET_60D}>Net 60 Days</SelectItem>
              <SelectItem value={PaymentTerms.NET_90D}>Net 90 Days</SelectItem>
              <SelectItem value={PaymentTerms.IMMEDIATE}>Immediate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange(
                value as (typeof ProjectStatus)[keyof typeof ProjectStatus]
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProjectStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={ProjectStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={ProjectStatus.ON_HOLD}>On Hold</SelectItem>
              <SelectItem value={ProjectStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={priority}
          onValueChange={(value) =>
            onPriorityChange(
              value as (typeof ProjectPriority)[keyof typeof ProjectPriority]
            )
          }
        >
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
    </>
  );
}
