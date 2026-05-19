import { MapPin, ExternalLink } from "lucide-react";

interface Props { address?: string | null; mapsUrl?: string | null; accentColor: string; }

function getEmbedUrl(address?: string | null, mapsUrl?: string | null): string | null {
  // If user provided a Google Maps share/embed link, convert it to embed
  if (mapsUrl) {
    // Already an embed URL
    if (mapsUrl.includes("output=embed") || mapsUrl.includes("/embed")) return mapsUrl;

    // Extract place from share URL e.g. maps.app.goo.gl or google.com/maps/place
    if (mapsUrl.includes("google.com/maps/place")) {
      // Try to get coordinates from @lat,lng format
      const coordMatch = mapsUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        const lat = coordMatch[1], lng = coordMatch[2];
        return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
      }
    }
    // Fallback: search by mapsUrl as query (strips to just use address)
  }

  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
  }

  return null;
}

function getDirectUrl(address?: string | null, mapsUrl?: string | null): string {
  if (mapsUrl) return mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address ?? "")}`;
}

export default function LocationSection({ address, mapsUrl, accentColor }: Props) {
  if (!address && !mapsUrl) return null;

  const embedUrl  = getEmbedUrl(address, mapsUrl);
  const directUrl = getDirectUrl(address, mapsUrl);

  return (
    <section className="mx-4 mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: accentColor }}>Location</p>

      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>

        {/* Address row */}
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `${accentColor}15`, color: accentColor }}>
            <MapPin size={16} />
          </div>
          <div className="flex-1 min-w-0">
            {address && (
              <p className="text-sm font-medium" style={{ color: "#334155" }}>{address}</p>
            )}
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold mt-1 hover:underline"
              style={{ color: accentColor }}
            >
              <ExternalLink size={11} /> Open in Google Maps
            </a>
          </div>
        </div>

        {/* Embedded map */}
        {embedUrl && (
          <div style={{ height: "200px", borderTop: "1px solid #f1f5f9" }}>
            <iframe
              src={embedUrl}
              width="100%"
              height="200"
              style={{ border: 0, display: "block" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location map"
            />
          </div>
        )}
      </div>
    </section>
  );
}
