/**
 * Milestone Permission Hook
 * Provides permission checks specifically for milestones
 * Includes special logic for project managers
 */
"use client";

import { useAuth } from "@/shared/contexts/AuthContext";
import { useState, useEffect } from "react";

/**
 * Check if current user can manage milestones for a specific project
 * Admin and Manager: can always manage
 * Employee: only if they're the project manager
 * Viewer: never
 */
export function useMilestonePermissions(projectId?: string) {
  const { user, canAccess, isAdmin, isManager } = useAuth();
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
          const response = await fetch(`/api/project/${projectId}`);
          if (response.ok) {
            const { data } = await response.json();

            // Project has projectManager field which is an employee ID
            // We need to find the employee record that matches current user
            // Then compare employee.id with data.projectManager

            // Fetch all employees and find the one with matching user_id
            const employeesResponse = await fetch("/api/employee");
            if (employeesResponse.ok) {
              const employeesData = await employeesResponse.json();
              const currentEmployee = employeesData.data?.find(
                (emp: any) => emp.userId === user.id
              );

              if (currentEmployee) {
                setIsProjectManager(data.projectManager === currentEmployee.id);
              }
            }
          }
        } catch (error) {
          console.error("Error checking project manager:", error);
        }
      }

      setIsLoading(false);
    }

    checkProjectManager();
  }, [projectId, user, isAdmin, isManager]);

  const canRead = canAccess("milestones", "read");
  const canCreate = isAdmin || isManager || isProjectManager;
  const canUpdate = isAdmin || isManager || isProjectManager;
  const canDelete = isAdmin || isManager || isProjectManager;

  return {
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    isProjectManager,
    isLoading,
  };
}
