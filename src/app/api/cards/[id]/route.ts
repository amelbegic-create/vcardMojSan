import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// GET /api/cards/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { template: true },
  });

  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(card);
}

// PUT /api/cards/[id]
// Supports both full update (from CardForm) and partial update (e.g. toggle active)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // If slug changed, check uniqueness
  if (body.slug !== undefined) {
    const existing = await prisma.card.findUnique({ where: { slug: body.slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  // Build update object — only include fields that are explicitly present in body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  if (body.slug      !== undefined) data.slug      = body.slug;
  if (body.name      !== undefined) data.name      = body.name;
  if (body.active    !== undefined) data.active    = body.active;
  if (body.jobTitle  !== undefined) data.jobTitle  = body.jobTitle  || null;
  if (body.company   !== undefined) data.company   = body.company   || null;
  if (body.phone     !== undefined) data.phone     = body.phone     || null;
  if (body.phone2    !== undefined) data.phone2    = body.phone2    || null;
  if (body.email     !== undefined) data.email     = body.email     || null;
  if (body.website   !== undefined) data.website   = body.website   || null;
  if (body.address   !== undefined) data.address   = body.address   || null;
  if (body.mapsUrl   !== undefined) data.mapsUrl   = body.mapsUrl   || null;
  if (body.bio       !== undefined) data.bio       = body.bio       || null;
  if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl || null;
  if (body.coverUrl  !== undefined) data.coverUrl  = body.coverUrl  || null;
  if (body.gallery   !== undefined) data.gallery   = body.gallery   ?? [];
  if (body.facebook  !== undefined) data.facebook  = body.facebook  || null;
  if (body.instagram !== undefined) data.instagram = body.instagram || null;
  if (body.linkedin  !== undefined) data.linkedin  = body.linkedin  || null;
  if (body.youtube   !== undefined) data.youtube   = body.youtube   || null;
  if (body.whatsapp  !== undefined) data.whatsapp  = body.whatsapp  || null;
  if (body.customLinks !== undefined) data.customLinks = body.customLinks ?? null;
  if (body.templateId  !== undefined) data.templateId  = body.templateId  || null;

  const card = await prisma.card.update({
    where: { id },
    data,
    include: { template: true },
  });

  return NextResponse.json(card);
}

// DELETE /api/cards/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.card.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
