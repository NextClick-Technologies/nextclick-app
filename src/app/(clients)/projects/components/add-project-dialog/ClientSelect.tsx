import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Client } from "@/types/database.type";

interface ClientSelectProps {
  value: string;
  clients: Client[];
  onChange: (value: string) => void;
  required?: boolean;
}

export function ClientSelect({
  value,
  clients,
  onChange,
  required = false,
}: ClientSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="clientId">Client</Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Select client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name} {client.familyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
