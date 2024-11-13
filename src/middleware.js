import { NextResponse } from "next/server";
import { parse } from "cookie";

// This function can be marked `async` if using `await` inside

const protectedPaths = ["/", "/user-profile"];

export function middleware(request) {
  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.jwt_token;
  if (
    protectedPaths.includes(request.nextUrl.pathname) &&
    token === undefined
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    return NextResponse.next();
  }
}
