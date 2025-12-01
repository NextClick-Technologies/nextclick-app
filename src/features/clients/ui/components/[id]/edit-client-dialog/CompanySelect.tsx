import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { UpdateClientInput } from "../../../../domain/schemas/client.schema";
import type { Company } from "@/features/companies/domain/types/company.type";

interface CompanySelectProps {
  control: Control<UpdateClientInput>;
  companies: Company[];
  error?: FieldErrors<UpdateClientInput>["companyId"];
}

export function CompanySelect({
  control,
  companies,
  error,
}: CompanySelectProps) {
  return (
    <Controller
      name="companyId"
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <Label htmlFor="companyId">Company</Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
