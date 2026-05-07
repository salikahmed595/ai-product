import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/agents") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/calls") ||
    pathname.startsWith("/analytics");

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Supabase stores the session in a cookie starting with "sb-"
  const hasSession = request.cookies.getAll().some((c) =>
    c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (!hasSession && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (hasSession && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
