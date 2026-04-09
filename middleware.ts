import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if user is authenticated
  const authToken = request.cookies.get("auth-token")?.value;
  const isAuthenticated = authToken === "demo-token";
  
  // Redirect unauthenticated users to login (except for public routes)
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Redirect authenticated users away from login page
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except API routes and static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
