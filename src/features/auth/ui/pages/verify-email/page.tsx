"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");

          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push("/auth/signin");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email");
        }
      } catch {
        setStatus("error");
        setMessage("An error occurred while verifying your email");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your email address..."}
            {status === "success" && "Your email has been verified!"}
            {status === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground text-center">
                  You will be redirected to the sign in page in a few seconds...
                </p>
              </div>
              <Button
                onClick={() => router.push("/auth/signin")}
                className="w-full"
              >
                Go to Sign In
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full"
                  variant="outline"
                >
                  Go to Sign In
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Need help?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-indigo-600 hover:underline"
                  >
                    Contact support
                  </Link>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
