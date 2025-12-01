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
import { cn } from "@/utils/cn";
import { useState } from "react";
import type { Client } from "@/features/(crm)/clients/services/types";

interface ClientSelectProps {
  value?: string;
  clients: Client[];
  onChange: (value: string) => void;
  required?: boolean;
}

export function ClientSelect({
  value = "",
  clients,
  onChange,
}: ClientSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="clientId">Client</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? clients.find((client) => client.id === value)
                ? `${clients.find((client) => client.id === value)?.name} ${
                    clients.find((client) => client.id === value)?.familyName
                  }`
                : "Select client"
              : "Select client"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search client..." />
            <CommandList>
              <CommandEmpty>No client found.</CommandEmpty>
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={`${client.name} ${client.familyName}`}
                    onSelect={() => {
                      onChange(client.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {client.name} {client.familyName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
