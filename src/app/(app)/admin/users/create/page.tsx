"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Mail, Shield, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading, user, session } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Debug logging
  useEffect(() => {
    console.log("🔍 Auth Debug Info:");
    console.log("  - authLoading:", authLoading);
    console.log("  - isAdmin:", isAdmin);
    console.log("  - user:", user);
    console.log("  - user.role:", user?.role);
    console.log("  - session:", session);
    console.log("  - Will redirect?", !authLoading && !isAdmin);
  }, [authLoading, isAdmin, user, session]);

  // Redirect if not admin (using useEffect to avoid setState during render)
  useEffect(() => {
    console.log("🔄 Redirect useEffect triggered");
    console.log("  - authLoading:", authLoading);
    console.log("  - isAdmin:", isAdmin);

    if (!authLoading && !isAdmin) {
      console.log("⚠️ REDIRECTING to dashboard - user is not admin");
      router.replace("/dashboard");
    } else if (!authLoading && isAdmin) {
      console.log("✅ User is admin - staying on page");
    } else {
      console.log("⏳ Still loading or indeterminate state");
    }
  }, [authLoading, isAdmin, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not admin after loading, show redirecting message
  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setRole("");
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              User Created Successfully
            </CardTitle>
            <CardDescription>
              The user account has been created and welcome email sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                A welcome email with login credentials has been sent to{" "}
                <strong>{email}</strong>. The user must verify their email
                before they can sign in.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={() => setSuccess(false)} className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Another User
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/admin/users">View All Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Create New User
          </CardTitle>
          <CardDescription>
            Create a new user account. The user will receive a welcome email
            with temporary login credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                User will receive a welcome email with temporary credentials
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Select
                  value={role}
                  onValueChange={setRole}
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Admin</span>
                        <span className="text-xs text-muted-foreground">
                          Full access to everything
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Manager</span>
                        <span className="text-xs text-muted-foreground">
                          Manage clients, projects, companies (no employee
                          access)
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="employee">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Employee</span>
                        <span className="text-xs text-muted-foreground">
                          View assigned projects only
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Viewer</span>
                        <span className="text-xs text-muted-foreground">
                          Read-only access to all data
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <h4 className="text-sm font-medium">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• User receives welcome email with temporary password</li>
                <li>
                  • User receives email verification link (must verify before
                  login)
                </li>
                <li>• User can sign in after email verification</li>
                <li>• User should change password after first login</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !email || !role}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
