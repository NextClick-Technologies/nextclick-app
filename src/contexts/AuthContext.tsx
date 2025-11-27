"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { Session } from "next-auth";
import type { UserRole, Permission } from "@/types/auth.types";
import {
  hasPermission,
  canAccessResource,
  isAdmin,
  isAdminOrManager,
} from "@/lib/auth/permissions";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  // Permission helpers
  can: (permission: Permission) => boolean;
  canAccess: (
    resource: string,
    action: "read" | "create" | "update" | "delete"
  ) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || "",
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        permissions: session.user.permissions || [],
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: "/auth/signin" });
  };

  // Permission helper: Check if user has specific permission
  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  // Permission helper: Check if user can access resource with action
  const canAccess = (
    resource: string,
    action: "read" | "create" | "update" | "delete"
  ): boolean => {
    if (!user) return false;
    return canAccessResource(user.role, resource, action);
  };

  // Role helper: Check if user has specific role(s)
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading: status === "loading",
        isAuthenticated: !!session,
        signOut,
        can,
        canAccess,
        hasRole,
        isAdmin: user ? isAdmin(user.role) : false,
        isManager: user ? user.role === "manager" : false,
        isEmployee: user ? user.role === "employee" : false,
        isViewer: user ? user.role === "viewer" : false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
