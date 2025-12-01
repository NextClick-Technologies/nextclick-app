import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import type { ClientInput } from "../../../domain/schemas/client.schema";
import type { Company } from "@/features/companies/domain/types/company.type";

interface CompanySelectProps {
  control: Control<ClientInput>;
  companies: Company[];
  error?: FieldErrors<ClientInput>["companyId"];
}

export function CompanySelect({
  control,
  companies,
  error,
}: CompanySelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name="companyId"
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <Label htmlFor="companyId">Company</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {field.value
                  ? companies.find((company) => company.id === field.value)
                      ?.name
                  : "Select a company"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search company..." />
                <CommandList>
                  <CommandEmpty>No company found.</CommandEmpty>
                  <CommandGroup>
                    {companies.map((company) => (
                      <CommandItem
                        key={company.id}
                        value={company.name}
                        onSelect={() => {
                          field.onChange(company.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === company.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {company.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
