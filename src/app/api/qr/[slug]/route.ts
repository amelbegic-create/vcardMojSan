import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQrPng } from "@/lib/generateQr";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const card = await prisma.card.findUnique({ where: { slug } });
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    `https://${req.headers.get("host")}`;

  const cardUrl = `${baseUrl}/card/${slug}`;
  const pngBuffer = await generateQrPng(cardUrl);

  // Convert Buffer to Uint8Array for NextResponse compatibility
  const uint8 = new Uint8Array(pngBuffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${slug}.png"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
