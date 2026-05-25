import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

const LOGIN_PATH = "/admin/login";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/login is public — never block it
  if (pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    // Use x-forwarded-proto to match exactly how /api/login sets the cookie
    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const isHttps = proto === "https";
    const cookieName = isHttps
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    // Read cookie directly from request (same approach as auth-test Route Handler)
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

      // Check expiry
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
      }

      // Forward user info to layout via headers
      const res = NextResponse.next();
      res.headers.set("x-user-id", decoded.sub);
      res.headers.set("x-user-email", (decoded.email as string) ?? "");
      return res;
    } catch {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
