"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { X, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  useAddMilestoneMember,
  useRemoveMilestoneMember,
} from "@/features/milestone/application/hooks/useMilestoneMembers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/cn";
import { PROJECT_ROLES } from "@/shared/const/roles";

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  position?: string | null;
  role?: string | null;
}

interface ManageMilestoneTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneId: string;
  milestoneName: string;
  projectMembers: TeamMember[]; // All project team members
  currentMembers: TeamMember[]; // Currently assigned to milestone
}

export function ManageMilestoneTeamDialog({
  open,
  onOpenChange,
  milestoneId,
  milestoneName,
  projectMembers,
  currentMembers,
}: ManageMilestoneTeamDialogProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const addMember = useAddMilestoneMember();
  const removeMember = useRemoveMilestoneMember();

  const currentMemberIds = currentMembers.map((m) => m.id);
  const availableEmployees = projectMembers.filter(
    (emp) => !currentMemberIds.includes(emp.id)
  );

  const handleAddMember = () => {
    if (!selectedEmployeeId) return;

    addMember.mutate(
      {
        milestoneId,
        employeeId: selectedEmployeeId,
        role: role || undefined,
      },
      {
        onSuccess: () => {
          setSelectedEmployeeId("");
          setRole("");
          toast.success("Team member assigned to milestone");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to assign team member");
        },
      }
    );
  };

  const handleRemoveMember = (employeeId: string) => {
    removeMember.mutate(
      {
        milestoneId,
        employeeId,
      },
      {
        onSuccess: () => {
          toast.success("Team member removed from milestone");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to remove team member");
        },
      }
    );
  };

  const getInitials = (name: string, familyName: string) => {
    return `${name.charAt(0)}${familyName.charAt(0)}`.toUpperCase();
  };

  const getFullName = (name: string, familyName: string) => {
    return `${name} ${familyName}`;
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    // Reset form when dialog closes
    if (!newOpen) {
      setSelectedEmployeeId("");
      setRole("");
      setComboboxOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Milestone Team</DialogTitle>
          <DialogDescription>
            Assign or remove team members for &ldquo;{milestoneName}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Member Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Assign Team Member</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee">Project Team Member</Label>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="justify-between"
                        disabled={availableEmployees.length === 0}
                      >
                        {selectedEmployeeId
                          ? getFullName(
                              availableEmployees.find(
                                (emp) => emp.id === selectedEmployeeId
                              )?.name || "",
                              availableEmployees.find(
                                (emp) => emp.id === selectedEmployeeId
                              )?.familyName || ""
                            )
                          : "Select team member..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search team members..." />
                        <CommandList>
                          <CommandEmpty>No team member found.</CommandEmpty>
                          <CommandGroup>
                            {availableEmployees.map((emp) => (
                              <CommandItem
                                key={emp.id}
                                value={`${emp.name} ${emp.familyName} ${
                                  emp.position || ""
                                }`}
                                onSelect={() => {
                                  setSelectedEmployeeId(emp.id);
                                  setComboboxOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedEmployeeId === emp.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {getFullName(emp.name, emp.familyName)}
                                  </span>
                                  {emp.position && (
                                    <span className="text-xs text-muted-foreground">
                                      {emp.position}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {availableEmployees.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      All project team members are already assigned to this
                      milestone
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Role (Optional)</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_ROLES.map((roleOption) => (
                        <SelectItem
                          key={roleOption.value}
                          value={roleOption.value}
                        >
                          {roleOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAddMember}
                disabled={!selectedEmployeeId || addMember.isPending}
              >
                {addMember.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Assign Member
              </Button>
            </div>
          </div>

          {/* Current Members Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Assigned Team Members</h4>
            {currentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No team members assigned to this milestone yet
              </p>
            ) : (
              <div className="space-y-2">
                {currentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(member.name, member.familyName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {getFullName(member.name, member.familyName)}
                        </div>
                        {member.role && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {member.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removeMember.isPending}
                    >
                      {removeMember.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
