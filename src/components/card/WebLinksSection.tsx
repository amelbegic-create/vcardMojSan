import { Globe, ChevronRight } from "lucide-react";
import type { CustomLink } from "@/lib/types";

export default function WebLinksSection({ links, accentColor }: { links: CustomLink[]; accentColor: string }) {
  if (!links?.length) return null;
  return (
    <section className="mx-4 mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: accentColor }}>Links</p>
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>
        {links.map((link, i) => (
          <div key={i}>
            <a href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accentColor}12`, color: accentColor }}>
                <Globe size={15} />
              </div>
              <span className="text-sm font-medium flex-1" style={{ color: "#0f172a" }}>{link.label}</span>
              <ChevronRight size={15} style={{ color: "#94a3b8" }} />
            </a>
            {i < links.length - 1 && <div className="h-px mx-4" style={{ background: "#f1f5f9" }} />}
          </div>
        ))}
      </div>
    </section>
  );
}
