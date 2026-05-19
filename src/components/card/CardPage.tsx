import Image from "next/image";
import ActionButtons from "./ActionButtons";
import ContactSection from "./ContactSection";
import SaveContactButton from "./SaveContactButton";
import LocationSection from "./LocationSection";
import GallerySection from "./GallerySection";
import SocialSection from "./SocialSection";
import WebLinksSection from "./WebLinksSection";
import type { CardWithTemplate, CustomLink } from "@/lib/types";

export default function CardPage({ card }: { card: CardWithTemplate }) {
  const accent    = card.template?.accentColor ?? "#900a7d";
  const bgColor   = card.template?.bgColor     ?? "#f5e6f4";
  const textColor = (card.template as { textColor?: string } | null)?.textColor ?? "#ffffff";
  const customLinks = (card.customLinks as CustomLink[] | null) ?? [];

  return (
    <div className="min-h-screen" style={{ background: bgColor, fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto max-w-[480px] relative pb-10">

        {/* Cover image */}
        <div className="relative w-full h-[200px] overflow-hidden">
          {card.coverUrl ? (
            <Image src={card.coverUrl} alt="Cover" fill className="object-cover" priority sizes="480px" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent}88)` }} />
          )}
        </div>

        {/* Avatar — overlaps cover */}
        <div className="relative flex flex-col items-center" style={{ marginTop: "-60px" }}>
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden relative flex-shrink-0"
            style={{ border: "4px solid white", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", background: "#e2e8f0" }}>
            {card.avatarUrl ? (
              <Image src={card.avatarUrl} alt={card.name} fill className="object-cover" sizes="120px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white" style={{ background: accent }}>
                {card.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name & title */}
          <div className="text-center mt-3 px-4">
            <h1 className="text-[22px] font-bold leading-tight" style={{ color: textColor }}>{card.name}</h1>
            {card.jobTitle && <p className="text-sm font-semibold mt-0.5" style={{ color: textColor, opacity: 0.85 }}>{card.jobTitle}</p>}
            {card.company && <p className="text-xs mt-0.5" style={{ color: textColor, opacity: 0.7 }}>{card.company}</p>}
          </div>

          {/* Bio */}
          {card.bio && (
            <p className="text-sm text-center px-6 mt-3 leading-relaxed" style={{ color: textColor, opacity: 0.65 }}>
              {card.bio}
            </p>
          )}

          {/* Action buttons */}
          <ActionButtons phone={card.phone} email={card.email} whatsapp={card.whatsapp} accentColor={accent} />
        </div>

        {/* Save to Contacts */}
        <SaveContactButton slug={card.slug} accentColor={accent} />

        {/* Contact info */}
        <ContactSection
          name={card.name} phone={card.phone} phone2={card.phone2} email={card.email}
          company={card.company} website={card.website} address={card.address} accentColor={accent}
        />

        {/* Location */}
        <LocationSection address={card.address} mapsUrl={card.mapsUrl} accentColor={accent} />

        {/* Gallery */}
        <GallerySection images={card.gallery} accentColor={accent} />

        {/* Social */}
        <SocialSection
          facebook={card.facebook} instagram={card.instagram} linkedin={card.linkedin}
          youtube={card.youtube} whatsapp={card.whatsapp} accentColor={accent}
        />

        {/* Web Links */}
        <WebLinksSection links={customLinks} accentColor={accent} />

        {/* Footer */}
        <div className="text-center mt-6 pb-2">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Powered by <span className="font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>MojSan</span> <span className="font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>VCard</span></p>
        </div>
      </div>
    </div>
  );
}
