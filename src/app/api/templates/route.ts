import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const templates = await prisma.template.findMany({
    include: { _count: { select: { cards: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const template = await prisma.template.create({
    data: {
      name: body.name,
      accentColor: body.accentColor || "#e94560",
      bgColor: body.bgColor || "#1a1a2e",
      cardBg: body.cardBg || "#16213e",
      textColor: body.textColor || "#ffffff",
    },
  });
  return NextResponse.json(template, { status: 201 });
}
