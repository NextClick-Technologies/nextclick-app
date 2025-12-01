"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Loader2 } from "lucide-react";
import { useEmployees } from "@/hooks";
import { useAddProjectMember, useRemoveProjectMember } from "@/hooks";
import { Badge } from "@/components/ui/badge";

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

  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();
  const addMember = useAddProjectMember();
  const removeMember = useRemoveProjectMember();

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
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                  disabled={
                    isLoadingEmployees || availableEmployees.length === 0
                  }
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {getFullName(emp.name, emp.familyName)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableEmployees.length === 0 && !isLoadingEmployees && (
                  <p className="text-xs text-muted-foreground">
                    All employees are already team members
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role (Optional)</Label>
                <Input
                  id="role"
                  placeholder="e.g., Developer, Designer, etc."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
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
