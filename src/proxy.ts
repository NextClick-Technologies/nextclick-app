import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Proxy for Supabase Auth
 *
 * This proxy:
 * 1. Refreshes the user's session on each request (CRITICAL for RLS to work)
 * 2. Protects routes based on authentication state
 * 3. Handles redirects for auth pages
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: This refreshes the session and updates cookies
  // Without this, auth.uid() won't work in RLS policies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Define route categories
  const isAuthPage = pathname.startsWith("/auth");
  const isApiRoute = pathname.startsWith("/api");
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isStaticFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");

  // Protected app routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/companies") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/employees") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/communication") ||
    pathname.startsWith("/admin");

  // Skip proxy for static files
  if (isStaticFile) {
    return response;
  }

  // Handle auth pages - redirect logged-in users to dashboard
  if (isAuthPage && !pathname.includes("/auth/error")) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // Handle API routes - let API handlers handle auth
  // Skip auth check for public auth endpoints
  if (isApiRoute) {
    // Auth API routes are public
    if (isApiAuthRoute) {
      return response;
    }
    // Other API routes - auth will be checked in the route handler
    return response;
  }

  // Handle protected routes - redirect to sign in if not authenticated
  if (isProtectedRoute) {
    if (!user) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return response;
  }

  // Handle root path - redirect to dashboard if logged in, signin if not
  if (pathname === "/") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
