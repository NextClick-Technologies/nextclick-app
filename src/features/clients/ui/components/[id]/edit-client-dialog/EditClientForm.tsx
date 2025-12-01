import { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { UpdateClientInput } from "../../../../domain/schemas/client.schema";
import type { Company } from "@/features/companies/domain/types/company.type";
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

      <ContractValueInput
        register={register}
        error={errors.totalContractValue}
      />

      <DateInput register={register} error={errors.joinDate} />

      <CompanySelect
        control={control}
        companies={companies}
        error={errors.companyId}
      />

      <StatusSelect control={control} error={errors.status} />
    </div>
  );
}
