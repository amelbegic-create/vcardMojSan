import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import CardTable from "@/components/admin/CardTable";
import type { CardWithTemplate } from "@/lib/types";

export default async function CardsPage() {
  const cards = await prisma.card.findMany({
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[26px] font-black" style={{ color: "#1a1a1a" }}>Vizit kartice</h1>
          <p className="text-sm mt-1" style={{ color: "#666" }}>{cards.length} kartica ukupno</p>
        </div>
        <Link
          href="/admin/cards/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
          style={{ background: "#1e9bd7", boxShadow: "0 4px 14px rgba(30,155,215,0.3)" }}
        >
          <PlusCircle size={16} /> Nova kartica
        </Link>
      </div>
      <CardTable cards={cards as CardWithTemplate[]} />
    </div>
  );
}
