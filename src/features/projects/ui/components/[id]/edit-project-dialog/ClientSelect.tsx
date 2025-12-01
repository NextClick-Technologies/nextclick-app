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
import { useClients } from "@/features/clients/ui/hooks/useClient";
import { useState } from "react";

interface ClientSelectProps {
  control: Control<UpdateProjectInput>;
  errors: FieldErrors<UpdateProjectInput>;
}

export function ClientSelect({ control, errors }: ClientSelectProps) {
  const [open, setOpen] = useState(false);
  const { data: clientsData } = useClients({ page: 1, pageSize: 100 });
  const clients = clientsData?.data || [];

  return (
    <div className="space-y-2">
      <Label htmlFor="clientId">Client</Label>
      <Controller
        name="clientId"
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
                      const client = clients.find((c) => c.id === field.value);
                      return client
                        ? `${client.name} ${client.familyName}`
                        : "Select client...";
                    })()
                  : "Select client..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search client..." />
                <CommandEmpty>No client found.</CommandEmpty>
                <CommandGroup>
                  {clients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={`${client.name} ${client.familyName}`}
                      onSelect={() => {
                        field.onChange(client.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === client.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {client.name} {client.familyName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      {errors.clientId && (
        <p className="text-sm text-destructive">{errors.clientId.message}</p>
      )}
    </div>
  );
}
