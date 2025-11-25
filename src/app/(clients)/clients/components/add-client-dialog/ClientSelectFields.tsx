import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Title, Gender } from "@/const";

interface ClientSelectFieldsProps {
  title: (typeof Title)[keyof typeof Title];
  gender: (typeof Gender)[keyof typeof Gender];
  onTitleChange: (value: (typeof Title)[keyof typeof Title]) => void;
  onGenderChange: (value: (typeof Gender)[keyof typeof Gender]) => void;
}

export function ClientSelectFields({
  title,
  gender,
  onTitleChange,
  onGenderChange,
}: ClientSelectFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Select
          value={title}
          onValueChange={(value) =>
            onTitleChange(value as (typeof Title)[keyof typeof Title])
          }
        >
          <SelectTrigger>
            <SelectValue />
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

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={gender}
          onValueChange={(value) =>
            onGenderChange(value as (typeof Gender)[keyof typeof Gender])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Gender.MALE}>Male</SelectItem>
            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
            <SelectItem value={Gender.OTHER}>Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
