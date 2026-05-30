import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const original = await prisma.card.findUnique({ where: { id } });
  if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Generate unique slug
  let newSlug = `${original.slug}-kopija`;
  let counter = 1;
  while (await prisma.card.findUnique({ where: { slug: newSlug } })) {
    newSlug = `${original.slug}-kopija-${counter++}`;
  }

  const created = await prisma.card.create({
    data: {
      slug:       newSlug,
      name:       `${original.name} (kopija)`,
      active:     false,
      views:      0,
      templateId: original.templateId,
      jobTitle:   original.jobTitle,
      company:    original.company,
      phone:      original.phone,
      phone2:     original.phone2,
      email:      original.email,
      website:    original.website,
      address:    original.address,
      mapsUrl:    original.mapsUrl,
      bio:        original.bio,
      avatarUrl:  original.avatarUrl,
      coverUrl:   original.coverUrl,
      gallery:    Array.isArray(original.gallery) ? [...original.gallery] : [],
      facebook:   original.facebook,
      instagram:  original.instagram,
      linkedin:   original.linkedin,
      youtube:    original.youtube,
      whatsapp:   original.whatsapp,
      customLinks: original.customLinks ?? undefined,
    },
  });
  // Fetch with relations separately — PrismaNeonHttp does not support transactions
  // which Prisma uses internally when combining write + include.
  const copy = await prisma.card.findUnique({
    where: { id: created.id },
    include: { template: true },
  });

  return NextResponse.json(copy, { status: 201 });
}
