import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CardForm from "@/components/admin/CardForm";
import type { CardWithTemplate } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCardPage({ params }: Props) {
  const { id } = await params;

  const card = await prisma.card.findUnique({
    where: { id },
    include: { template: true },
  });

  if (!card) notFound();

  return <CardForm card={card as CardWithTemplate} />;
}
