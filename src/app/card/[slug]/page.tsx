import { notFound } from "next/navigation";
import { after } from "next/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CardPage from "@/components/card/CardPage";
import type { CardWithTemplate } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = await prisma.card.findUnique({
    where: { slug },
    include: { template: true },
  });

  if (!card) return { title: "Card Not Found" };

  const title = [card.name, card.company].filter(Boolean).join(" - ");
  const description = card.bio || card.jobTitle || `Digital business card for ${card.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: card.avatarUrl ? [{ url: card.avatarUrl }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: card.avatarUrl ? [card.avatarUrl] : [],
    },
  };
}

export default async function CardSlugPage({ params }: Props) {
  const { slug } = await params;

  const card = await prisma.card.findUnique({
    where: { slug },
    include: { template: true },
  });

  if (!card) notFound();

  if (!card.active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-semibold text-white mb-2">Card Not Available</h1>
          <p className="text-gray-400">This digital business card has been deactivated.</p>
        </div>
      </div>
    );
  }

  // Increment view count after response is sent (non-blocking)
  after(async () => {
    await prisma.card.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  });

  return <CardPage card={card as CardWithTemplate} />;
}
