import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { UseFormRegister, FieldError, RegisterOptions } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  error?: FieldError;
  required?: boolean;
}

export function FormField({
  label,
  id,
  type = "text",
  placeholder,
  register,
  validation,
  error,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, validation)}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
