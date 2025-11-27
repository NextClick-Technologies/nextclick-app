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

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
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
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading: status === "loading",
        isAuthenticated: !!session,
        signOut,
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
