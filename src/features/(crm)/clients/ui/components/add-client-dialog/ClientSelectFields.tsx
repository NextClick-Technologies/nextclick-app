import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Title, Gender } from "../../../services/types";
import { Control, Controller } from "react-hook-form";

interface ClientSelectFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

export function ClientSelectFields({ control }: ClientSelectFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Title.MR}>Mr</SelectItem>
                <SelectItem value={Title.MRS}>Mrs</SelectItem>
                <SelectItem value={Title.MS}>Ms</SelectItem>
                <SelectItem value={Title.DR}>Dr</SelectItem>
                <SelectItem value={Title.PROF}>Prof</SelectItem>
                <SelectItem value={Title.SR}>Sr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.MALE}>Male</SelectItem>
                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                <SelectItem value={Gender.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />
    </div>
  );
}
