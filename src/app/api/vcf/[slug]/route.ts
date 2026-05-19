import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVcf } from "@/lib/generateVcf";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const card = await prisma.card.findUnique({ where: { slug } });
  if (!card || !card.active) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const vcfContent = generateVcf(card);
  const safeName = card.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return new NextResponse(vcfContent, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeName}.vcf"`,
    },
  });
}
