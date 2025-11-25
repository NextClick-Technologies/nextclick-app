import { Label } from "@/components/ui/label";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description (Optional)</Label>
      <textarea
        id="description"
        className="flex min-h-20 w-full rounded-md border border-input bg-white dark:bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Enter project description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
