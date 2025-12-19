"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createSupabaseBrowserClient } from "@/shared/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { UserRole, Permission } from "@/shared/types/auth.types";
import {
  hasPermission,
  canAccessResource,
  isAdmin as checkIsAdmin,
} from "@/shared/lib/auth/permissions";

interface UserWithRole {
  id: string;
  email: string | undefined;
  role: UserRole;
  isActive: boolean;
}

interface AuthContextType {
  user: UserWithRole | null;
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
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  const fetchUserRole = useCallback(
    async (authUser: User) => {
      try {
        const { data } = await supabase
          .from("users")
          .select("role, is_active")
          .eq("id", authUser.id)
          .single();

        if (data) {
          const userData = data as { role: string; is_active: boolean };
          setUser({
            id: authUser.id,
            email: authUser.email,
            role: userData.role as UserRole,
            isActive: userData.is_active,
          });
        } else {
          // User exists in auth but not in public.users (shouldn't happen with trigger)
          console.error("User not found in public.users table");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUser(null);
      }
      setIsLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      setSession(initialSession);

      if (initialSession?.user) {
        await fetchUserRole(initialSession.user);
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);

      if (event === "SIGNED_IN" && currentSession?.user) {
        await fetchUserRole(currentSession.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsLoading(false);
      } else if (event === "TOKEN_REFRESHED" && currentSession?.user) {
        // Refresh user data on token refresh
        await fetchUserRole(currentSession.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, fetchUserRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = "/auth/signin";
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
  const hasRoleCheck = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  // Calculate role flags
  const userRole = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session && !!user,
        signOut,
        can,
        canAccess,
        hasRole: hasRoleCheck,
        isAdmin: userRole ? checkIsAdmin(userRole) : false,
        isManager: userRole === "manager",
        isEmployee: userRole === "employee",
        isViewer: userRole === "viewer",
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
