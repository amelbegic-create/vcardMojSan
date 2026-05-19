"use client";

import { Phone, MessageSquare, Mail, MessageCircle } from "lucide-react";

interface ActionButtonsProps {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  accentColor: string;
}

export default function ActionButtons({ phone, email, whatsapp, accentColor }: ActionButtonsProps) {
  const buttons = [
    { label: "Call",     icon: <Phone size={20} />,         href: phone ? `tel:${phone}` : null },
    { label: "SMS",      icon: <MessageSquare size={20} />, href: phone ? `sms:${phone}` : null },
    { label: "Email",    icon: <Mail size={20} />,           href: email ? `mailto:${email}` : null },
    { label: "WhatsApp", icon: <MessageCircle size={20} />,  href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g,"")}` : phone ? `https://wa.me/${phone.replace(/\D/g,"")}` : null },
  ];

  return (
    <div className="flex justify-center gap-3 py-4 px-4">
      {buttons.map(btn => btn.href ? (
        <a key={btn.label} href={btn.href}
          target={btn.label === "WhatsApp" ? "_blank" : undefined}
          rel={btn.label === "WhatsApp" ? "noopener noreferrer" : undefined}
          className="flex flex-col items-center gap-1.5 group">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 group-active:scale-95"
            style={{ background: "rgba(255,255,255,0.92)", color: "#1a1a1a" }}>
            {btn.icon}
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{btn.label}</span>
        </a>
      ) : (
        <div key={btn.label} className="flex flex-col items-center gap-1.5 opacity-30">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.4)" }}>
            {btn.icon}
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{btn.label}</span>
        </div>
      ))}
    </div>
  );
}
