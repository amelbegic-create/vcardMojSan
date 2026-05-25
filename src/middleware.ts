import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

const LOGIN_PATH = "/admin/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin/* but NOT the login page itself
  if (pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  // Derive cookie name from protocol — same logic as /api/login
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const isHttps = proto === "https";
  const cookieName = isHttps
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const tokenValue =
    req.cookies.get(cookieName)?.value ??
    req.cookies.get("authjs.session-token")?.value;

  if (!tokenValue) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  const secret = process.env.NEXTAUTH_SECRET ?? "";
  try {
    const decoded = await decode({ token: tokenValue, secret, salt: cookieName });

    if (!decoded?.sub) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }

    // Expired?
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }

    // Pass user info to the layout via request headers
    const res = NextResponse.next();
    res.headers.set("x-user-id", decoded.sub);
    res.headers.set("x-user-email", (decoded.email as string) ?? "");
    return res;
  } catch {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
