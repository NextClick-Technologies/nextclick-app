import { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { UpdateClientInput } from "@/features/(crm)/clients/services/schemas";
import type { Company } from "@/features/(crm)/companies/services/types";
import { FormField } from "../../../components/add-client-dialog/FormField";
import { ClientSelectFields } from "../../../components/add-client-dialog/ClientSelectFields";
import { ContractValueInput } from "./ContractValueInput";
import { DateInput } from "./DateInput";
import { CompanySelect } from "./CompanySelect";
import { StatusSelect } from "./StatusSelect";

interface EditClientFormProps {
  register: UseFormRegister<UpdateClientInput>;
  control: Control<UpdateClientInput>;
  errors: FieldErrors<UpdateClientInput>;
  companies: Company[];
}

export function EditClientForm({
  register,
  control,
  errors,
  companies,
}: EditClientFormProps) {
  return (
    <div className="space-y-4 p-2 overflow-y-auto flex-1">
      <ClientSelectFields control={control} />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First Name"
          id="name"
          placeholder="Enter first name"
          register={register}
          error={errors.name}
        />

        <FormField
          label="Family Name"
          id="familyName"
          placeholder="Enter family name"
          register={register}
          error={errors.familyName}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Phone Number"
          id="phoneNumber"
          placeholder="+1234567890"
          register={register}
          error={errors.phoneNumber}
        />

        <FormField
          label="Email (Optional)"
          id="email"
          type="email"
          placeholder="email@example.com"
          register={register}
        />
      </div>

      <ContractValueInput
        register={register}
        error={errors.totalContractValue}
      />

      <CompanySelect
        control={control}
        companies={companies}
        error={errors.companyId}
      />

      <div className="grid grid-cols-2 gap-4">
        <DateInput register={register} error={errors.joinDate} />
        <StatusSelect control={control} error={errors.status} />
      </div>
    </div>
  );
}
