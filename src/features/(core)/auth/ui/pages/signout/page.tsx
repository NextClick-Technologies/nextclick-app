"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Sign Out</h1>
            <p className="text-muted-foreground">
              Are you sure you want to sign out?
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
