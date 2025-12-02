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
import { useEmployees } from "@/features/employees/ui/hooks/useEmployee";
import {
  useAddProjectMember,
  useRemoveProjectMember,
} from "@/features/projects/ui/hooks/useProjectMembers";
import { Badge } from "@/shared/components/ui/badge";
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
import { useMilestones } from "@/features/milestone/ui/hooks/useMilestone";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  role?: string | null;
}

interface ManageTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentMembers: TeamMember[];
}

export function ManageTeamDialog({
  open,
  onOpenChange,
  projectId,
  currentMembers,
}: ManageTeamDialogProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();
  const { data: milestonesData } = useMilestones({ projectId });
  const addMember = useAddProjectMember();
  const removeMember = useRemoveProjectMember();

  const milestones = milestonesData?.data || [];

  // Check if an employee is assigned to any milestone
  const isEmployeeInMilestone = (employeeId: string) => {
    return milestones.some((milestone) =>
      milestone.members?.some((member) => member.id === employeeId)
    );
  };

  // Get milestone names where employee is assigned
  const getMilestoneNames = (employeeId: string) => {
    return milestones
      .filter((milestone) =>
        milestone.members?.some((member) => member.id === employeeId)
      )
      .map((milestone) => milestone.name);
  };

  const employees = employeesData?.data || [];
  const currentMemberIds = currentMembers.map((m) => m.id);
  const availableEmployees = employees.filter(
    (emp) => !currentMemberIds.includes(emp.id)
  );

  const handleAddMember = () => {
    if (!selectedEmployeeId) return;

    addMember.mutate(
      {
        projectId,
        employeeId: selectedEmployeeId,
        role: role || undefined,
      },
      {
        onSuccess: () => {
          setSelectedEmployeeId("");
          setRole("");
          toast.success("Team member added successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add team member");
        },
      }
    );
  };

  const handleRemoveMember = (employeeId: string) => {
    if (isEmployeeInMilestone(employeeId)) {
      const milestoneNames = getMilestoneNames(employeeId);
      toast.error(
        `Cannot remove this member. They are assigned to: ${milestoneNames.join(
          ", "
        )}. Please remove them from all milestones first.`,
        { duration: 5000 }
      );
      return;
    }

    removeMember.mutate(
      {
        projectId,
        employeeId,
      },
      {
        onSuccess: () => {
          toast.success("Team member removed successfully");
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
          <DialogTitle>Manage Team Members</DialogTitle>
          <DialogDescription>
            Add or remove team members from this project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Member Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Add Team Member</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="justify-between"
                        disabled={
                          isLoadingEmployees || availableEmployees.length === 0
                        }
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
                          : "Select employee..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search employees..." />
                        <CommandList>
                          <CommandEmpty>No employee found.</CommandEmpty>
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
                  {availableEmployees.length === 0 && !isLoadingEmployees && (
                    <p className="text-xs text-muted-foreground">
                      All employees are already team members
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
                disabled={
                  !selectedEmployeeId ||
                  addMember.isPending ||
                  isLoadingEmployees
                }
              >
                {addMember.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Add Member
              </Button>
            </div>
          </div>

          {/* Current Members Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Current Team Members</h4>
            {currentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No team members assigned yet
              </p>
            ) : (
              <div className="space-y-2">
                {currentMembers.map((member) => {
                  const inMilestone = isEmployeeInMilestone(member.id);
                  const milestoneNames = inMilestone
                    ? getMilestoneNames(member.id)
                    : [];

                  return (
                    <div key={member.id}>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {getInitials(member.name, member.familyName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">
                              {getFullName(member.name, member.familyName)}
                            </div>
                            <div className="flex gap-2 mt-1">
                              {member.role && (
                                <Badge variant="secondary" className="text-xs">
                                  {member.role}
                                </Badge>
                              )}
                              {inMilestone && (
                                <Badge variant="outline" className="text-xs">
                                  In {milestoneNames.length} milestone
                                  {milestoneNames.length > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removeMember.isPending || inMilestone}
                          title={
                            inMilestone
                              ? `Remove from milestones first: ${milestoneNames.join(
                                  ", "
                                )}`
                              : "Remove member"
                          }
                        >
                          {removeMember.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X
                              className={cn(
                                "h-4 w-4",
                                inMilestone && "text-muted-foreground"
                              )}
                            />
                          )}
                        </Button>
                      </div>
                      {inMilestone && (
                        <Alert variant="default" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Assigned to: {milestoneNames.join(", ")}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
