import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Middleware for Supabase Auth
 *
 * This middleware:
 * 1. Refreshes the user's session on each request
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

  // Refresh session if expired - required for Server Components
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

  // Skip middleware for static files
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

  // Handle API routes - let API middleware handle auth
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

    // Additional role-based checks could be added here if needed
    // For now, specific role checks are handled in API routes and components
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
