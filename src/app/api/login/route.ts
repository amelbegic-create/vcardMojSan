import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Match exactly what @auth/core does: derive secure-cookie flag from protocol
    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const isHttps = proto === "https";
    const COOKIE_NAME = isHttps
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    if (!email || !password) {
      return NextResponse.json({ error: "Email i lozinka su obavezni" }, { status: 400 });
    }

    // 1. Find user
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Pogrešan email ili lozinka" }, { status: 401 });
    }

    // 2. Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Pogrešan email ili lozinka" }, { status: 401 });
    }

    // 3. Create NextAuth-compatible JWT token
    const secret = process.env.NEXTAUTH_SECRET!;
    const token = await encode({
      token: {
        sub: user.id,
        id:  user.id,
        email: user.email,
        name:  user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      },
      secret,
      // NextAuth v5 uses salt based on cookie name
      salt: COOKIE_NAME,
    });

    // 4. Set the session cookie
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Greška servera" }, { status: 500 });
  }
}
