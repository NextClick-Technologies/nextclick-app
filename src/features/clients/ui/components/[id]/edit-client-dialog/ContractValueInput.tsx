import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import type { UpdateClientInput } from "../../../../domain/schemas";

interface ContractValueInputProps {
  register: UseFormRegister<UpdateClientInput>;
  error?: FieldErrors<UpdateClientInput>["totalContractValue"];
}

export function ContractValueInput({
  register,
  error,
}: ContractValueInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="totalContractValue">Total Contract Value</Label>
      <Input
        type="number"
        id="totalContractValue"
        placeholder="0"
        {...register("totalContractValue", { valueAsNumber: true })}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
