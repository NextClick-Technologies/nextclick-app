import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  UseFormRegister,
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  register: UseFormRegister<any> | UseFormRegisterReturn;
  validation?: Record<string, any>;
  error?: FieldError;
  required?: boolean;
}

export function FormField({
  label,
  id,
  type = "text",
  placeholder,
  register,
  validation = {},
  error,
  required = false,
}: FormFieldProps) {
  const isRegisterReturn = typeof register === "object" && "name" in register;

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
        {...(isRegisterReturn
          ? register
          : (register as UseFormRegister<any>)(id, validation))}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
