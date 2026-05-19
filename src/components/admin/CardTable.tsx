"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, QrCode, ExternalLink, Eye, PlusCircle, Copy } from "lucide-react";
import toast from "react-hot-toast";
import type { CardWithTemplate } from "@/lib/types";

interface CardTableProps { cards: CardWithTemplate[]; }

export default function CardTable({ cards }: CardTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copying, setCopying] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Obrisati "${name}"? Ova akcija se ne može poništiti.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Kartica obrisana");
      router.refresh();
    } catch { toast.error("Greška pri brisanju"); }
    finally { setDeleting(null); }
  }

  async function handleCopy(id: string, name: string) {
    setCopying(id);
    try {
      const res = await fetch(`/api/cards/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error();
      const copy = await res.json();
      toast.success(`"${name}" kopirana!`);
      // refresh first so server cache is cleared, then navigate to the new card
      router.refresh();
      setTimeout(() => {
        router.push(`/admin/cards/${copy.id}/edit`);
      }, 100);
    } catch { toast.error("Greška pri kopiranju"); }
    finally { setCopying(null); }
  }

  async function handleToggle(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Kartica ${!current ? "aktivirana" : "deaktivirana"}`);
      router.refresh();
    } catch { toast.error("Greška pri ažuriranju"); }
  }

  /* Prazno stanje */
  if (cards.length === 0) {
    return (
      <div
        className="rounded-2xl py-20 text-center"
        style={{ background: "#fff", border: "1px solid #e2e8f0" }}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "#f5e6f4" }}
        >
          <Eye size={26} style={{ color: "#900a7d" }} />
        </div>
        <p className="font-bold text-lg mb-1" style={{ color: "#1a1a1a" }}>Nema kartica</p>
        <p className="text-sm mb-6" style={{ color: "#888" }}>Kreirajte svoju prvu digitalnu vizit karticu</p>
        <Link
          href="/admin/cards/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "#1e9bd7", boxShadow: "0 4px 14px rgba(30,155,215,0.35)" }}
        >
          <PlusCircle size={16} /> Kreiraj karticu
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f4f8" }}>
              {["Ime / Pozicija", "Kompanija", "Link", "Pregledi", "Status", "Akcije"].map(h => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "#888", background: "#fafafa" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cards.map((card, i) => (
              <tr
                key={card.id}
                className="transition-colors"
                style={{ borderBottom: i < cards.length - 1 ? "1px solid #f0f4f8" : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Avatar + Ime */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: card.template?.accentColor ?? "#900a7d" }}
                    >
                      {card.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{card.name}</p>
                      {card.jobTitle && (
                        <p className="text-xs mt-0.5" style={{ color: "#888" }}>{card.jobTitle}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Kompanija */}
                <td className="px-6 py-4 text-sm" style={{ color: "#555" }}>{card.company || "—"}</td>

                {/* Link */}
                <td className="px-6 py-4">
                  <a
                    href={`/card/${card.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                    style={{ color: "#1e9bd7" }}
                  >
                    /{card.slug} <ExternalLink size={11} />
                  </a>
                </td>

                {/* Pregledi */}
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: "#555" }}>
                    <Eye size={13} /> {card.views.toLocaleString()}
                  </span>
                </td>

                {/* Status toggle */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(card.id, card.active)}
                    className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                    style={card.active
                      ? { background: "#d1fae5", color: "#059669" }
                      : { background: "#f5f5f5", color: "#888" }
                    }
                  >
                    {card.active ? "Aktivna" : "Neaktivna"}
                  </button>
                </td>

                {/* Akcije */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {/* Uredi */}
                    <Link
                      href={`/admin/cards/${card.id}/edit`}
                      title="Uredi"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: "#f5e6f4", color: "#900a7d" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9c8e8")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#f5e6f4")}
                    >
                      <Edit2 size={12} /> Uredi
                    </Link>

                    {/* Kopiraj */}
                    <button
                      onClick={() => handleCopy(card.id, card.name)}
                      disabled={copying === card.id}
                      title="Kopiraj karticu"
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                      style={{ color: "#888" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}
                    >
                      <Copy size={15} />
                    </button>

                    {/* QR kod */}
                    <a
                      href={`/api/qr/${card.slug}`}
                      target="_blank"
                      title="QR kod"
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "#888" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#e8f4fc";
                        e.currentTarget.style.color = "#1e9bd7";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#888";
                      }}
                    >
                      <QrCode size={15} />
                    </a>

                    {/* Obriši */}
                    <button
                      onClick={() => handleDelete(card.id, card.name)}
                      disabled={deleting === card.id}
                      title="Obriši"
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                      style={{ color: "#888" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#fef2f2";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#888";
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
