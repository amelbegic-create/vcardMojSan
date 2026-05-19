"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, Layers, Pencil, X, Check } from "lucide-react";

interface Template {
  id: string;
  name: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  _count: { cards: number };
}

const PRESETS = [
  { name: "MojSan Magenta", accentColor: "#900a7d", bgColor: "#f5e6f4", cardBg: "#ffffff" },
  { name: "MojSan Blue",    accentColor: "#1e9bd7", bgColor: "#e8f4fc", cardBg: "#ffffff" },
  { name: "MojSan Dark",    accentColor: "#900a7d", bgColor: "#1a0a14", cardBg: "#2a0e22" },
  { name: "MojSan Mix",     accentColor: "#1e9bd7", bgColor: "#f5e6f4", cardBg: "#ffffff" },
  { name: "Purple",         accentColor: "#8b5cf6", bgColor: "#faf5ff", cardBg: "#ffffff" },
  { name: "Green",          accentColor: "#10b981", bgColor: "#f0fdf4", cardBg: "#ffffff" },
  { name: "Amber",          accentColor: "#f59e0b", bgColor: "#fffbeb", cardBg: "#ffffff" },
  { name: "Dark Class",     accentColor: "#e94560", bgColor: "#1a1a2e", cardBg: "#16213e" },
];

interface ColorField { label: string; val: string; set: (v: string) => void; }

function ColorPicker({ label, val, set }: ColorField) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#888" }}>{label}</label>
      <div className="flex gap-2">
        <input type="color" value={val} onChange={e => set(e.target.value)}
          className="w-10 h-9 rounded-lg border cursor-pointer p-0.5"
          style={{ borderColor: "#e2e8f0", background: "#fff" }} />
        <input value={val} onChange={e => set(e.target.value)}
          className="flex-1 rounded-xl px-3 py-2 text-sm font-mono outline-none"
          style={{ border: "1.5px solid #e2e8f0", background: "#fff", color: "#1a1a1a" }}
          onFocus={e => e.currentTarget.style.borderColor = "#900a7d"}
          onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
      </div>
    </div>
  );
}

