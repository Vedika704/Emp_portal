import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // ✅ Allow login & register always
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // 🔒 Protect employee routes
  if (pathname.startsWith("/employee/details")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)  
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/employee/:path*"],
};
