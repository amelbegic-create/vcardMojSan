import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { type NextRequest } from "next/server";

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
}

/**
 * Reads and validates the admin session cookie directly,
 * bypassing NextAuth's auth() which has internal validation quirks.
 * Uses the same decode() that auth-test confirmed works correctly.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();

    // List all cookie names for debugging
    const allCookieNames = cookieStore.getAll().map((c) => c.name);
    console.log("[getAdminSession] all cookies:", allCookieNames);

    // Try secure cookie first (production/HTTPS), then fallback
    const secureCookie = cookieStore.get("__Secure-authjs.session-token")?.value;
    const regularCookie = cookieStore.get("authjs.session-token")?.value;
    const tokenValue = secureCookie ?? regularCookie;

    console.log("[getAdminSession] secureCookie present:", !!secureCookie, "regularCookie present:", !!regularCookie);

    if (!tokenValue) {
      console.log("[getAdminSession] no token found, returning null");
      return null;
    }

    const cookieName = secureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const secret = process.env.NEXTAUTH_SECRET ?? "";
    console.log("[getAdminSession] decoding with salt:", cookieName, "secretLen:", secret.length);

    const decoded = await decode({ token: tokenValue, secret, salt: cookieName });
    console.log("[getAdminSession] decoded sub:", decoded?.sub, "exp:", decoded?.exp);

    if (!decoded?.sub) return null;

    // Check expiry
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      console.log("[getAdminSession] token expired");
      return null;
    }

    return {
      user: {
        id: decoded.sub,
        email: (decoded.email as string) ?? "",
      },
    };
  } catch (err) {
    console.error("[getAdminSession] error:", err);
    return null;
  }
}

/**
 * Validates the session from a NextRequest's cookies.
 * Use this in API Route Handlers instead of auth() from next-auth.
 * Same decode() logic confirmed working in auth-test.
 */
export async function requireAuth(req: NextRequest): Promise<AdminSession | null> {
  try {
    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const isHttps = proto === "https";
    const cookieName = isHttps
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const tokenValue =
      req.cookies.get(cookieName)?.value ??
      req.cookies.get("authjs.session-token")?.value;

    if (!tokenValue) return null;

    const secret = process.env.NEXTAUTH_SECRET ?? "";
    const decoded = await decode({ token: tokenValue, secret, salt: cookieName });

    if (!decoded?.sub) return null;
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      user: {
        id: decoded.sub,
        email: (decoded.email as string) ?? "",
      },
    };
  } catch {
    return null;
  }
}
