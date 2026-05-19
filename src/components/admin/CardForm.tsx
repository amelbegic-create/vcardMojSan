"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Save, Plus, Trash2, ExternalLink, Eye, Globe, Code2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import GalleryUploader from "./GalleryUploader";
import TemplateSelector from "./TemplateSelector";
import type { CardWithTemplate, CustomLink } from "@/lib/types";

interface CardFormProps { card?: CardWithTemplate; }

function slugify(t: string) {
  return t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
}

function Field({ label, value, onChange, placeholder, type = "text", textarea = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; textarea?: boolean;
}) {
  const baseStyle = {
    background: "var(--surface)",
    border: "1.5px solid var(--border)",
    color: "var(--text)",
    borderRadius: "10px",
    width: "100%",
    padding: "8px 12px",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
  };
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            style={{ ...baseStyle, resize: "none" }}
            onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={baseStyle}
            onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
      }
    </div>
  );
}

export default function CardForm({ card }: CardFormProps) {
  const router = useRouter();
  const isEdit = !!card;
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"info"|"media"|"social">("info");

  const [name, setName]         = useState(card?.name ?? "");
  const [slug, setSlug]         = useState(card?.slug ?? "");
  const [jobTitle, setJobTitle] = useState(card?.jobTitle ?? "");
  const [company, setCompany]   = useState(card?.company ?? "");
  const [phone, setPhone]       = useState(card?.phone ?? "");
  const [phone2, setPhone2]     = useState(card?.phone2 ?? "");
  const [email, setEmail]       = useState(card?.email ?? "");
  const [website, setWebsite]   = useState(card?.website ?? "");
  const [address, setAddress]   = useState(card?.address ?? "");
  const [mapsUrl, setMapsUrl]   = useState(card?.mapsUrl ?? "");
  const [bio, setBio]           = useState(card?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(card?.avatarUrl ?? null);
  const [coverUrl, setCoverUrl]   = useState<string | null>(card?.coverUrl ?? null);
  const [gallery, setGallery]     = useState<string[]>(card?.gallery ?? []);
  const [facebook, setFacebook]   = useState(card?.facebook ?? "");
  const [instagram, setInstagram] = useState(card?.instagram ?? "");
  const [linkedin, setLinkedin]   = useState(card?.linkedin ?? "");
  const [youtube, setYoutube]     = useState(card?.youtube ?? "");
  const [whatsapp, setWhatsapp]   = useState(card?.whatsapp ?? "");
  const [customLinks, setCustomLinks] = useState<CustomLink[]>((card?.customLinks as CustomLink[]) ?? []);
  const [templateId, setTemplateId]   = useState<string | null>(card?.templateId ?? null);
  const [active, setActive]           = useState(card?.active ?? true);

  function handleNameChange(v: string) { setName(v); if (!isEdit) setSlug(slugify(v)); }

  async function handleSave() {
    if (!name.trim()) { toast.error("Ime je obavezno"); return; }
    if (!slug.trim()) { toast.error("Slug je obavezan"); return; }
    setSaving(true);
    try {
      const payload = { name, slug, jobTitle, company, phone, phone2, email, website, address, mapsUrl, bio, avatarUrl, coverUrl, gallery, facebook, instagram, linkedin, youtube, whatsapp, customLinks: customLinks.filter(l => l.label && l.url), templateId, active };
      const res = isEdit
        ? await fetch(`/api/cards/${card!.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/cards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Greška"); }
      toast.success(isEdit ? "Kartica ažurirana!" : "Kartica kreirana!");
      router.push("/admin/cards"); router.refresh();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Greška"); }
    finally { setSaving(false); }
  }

  function handleExportHtml() {
    const accent = "#900a7d";
    const bg = "#f5e6f4";

    const socials = [
      facebook && `<a href="${facebook}" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#1877f2;color:white;text-decoration:none;font-size:14px;font-weight:bold;margin:0 4px;">f</a>`,
      instagram && `<a href="${instagram}" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:white;text-decoration:none;font-size:14px;font-weight:bold;margin:0 4px;">in</a>`,
      linkedin && `<a href="${linkedin}" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#0a66c2;color:white;text-decoration:none;font-size:14px;font-weight:bold;margin:0 4px;">li</a>`,
      whatsapp && `<a href="https://wa.me/${whatsapp.replace(/\D/g, "")}" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#25d366;color:white;text-decoration:none;font-size:14px;font-weight:bold;margin:0 4px;">wa</a>`,
    ].filter(Boolean).join("");

    const customLinksHtml = customLinks.filter(l => l.label && l.url).map(l =>
      `<a href="${l.url}" style="display:block;padding:12px 16px;margin-bottom:8px;background:white;border-radius:12px;border:1px solid #e2e8f0;color:#1a1a1a;text-decoration:none;font-size:13px;font-weight:600;text-align:center;">${l.label}</a>`
    ).join("");

    const html = `<!DOCTYPE html>
<html lang="bs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} — Digitalna vizit kartica</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${bg}; min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 24px 16px; }
  .card { background: white; border-radius: 24px; max-width: 420px; width: 100%; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
  .cover { height: 140px; background: linear-gradient(135deg, ${accent}33, ${accent}66); position: relative; }
  .cover img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-wrap { display: flex; flex-direction: column; align-items: center; margin-top: -44px; padding: 0 24px; }
  .avatar { width: 88px; height: 88px; border-radius: 50%; border: 4px solid white; overflow: hidden; background: ${accent}; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .name { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 12px; text-align: center; }
  .title { font-size: 14px; color: ${accent}; font-weight: 600; margin-top: 4px; text-align: center; }
  .company { font-size: 13px; color: #64748b; margin-top: 2px; text-align: center; }
  .bio { font-size: 13px; color: #94a3b8; margin-top: 10px; text-align: center; line-height: 1.6; padding: 0 16px; }
  .actions { display: flex; justify-content: center; gap: 12px; padding: 16px; }
  .action-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; text-decoration: none; }
  .action-circle { width: 48px; height: 48px; border-radius: 14px; background: ${bg}; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .action-label { font-size: 10px; color: #94a3b8; font-weight: 500; }
  .save-btn { display: block; margin: 0 16px 16px; padding: 14px; background: ${accent}; color: white; text-align: center; border-radius: 100px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 14px rgba(144,10,125,0.3); }
  .info-card { margin: 0 16px 12px; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
  .info-row { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
  .info-row:last-child { border-bottom: none; }
  .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; }
  .info-value { font-size: 14px; color: #0f172a; font-weight: 500; margin-top: 2px; }
  .info-value a { color: #1e9bd7; text-decoration: none; }
  .socials { display: flex; justify-content: center; gap: 8px; padding: 12px 16px; }
  .custom-links { padding: 0 16px 16px; }
  .footer { text-align: center; padding: 16px; font-size: 11px; color: #cbd5e1; border-top: 1px solid #f1f5f9; }
  .footer a { color: ${accent}; text-decoration: none; font-weight: 600; }
</style>
</head>
<body>
<div class="card">
  <div class="cover">${coverUrl ? `<img src="${coverUrl}" alt="Cover">` : ""}</div>
  <div class="avatar-wrap">
    <div class="avatar">${avatarUrl ? `<img src="${avatarUrl}" alt="${name}">` : name.charAt(0).toUpperCase()}</div>
    <div class="name">${name}</div>
    ${jobTitle ? `<div class="title">${jobTitle}</div>` : ""}
    ${company ? `<div class="company">${company}</div>` : ""}
    ${bio ? `<div class="bio">${bio}</div>` : ""}
  </div>
  <div class="actions">
    ${phone ? `<a href="tel:${phone}" class="action-btn"><div class="action-circle">📞</div><span class="action-label">Poziv</span></a>` : ""}
    ${phone ? `<a href="sms:${phone}" class="action-btn"><div class="action-circle">💬</div><span class="action-label">SMS</span></a>` : ""}
    ${email ? `<a href="mailto:${email}" class="action-btn"><div class="action-circle">📧</div><span class="action-label">Email</span></a>` : ""}
    ${(whatsapp || phone) ? `<a href="https://wa.me/${(whatsapp || phone).replace(/\D/g, "")}" class="action-btn"><div class="action-circle">💚</div><span class="action-label">WhatsApp</span></a>` : ""}
  </div>
  <a href="#" onclick="downloadVCF()" class="save-btn">💾 Spremi kontakt</a>
  <div class="info-card">
    ${name ? `<div class="info-row"><div class="info-label">Ime</div><div class="info-value">${name}</div></div>` : ""}
    ${phone ? `<div class="info-row"><div class="info-label">Telefon</div><div class="info-value"><a href="tel:${phone}">${phone}</a></div></div>` : ""}
    ${phone2 ? `<div class="info-row"><div class="info-label">Telefon 2</div><div class="info-value"><a href="tel:${phone2}">${phone2}</a></div></div>` : ""}
    ${email ? `<div class="info-row"><div class="info-label">Email</div><div class="info-value"><a href="mailto:${email}">${email}</a></div></div>` : ""}
    ${website ? `<div class="info-row"><div class="info-label">Web</div><div class="info-value"><a href="${website}">${website}</a></div></div>` : ""}
    ${address ? `<div class="info-row"><div class="info-label">Adresa</div><div class="info-value">${address}</div></div>` : ""}
  </div>
  ${socials ? `<div class="socials">${socials}</div>` : ""}
  ${customLinksHtml ? `<div class="custom-links">${customLinksHtml}</div>` : ""}
  <div class="footer">Powered by <a href="https://mojsan.ba">MojSan® VCard</a></div>
</div>
<script>
function downloadVCF() {
  const vcf = \`BEGIN:VCARD\\nVERSION:3.0\\nFN:${name}\\n${jobTitle ? `TITLE:${jobTitle}\\n` : ""}${company ? `ORG:${company}\\n` : ""}${phone ? `TEL:${phone}\\n` : ""}${email ? `EMAIL:${email}\\n` : ""}${website ? `URL:${website}\\n` : ""}END:VCARD\`;
  const a = document.createElement('a');
  a.href = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcf);
  a.download = '${slugify(name)}.vcf';
  a.click();
}
</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || slugify(name) || "kartica"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML exportovan!");
  }

  const accent = "#900a7d";
  const tabs = [{ id: "info", label: "Informacije" }, { id: "media", label: "Mediji" }, { id: "social", label: "Društvene mreže" }] as const;

  return (
    <div className="flex gap-6">
      {/* FORM */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-black" style={{ color: "#1a1a1a" }}>
              {isEdit ? `Uredi karticu` : "Nova kartica"}
            </h1>
            {isEdit && (
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm font-semibold" style={{ color: "#900a7d" }}>{card!.name}</p>
                <a href={`/card/${card!.slug}`} target="_blank"
                  className="inline-flex items-center gap-1 text-xs hover:underline"
                  style={{ color: "#1e9bd7" }}>
                  <ExternalLink size={11} /> Pogledaj karticu
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Active toggle */}
            <button type="button" onClick={() => setActive(!active)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all"
              style={{
                background: active ? "#d1fae5" : "#f5f5f5",
                color: active ? "#059669" : "#888",
                border: `1px solid ${active ? "#a7f3d0" : "#e2e8f0"}`
              }}>
              <span className={`w-2 h-2 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
              {active ? "Aktivna" : "Neaktivna"}
            </button>
            {/* HTML Export */}
            <button onClick={handleExportHtml}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "#f5e6f4", color: "#900a7d", border: "1px solid #f0c8e8" }}>
              <Code2 size={15} /> HTML
            </button>
            {/* Save */}
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#1e9bd7", boxShadow: "0 4px 14px rgba(30,155,215,0.3)" }}>
              <Save size={15} /> {saving ? "Spremanje..." : "Spremi"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ background: "var(--surface)", border: "1px solid var(--border-light)" }}>
          {tabs.map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: tab === t.id ? "#900a7d" : "transparent", color: tab === t.id ? "#fff" : "#555", boxShadow: tab === t.id ? "0 2px 8px rgba(144,10,125,0.2)" : "none" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Form content */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--surface)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>

          {/* INFO */}
          {tab === "info" && <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Puno ime *" value={name} onChange={handleNameChange} placeholder="Ime Prezime" />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>URL Slug *</label>
                <div className="flex items-center rounded-[10px] overflow-hidden" style={{ border: "1.5px solid var(--border)" }}
                  onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"}
                  onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}>
                  <span className="px-2.5 text-xs py-2 flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--text-muted)", borderRight: "1px solid var(--border)" }}>/card/</span>
                  <input value={slug} onChange={e => setSlug(slugify(e.target.value))} placeholder="ime-prezime"
                    className="flex-1 px-2.5 py-2 text-sm outline-none" style={{ background: "transparent", color: "var(--text)" }} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pozicija" value={jobTitle} onChange={setJobTitle} placeholder="Direktor" />
              <Field label="Kompanija" value={company} onChange={setCompany} placeholder="MojSan d.o.o." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefon" value={phone} onChange={setPhone} placeholder="+387 61 123 456" type="tel" />
              <Field label="Telefon 2" value={phone2} onChange={setPhone2} placeholder="+387 33 123 456" type="tel" />
            </div>
            <Field label="Email" value={email} onChange={setEmail} placeholder="ime@primjer.ba" type="email" />
            <Field label="Web stranica" value={website} onChange={setWebsite} placeholder="https://primjer.ba" />
            <Field label="O meni / Bio" value={bio} onChange={setBio} placeholder="Kratki opis..." textarea />
            <Field label="Adresa" value={address} onChange={setAddress} placeholder="Ulica bb, Sarajevo" />
            <Field label="Google Maps URL" value={mapsUrl} onChange={setMapsUrl} placeholder="https://maps.google.com/..." />
            <div className="pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
              <TemplateSelector value={templateId} onChange={setTemplateId} />
            </div>
          </>}

          {/* MEDIA */}
          {tab === "media" && <>
            <div className="grid grid-cols-2 gap-4">
              <ImageUploader label="Profilna fotografija" value={avatarUrl} onChange={setAvatarUrl} type="avatar" aspectRatio="square" />
              <ImageUploader label="Naslovna fotografija" value={coverUrl} onChange={setCoverUrl} type="cover" aspectRatio="wide" />
            </div>
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
              <GalleryUploader images={gallery} onChange={setGallery} />
            </div>
          </>}

          {/* SOCIAL */}
          {tab === "social" && <>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Profili na društvenim mrežama</p>
            <Field label="Facebook" value={facebook} onChange={setFacebook} placeholder="https://facebook.com/..." />
            <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/..." />
            <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
            <Field label="YouTube" value={youtube} onChange={setYoutube} placeholder="https://youtube.com/@..." />
            <Field label="WhatsApp broj" value={whatsapp} onChange={setWhatsapp} placeholder="+387 61 123 456" />
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                  <Globe size={12} /> Prilagođeni linkovi
                </p>
                <button type="button" onClick={() => setCustomLinks([...customLinks, { label: "", url: "" }])}
                  className="flex items-center gap-1 text-xs font-semibold hover:underline" style={{ color: "var(--primary)" }}>
                  <Plus size={12} /> Dodaj link
                </button>
              </div>
              {customLinks.length === 0 && <p className="text-xs italic" style={{ color: "var(--text-light)" }}>Nema prilagođenih linkova.</p>}
              {customLinks.map((l, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="Naziv" value={l.label} onChange={e => { const u = [...customLinks]; u[i] = { ...u[i], label: e.target.value }; setCustomLinks(u); }}
                    className="flex-1 rounded-[10px] px-3 py-2 text-sm outline-none" style={{ border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)" }} />
                  <input placeholder="https://..." value={l.url} onChange={e => { const u = [...customLinks]; u[i] = { ...u[i], url: e.target.value }; setCustomLinks(u); }}
                    className="flex-1 rounded-[10px] px-3 py-2 text-sm outline-none" style={{ border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)" }} />
                  <button type="button" onClick={() => setCustomLinks(customLinks.filter((_, j) => j !== i))}
                    className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-8">
          <div className="flex items-center gap-1.5 mb-3">
            <Eye size={13} style={{ color: "var(--text-muted)" }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Pregled</p>
          </div>

          {/* Phone frame */}
          <div className="rounded-[24px] overflow-hidden border-2 shadow-lg no-scrollbar" style={{ borderColor: "var(--border)", height: "500px", overflowY: "auto", background: "#fff" }}>
            {/* Cover */}
            <div className="relative h-28 overflow-hidden">
              {coverUrl
                ? <Image src={coverUrl} alt="" fill className="object-cover" sizes="256px" />
                : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}44)` }} />
              }
            </div>
            {/* Avatar */}
            <div className="flex flex-col items-center" style={{ marginTop: "-30px" }}>
              <div className="w-16 h-16 rounded-full border-3 border-white overflow-hidden relative flex-shrink-0 shadow" style={{ border: "3px solid white" }}>
                {avatarUrl
                  ? <Image src={avatarUrl} alt="" fill className="object-cover" sizes="64px" />
                  : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white" style={{ background: accent }}>
                      {name ? name.charAt(0).toUpperCase() : "?"}
                    </div>
                }
              </div>
              <div className="text-center mt-2 px-3">
                <p className="text-sm font-bold leading-tight" style={{ color: "#0f172a" }}>{name || "Ime Prezime"}</p>
                {jobTitle && <p className="text-xs mt-0.5 font-medium" style={{ color: accent }}>{jobTitle}</p>}
                {company && <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{company}</p>}
              </div>
              {bio && <p className="text-[10px] text-center px-3 mt-1.5 leading-relaxed" style={{ color: "#94a3b8" }}>{bio}</p>}
              {/* Action row */}
              <div className="flex gap-2.5 py-3">
                {[{ l: "Poziv", s: !!phone }, { l: "SMS", s: !!phone }, { l: "Email", s: !!email }, { l: "WA", s: !!(whatsapp || phone) }].map(b => (
                  <div key={b.l} className={`flex flex-col items-center gap-0.5 ${!b.s ? "opacity-25" : ""}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-bold" style={{ background: "#f0fdfc", color: accent }}>{b.l[0]}</div>
                    <span className="text-[8px]" style={{ color: "#94a3b8" }}>{b.l}</span>
                  </div>
                ))}
              </div>
              {/* Save btn */}
              <div className="px-3 w-full mb-3">
                <div className="w-full py-1.5 rounded-full text-white text-[10px] font-semibold text-center" style={{ background: accent }}>Spremi kontakt</div>
              </div>
              {/* Info rows */}
              {(phone || email || company) && (
                <div className="mx-3 mb-3 w-[calc(100%-1.5rem)] rounded-xl overflow-hidden border" style={{ borderColor: "#e2e8f0" }}>
                  {[{ l: "Ime", v: name }, { l: "Telefon", v: phone }, { l: "Email", v: email }].filter(r => r.v).map((r, i, a) => (
                    <div key={r.l}>
                      <div className="px-3 py-1.5">
                        <p className="text-[7px] uppercase tracking-wider" style={{ color: "#94a3b8" }}>{r.l}</p>
                        <p className="text-[9px] font-medium truncate" style={{ color: "#0f172a" }}>{r.v}</p>
                      </div>
                      {i < a.length - 1 && <div className="h-px" style={{ background: "#f1f5f9" }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {slug && (
            <a href={`/card/${slug}`} target="_blank"
              className="flex items-center justify-center gap-1 mt-3 text-xs font-medium hover:underline" style={{ color: "var(--primary)" }}>
              <ExternalLink size={11} /> /card/{slug}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
