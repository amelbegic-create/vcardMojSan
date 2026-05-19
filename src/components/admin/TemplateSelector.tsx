"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface Template { id: string; name: string; accentColor: string; bgColor: string; cardBg: string; }

export default function TemplateSelector({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetch("/api/templates").then(r => r.json()).then(setTemplates).catch(() => {});
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Šablon boja</label>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onChange(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all"
          style={{ borderColor: !value ? "var(--primary)" : "var(--border)", background: !value ? "var(--primary-light)" : "var(--surface)", color: !value ? "var(--primary)" : "var(--text-muted)" }}>
          {!value && <Check size={13} />} Zadani
        </button>
        {templates.map(t => (
          <button key={t.id} type="button" onClick={() => onChange(t.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all"
            style={{ borderColor: value === t.id ? "var(--primary)" : "var(--border)", background: value === t.id ? "var(--primary-light)" : "var(--surface)", color: value === t.id ? "var(--primary)" : "var(--text-muted)" }}>
            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: t.accentColor }} />
            {t.name}
            {value === t.id && <Check size={13} />}
          </button>
        ))}
      </div>
    </div>
  );
}
