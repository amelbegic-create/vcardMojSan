"use client";

import { Download } from "lucide-react";

export default function SaveContactButton({ slug, accentColor }: { slug: string; accentColor: string }) {
  return (
    <div className="px-4 mb-4">
      <a href={`/api/vcf/${slug}`} download
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: "#ffffff", color: "#1a1a1a" }}>
        <Download size={17} />
        Save Contact
      </a>
    </div>
  );
}
