"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { UpdateProjectInput } from "@/features/projects/domain/schemas/project.schema";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useEmployees } from "@/features/employees/ui/hooks/useEmployee";
import { useState } from "react";

interface ProjectManagerSelectProps {
  control: Control<UpdateProjectInput>;
  errors: FieldErrors<UpdateProjectInput>;
}

export function ProjectManagerSelect({
  control,
  errors,
}: ProjectManagerSelectProps) {
  const [open, setOpen] = useState(false);
  const { data: employeesData } = useEmployees({ page: 1, pageSize: 100 });
  const employees = employeesData?.data || [];

  return (
    <div className="space-y-2">
      <Label htmlFor="projectManager">Project Manager (Optional)</Label>
      <Controller
        name="projectManager"
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {field.value
                  ? (() => {
                      const employee = employees.find(
                        (e) => e.id === field.value
                      );
                      return employee
                        ? `${employee.name} ${employee.familyName}`
                        : "Select project manager...";
                    })()
                  : "Select project manager..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search employee..." />
                <CommandEmpty>No employee found.</CommandEmpty>
                <CommandGroup>
                  {employees.map((employee) => (
                    <CommandItem
                      key={employee.id}
                      value={`${employee.name} ${employee.familyName}`}
                      onSelect={() => {
                        field.onChange(employee.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === employee.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {employee.name} {employee.familyName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      {errors.projectManager && (
        <p className="text-sm text-destructive">
          {errors.projectManager.message}
        </p>
      )}
    </div>
  );
}
