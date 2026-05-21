import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Temporary debug endpoint — remove after login is confirmed working
export async function GET() {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: "admin@mojsan.ba" },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found in DB" });
    }

    const passwordMatch = await bcrypt.compare("Admin@123", user.password);

    return NextResponse.json({
      ok: true,
      userFound: true,
      passwordMatch,
      dbUrl: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : "NOT SET",
      secret: process.env.NEXTAUTH_SECRET ? `set (${process.env.NEXTAUTH_SECRET.length} chars)` : "NOT SET",
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: String(err),
      dbUrl: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : "NOT SET",
    });
  }
}
