import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const template = await prisma.template.update({
    where: { id },
    data: {
      name: body.name,
      accentColor: body.accentColor,
      bgColor: body.bgColor,
      cardBg: body.cardBg,
      textColor: body.textColor,
    },
  });
  return NextResponse.json(template);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
