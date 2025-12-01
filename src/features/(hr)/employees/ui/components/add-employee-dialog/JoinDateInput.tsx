import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldError } from "react-hook-form";

interface JoinDateInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
}

export function JoinDateInput({ register, error }: JoinDateInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="joinDate">Join Date</Label>
      <Input id="joinDate" type="date" {...register("joinDate")} />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
