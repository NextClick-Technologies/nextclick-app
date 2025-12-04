/**
 * Project Members Permission Hook
 * Provides permission checks for managing project team members
 * Admin, Manager, and Project Managers can manage team members
 */
"use client";

import { useAuth } from "@/shared/contexts/AuthContext";
import { useState, useEffect } from "react";

/**
 * Check if current user can manage team members for a specific project
 * Admin and Manager: can always manage
 * Employee: only if they're the project manager of that project
 * Viewer: never
 */
export function useProjectMembersPermissions(projectId?: string) {
  const { user, isAdmin, isManager } = useAuth();
  const [isProjectManager, setIsProjectManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkProjectManager() {
      if (!projectId || !user) {
        setIsLoading(false);
        return;
      }

      // Admin and Manager can always manage
      if (isAdmin || isManager) {
        setIsProjectManager(true);
        setIsLoading(false);
        return;
      }

      // Employee needs to check if they're the project manager
      if (user.role === "employee") {
        try {
          console.log(
            "[useProjectMembersPermissions] Checking for user:",
            user.id
          );

          const response = await fetch(`/api/project/${projectId}`);
          if (response.ok) {
            const { data } = await response.json();
            console.log("[useProjectMembersPermissions] Project data:", {
              projectId: data.id,
              projectManager: data.projectManager,
            });

            // Fetch all employees and find the one with matching user_id
            const employeesResponse = await fetch("/api/employee");
            if (employeesResponse.ok) {
              const employeesData = await employeesResponse.json();
              const currentEmployee = employeesData.data?.find(
                (emp: any) => emp.userId === user.id
              );

              console.log("[useProjectMembersPermissions] Current employee:", {
                employeeId: currentEmployee?.id,
                userId: currentEmployee?.userId,
              });

              if (currentEmployee) {
                const isPM = data.projectManager === currentEmployee.id;
                console.log(
                  "[useProjectMembersPermissions] Is project manager?",
                  isPM,
                  {
                    projectManager: data.projectManager,
                    employeeId: currentEmployee.id,
                    match: data.projectManager === currentEmployee.id,
                  }
                );
                setIsProjectManager(isPM);
              } else {
                console.log(
                  "[useProjectMembersPermissions] No employee record found for user"
                );
              }
            } else {
              console.error(
                "[useProjectMembersPermissions] Failed to fetch employees"
              );
            }
          } else {
            console.error(
              "[useProjectMembersPermissions] Failed to fetch project"
            );
          }
        } catch (error) {
          console.error(
            "[useProjectMembersPermissions] Error checking project manager:",
            error
          );
        }
      }

      setIsLoading(false);
    }

    checkProjectManager();
  }, [projectId, user, isAdmin, isManager]);

  // All permissions for managing project members
  const canManage = isAdmin || isManager || isProjectManager;
  const canAdd = canManage;
  const canRemove = canManage;
  const canUpdate = canManage;

  return {
    canManage,
    canAdd,
    canRemove,
    canUpdate,
    isProjectManager,
    isLoading,
  };
}
