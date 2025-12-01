import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ClientInput } from "@/features/(crm)/clients/services/schemas";

interface JoinDateInputProps {
  register: UseFormRegister<ClientInput>;
  error?: FieldErrors<ClientInput>["joinDate"];
}

export function JoinDateInput({ register, error }: JoinDateInputProps) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-2">
      <Label htmlFor="joinDate">Join Date</Label>
      <Input
        type="date"
        id="joinDate"
        defaultValue={today}
        {...register("joinDate")}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