function TemplateFormPanel({
  title, name, setName, accent, setAccent, bg, setBg, cardBg, setCardBg,
  textColor, setTextColor, onSave, onCancel, saving, saveLabel,
}: {
  title: string; name: string; setName: (v: string) => void;
  accent: string; setAccent: (v: string) => void;
  bg: string; setBg: (v: string) => void;
  cardBg: string; setCardBg: (v: string) => void;
  textColor: string; setTextColor: (v: string) => void;
  onSave: () => void; onCancel: () => void;
  saving: boolean; saveLabel: string;
}) {
  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f5e6f4" }}>
            <Layers size={16} style={{ color: "#900a7d" }} />
          </div>
          <h3 className="font-bold text-base" style={{ color: "#1a1a1a" }}>{title}</h3>
        </div>
        <button onClick={onCancel} className="p-1.5 rounded-lg" style={{ color: "#888" }}
          onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <X size={16} />
        </button>
      </div>

      {/* Presets */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "#888" }}>Quick presets:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.name} type="button"
              onClick={() => { setName(p.name); setAccent(p.accentColor); setBg(p.bgColor); setCardBg(p.cardBg); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{ border: "1.5px solid #e2e8f0", background: "#f9fafb", color: "#555" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#900a7d"; e.currentTarget.style.color = "#900a7d"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#555"; }}>
              <span className="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0" style={{ background: p.accentColor }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#888" }}>Template name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. MojSan Magenta"
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ border: "1.5px solid #e2e8f0", background: "#fff", color: "#1a1a1a" }}
            onFocus={e => e.currentTarget.style.borderColor = "#900a7d"}
            onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
        </div>
        <ColorPicker label="Accent color" val={accent} set={setAccent} />
        <ColorPicker label="Background" val={bg} set={setBg} />
        <ColorPicker label="Card background" val={cardBg} set={setCardBg} />
        <ColorPicker label="Text color (name, title, company)" val={textColor} set={setTextColor} />
      </div>

      {/* Live preview */}
      <div className="rounded-xl mb-5 flex items-center justify-center gap-4 py-4 px-5" style={{ background: bg, border: "1.5px solid #e2e8f0" }}>
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm" style={{ background: accent }}>A</div>
        <div>
          <p className="text-sm font-bold" style={{ color: textColor }}>John Doe</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: accent }}>Director</p>
          <p className="text-xs mt-0.5" style={{ color: textColor + "99" }}>Company Ltd.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
          style={{ background: "#1e9bd7", boxShadow: "0 4px 14px rgba(30,155,215,0.3)" }}>
          <Save size={15} /> {saving ? "Saving..." : saveLabel}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
          style={{ color: "#555", background: "#f5f7fa", border: "1.5px solid #e2e8f0" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function TemplateManager({ initialTemplates }: { initialTemplates: Template[] }) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);

  // Create state
  const [creating, setCreating] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [cName, setCName]       = useState("");
  const [cAccent, setCAccent]   = useState("#900a7d");
  const [cBg, setCBg]           = useState("#f5e6f4");
  const [cCardBg, setCCardBg]   = useState("#ffffff");
  const [cTextColor, setCTextColor] = useState("#ffffff");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updating, setUpdating]   = useState(false);
  const [eName, setEName]         = useState("");
  const [eAccent, setEAccent]     = useState("#900a7d");
  const [eBg, setEBg]             = useState("#f5e6f4");
  const [eCardBg, setECardBg]     = useState("#ffffff");
  const [eTextColor, setETextColor] = useState("#ffffff");

  function openEdit(t: Template) {
    setCreating(false);
    setEditingId(t.id);
    setEName(t.name);
    setEAccent(t.accentColor);
    setEBg(t.bgColor);
    setECardBg(t.cardBg);
    setETextColor(t.textColor ?? "#ffffff");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeEdit() { setEditingId(null); }

  async function handleCreate() {
    if (!cName.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cName, accentColor: cAccent, bgColor: cBg, cardBg: cCardBg, textColor: cTextColor }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setTemplates([{ ...created, _count: { cards: 0 } }, ...templates]);
      setCreating(false);
      setCName(""); setCAccent("#900a7d"); setCBg("#f5e6f4"); setCCardBg("#ffffff"); setCTextColor("#ffffff");
      toast.success("Template created!");
      router.refresh();
    } catch { toast.error("Error creating template"); }
    finally { setSaving(false); }
  }

  async function handleUpdate() {
    if (!eName.trim()) { toast.error("Name is required"); return; }
    setUpdating(true);
    try {
      const res = await fetch(`/api/templates/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: eName, accentColor: eAccent, bgColor: eBg, cardBg: eCardBg, textColor: eTextColor }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTemplates(templates.map(t => t.id === editingId ? { ...t, ...updated } : t));
      setEditingId(null);
      toast.success("Template updated!");
      router.refresh();
    } catch { toast.error("Error updating template"); }
    finally { setUpdating(false); }
  }

  async function handleDelete(id: string) {
    const t = templates.find(x => x.id === id);
    if (t && t._count.cards > 0) {
      toast.error(`Cannot delete — ${t._count.cards} card(s) use this template`);
      return;
    }
    if (!confirm("Delete this template?")) return;
    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE" });
      setTemplates(templates.filter(x => x.id !== id));
      if (editingId === id) setEditingId(null);
      toast.success("Template deleted");
      router.refresh();
    } catch { toast.error("Error deleting template"); }
  }

  return (
    <div>
      {/* Top action bar */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => { setCreating(!creating); setEditingId(null); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
          style={{ background: creating ? "#900a7d" : "#1e9bd7", boxShadow: creating ? "0 4px 14px rgba(144,10,125,0.3)" : "0 4px 14px rgba(30,155,215,0.3)" }}>
          {creating ? <X size={16} /> : <Plus size={16} />}
          {creating ? "Cancel" : "New template"}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <TemplateFormPanel
          title="Create new template"
          name={cName} setName={setCName}
          accent={cAccent} setAccent={setCAccent}
          bg={cBg} setBg={setCBg}
          cardBg={cCardBg} setCardBg={setCCardBg}
          textColor={cTextColor} setTextColor={setCTextColor}
          onSave={handleCreate} onCancel={() => setCreating(false)}
          saving={saving} saveLabel="Create template"
        />
      )}

      {/* Edit form */}
      {editingId && (
        <TemplateFormPanel
          title={`Edit — ${templates.find(t => t.id === editingId)?.name ?? ""}`}
          name={eName} setName={setEName}
          accent={eAccent} setAccent={setEAccent}
          bg={eBg} setBg={setEBg}
          cardBg={eCardBg} setCardBg={setECardBg}
          textColor={eTextColor} setTextColor={setETextColor}
          onSave={handleUpdate} onCancel={closeEdit}
          saving={updating} saveLabel="Save changes"
        />
      )}

      {/* Template grid */}
      {templates.length === 0 ? (
        <div className="rounded-2xl py-16 text-center" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>
          <p className="text-sm font-medium" style={{ color: "#888" }}>No templates yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {templates.map(t => {
            const isEditing = editingId === t.id;
            return (
              <div
                key={t.id}
                className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
                style={{
                  border: isEditing ? "2px solid #900a7d" : "1.5px solid #e2e8f0",
                  background: "#fff",
                  boxShadow: isEditing ? "0 0 0 3px rgba(144,10,125,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {/* Color preview header */}
                <div className="h-14 relative" style={{ background: t.bgColor }}>
                  <div className="absolute inset-0" style={{ background: t.accentColor + "22" }} />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-10 h-10 rounded-full border-4 border-white shadow-md" style={{ background: t.accentColor }} />
                  </div>
                </div>

                {/* Info */}
                <div className="pt-7 pb-4 px-3 text-center">
                  <p className="text-xs font-bold leading-tight" style={{ color: "#1a1a1a" }}>{t.name}</p>
                  <p className="text-[10px] mt-0.5 mb-2.5" style={{ color: "#888" }}>
                    {t._count.cards} {t._count.cards === 1 ? "card" : "cards"}
                  </p>

                  {/* Colour swatches */}
                  <div className="flex gap-1 justify-center mb-3">
                    {[t.accentColor, t.bgColor, t.cardBg].map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white shadow-sm" title={c}
                        style={{ background: c, outline: "1px solid #e2e8f0" }} />
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1.5 justify-center">
                    {/* Edit */}
                    <button
                      onClick={() => isEditing ? closeEdit() : openEdit(t)}
                      title={isEditing ? "Cancel edit" : "Edit template"}
                      className="flex items-center gap-1 text-[10px] font-semibold transition-colors px-2.5 py-1.5 rounded-lg"
                      style={{
                        color:      isEditing ? "#900a7d" : "#1e9bd7",
                        background: isEditing ? "#f5e6f4"  : "#e8f4fc",
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      {isEditing ? <Check size={10} /> : <Pencil size={10} />}
                      {isEditing ? "Editing" : "Edit"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(t.id)}
                      title="Delete template"
                      className="flex items-center gap-1 text-[10px] font-semibold transition-colors px-2.5 py-1.5 rounded-lg"
                      style={{ color: "#ef4444", background: "#fef2f2" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fecaca")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#fef2f2")}
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
