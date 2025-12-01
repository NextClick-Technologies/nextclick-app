"use client";

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
import { cn } from "@/utils/cn";
import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  familyName: string;
}

interface ProjectManagerSelectProps {
  value: string;
  employees: Employee[];
  onChange: (value: string) => void;
  required?: boolean;
}

export function ProjectManagerSelect({
  value,
  employees,
  onChange,
  required = false,
}: ProjectManagerSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="projectManager">
        Project Manager {!required && "(Optional)"}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? (() => {
                  const employee = employees.find((e) => e.id === value);
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
                    onChange(employee.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === employee.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {employee.name} {employee.familyName}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
