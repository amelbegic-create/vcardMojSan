import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// GET /api/cards — list all cards (admin only)
export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cards = await prisma.card.findMany({
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cards);
}

// POST /api/cards — create a new card (admin only)
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Validate required fields
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.card.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const created = await prisma.card.create({
    data: {
      slug: body.slug,
      name: body.name,
      jobTitle: body.jobTitle || null,
      company: body.company || null,
      phone: body.phone || null,
      phone2: body.phone2 || null,
      email: body.email || null,
      website: body.website || null,
      address: body.address || null,
      mapsUrl: body.mapsUrl || null,
      bio: body.bio || null,
      avatarUrl: body.avatarUrl || null,
      coverUrl: body.coverUrl || null,
      gallery: body.gallery || [],
      facebook: body.facebook || null,
      instagram: body.instagram || null,
      linkedin: body.linkedin || null,
      youtube: body.youtube || null,
      whatsapp: body.whatsapp || null,
      customLinks: body.customLinks || null,
      templateId: body.templateId || null,
      active: body.active ?? true,
    },
  });
  // Fetch with relations separately — PrismaNeonHttp (HTTP mode) does not support
  // transactions, which Prisma uses internally when combining write + include.
  const card = await prisma.card.findUnique({
    where: { id: created.id },
    include: { template: true },
  });

  return NextResponse.json(card, { status: 201 });
}
