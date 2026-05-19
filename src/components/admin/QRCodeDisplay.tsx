"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, QrCode, ExternalLink } from "lucide-react";

interface QRCodeDisplayProps {
  slug: string;
  baseUrl?: string;
}

export default function QRCodeDisplay({ slug, baseUrl }: QRCodeDisplayProps) {
  const [loading, setLoading] = useState(false);
  const cardUrl = `${baseUrl || ""}/card/${slug}`;

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/qr/${slug}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `qr-${slug}.png`; a.click();
      URL.revokeObjectURL(url);
    } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
          <QrCode size={16} style={{ color: "var(--primary)" }} />
        </div>
        <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>QR Kod</h3>
      </div>

      {/* QR Image */}
      <div className="rounded-xl overflow-hidden border p-3 mb-3 w-fit mx-auto" style={{ borderColor: "var(--border)" }}>
        <Image src={`/api/qr/${slug}`} alt="QR kod" width={160} height={160} unoptimized className="block" />
      </div>

      {/* URL */}
      <a href={`/card/${slug}`} target="_blank" className="flex items-center justify-center gap-1 text-xs font-mono mb-4 hover:underline truncate" style={{ color: "var(--primary)" }}>
        <ExternalLink size={11} /> {cardUrl}
      </a>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: "var(--primary)" }}
      >
        <Download size={15} />
        {loading ? "Preuzimanje..." : "Preuzmi PNG"}
      </button>
    </div>
  );
}
