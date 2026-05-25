import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

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

    // Try secure cookie first (production/HTTPS), then fallback
    const secureCookie = cookieStore.get("__Secure-authjs.session-token")?.value;
    const regularCookie = cookieStore.get("authjs.session-token")?.value;
    const tokenValue = secureCookie ?? regularCookie;

    if (!tokenValue) return null;

    const cookieName = secureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const secret = process.env.NEXTAUTH_SECRET ?? "";

    const decoded = await decode({ token: tokenValue, secret, salt: cookieName });
    if (!decoded?.sub) return null;

    // Check expiry
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
