import { NextRequest, NextResponse } from "next/server";

// Name of the query parameter to check
const QUERY_PARAM = "key";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Only protect the manage page
  if (pathname === "/event/manage") {
    const provided = url.searchParams.get(QUERY_PARAM) || "";
    const expected = process.env.MANAGE_KEY || "";

    // If no expected key is configured, deny access by default
    if (!expected || provided !== expected) {
      const redirectUrl = new URL("/", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Match only the manage page route
export const config = {
  matcher: ["/event/manage"],
};
