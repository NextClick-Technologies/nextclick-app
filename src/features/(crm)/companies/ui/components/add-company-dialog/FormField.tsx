import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldError } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: FieldError;
}

export function FormField({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register(id)} />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
