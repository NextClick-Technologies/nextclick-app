import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import type { UpdateClientInput } from "../../../../services/schemas/client.schema";

interface DateInputProps {
  register: UseFormRegister<UpdateClientInput>;
  error?: FieldErrors<UpdateClientInput>["joinDate"];
}

export function DateInput({ register, error }: DateInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="joinDate">Join Date</Label>
      <Input
        type="date"
        id="joinDate"
        {...register("joinDate")}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
