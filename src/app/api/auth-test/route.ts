import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encode, decode } from "next-auth/jwt";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET ?? "";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const isHttps = proto === "https";
  const secureCookieName = isHttps ? "__Secure-authjs.session-token" : "authjs.session-token";
  const nodeEnvCookieName = process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token";

  // Read existing cookie if any
  const cookieValue = req.cookies.get(secureCookieName)?.value ?? req.cookies.get("authjs.session-token")?.value;
  let decoded = null;
  let decodeError = null;
  if (cookieValue) {
    try {
      decoded = await decode({ token: cookieValue, secret, salt: secureCookieName });
    } catch (e) {
      decodeError = String(e);
    }
  }

  // Test encode/decode roundtrip
  let roundtripOk = false;
  try {
    const t = await encode({ token: { sub: "test", email: "test@test.com" }, secret, salt: secureCookieName });
    const d = await decode({ token: t, secret, salt: secureCookieName });
    roundtripOk = !!d?.sub;
  } catch { roundtripOk = false; }

  // Test DB
  let userFound = false, passwordMatch = false;
  try {
    const user = await prisma.adminUser.findUnique({ where: { email: "admin@mojsan.ba" } });
    userFound = !!user;
    if (user) passwordMatch = await bcrypt.compare("Admin@123", user.password);
  } catch { /* ignore */ }

  // Call auth() directly to see if the session is accepted
  let authSession = null;
  let authError = null;
  try {
    authSession = await auth();
  } catch (e) {
    authError = String(e);
  }

  return NextResponse.json({
    proto, isHttps,
    secureCookieName,
    nodeEnvCookieName,
    cookieNameMatch: secureCookieName === nodeEnvCookieName,
    secretLength: secret.length,
    cookiePresent: !!cookieValue,
    cookieDecoded: decoded,
    decodeError,
    roundtripOk,
    userFound, passwordMatch,
    allCookies: [...req.cookies].map(([k]) => k),
    authSession,
    authError,
  });
}
