import { User, Phone, Mail, Building2, Globe, MapPin } from "lucide-react";

interface Props {
  name: string; phone?: string | null; phone2?: string | null;
  email?: string | null; company?: string | null; website?: string | null;
  address?: string | null; accentColor: string;
}

function Row({ icon, label, value, href, accent, last }: { icon: React.ReactNode; label: string; value: string; href?: string; accent: string; last: boolean }) {
  return (
    <>
      <div className="flex items-center gap-3.5 py-3.5 px-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}12`, color: accent }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest mb-0.5 font-medium" style={{ color: "#94a3b8" }}>{label}</p>
          {href ? (
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-sm font-medium truncate block hover:underline" style={{ color: "#0f172a" }}>
              {value}
            </a>
          ) : (
            <p className="text-sm truncate" style={{ color: "#334155" }}>{value}</p>
          )}
        </div>
      </div>
      {!last && <div className="h-px mx-4" style={{ background: "#f1f5f9" }} />}
    </>
  );
}

export default function ContactSection({ name, phone, phone2, email, company, website, address, accentColor }: Props) {
  const rows = [
    { icon: <User size={16} />,     label: "Name",         value: name,                                href: undefined },
    phone  ? { icon: <Phone size={16} />,    label: "Phone",       value: phone,  href: `tel:${phone}` } : null,
    phone2 ? { icon: <Phone size={16} />,    label: "Phone 2",     value: phone2, href: `tel:${phone2}` } : null,
    email  ? { icon: <Mail size={16} />,     label: "Email",       value: email,  href: `mailto:${email}` } : null,
    company ? { icon: <Building2 size={16} />, label: "Company",   value: company, href: undefined } : null,
    website ? { icon: <Globe size={16} />,   label: "Website",     value: website.replace(/^https?:\/\//, ""), href: website.startsWith("http") ? website : `https://${website}` } : null,
    address ? { icon: <MapPin size={16} />,  label: "Address",     value: address, href: undefined } : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[];

  if (rows.length === 0) return null;

  return (
    <section className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-sm" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>
      {rows.map((r, i) => (
        <Row key={r.label} icon={r.icon} label={r.label} value={r.value} href={r.href} accent={accentColor} last={i === rows.length - 1} />
      ))}
    </section>
  );
}
