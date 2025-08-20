import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken");

  const protectedPaths = ["/complaints"];

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!refreshToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/complaints"],
};
