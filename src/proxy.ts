import { auth } from "@/shared/lib/auth/auth";

export default auth((req) => {
  // req.auth contains the session data
  // The actual authorization logic is in the `authorized` callback in auth.ts
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
