"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, List, Layers, Users } from "lucide-react";

const navItems = [
  { href: "/admin",           label: "Dashboard", icon: LayoutDashboard, exact: true  },
  { href: "/admin/cards",     label: "Cards",     icon: List,            exact: false },
  { href: "/admin/templates", label: "Templates", icon: Layers,          exact: false },
  { href: "/admin/users",     label: "Users",     icon: Users,           exact: false },
];

export default function AdminHeader({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <header
      className="w-full flex-shrink-0"
      style={{
        background: "#900a7d",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-[60px] flex items-center gap-6">

        {/* ── Logo ── */}
        <Link href="/admin" className="flex items-center gap-3 flex-shrink-0 group">
          <div
            className="w-[42px] h-[42px] rounded-xl overflow-hidden flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              padding: "2px",
            }}
          >
            <Image
              src="/mojsan-logo.png"
              alt="MojSan"
              width={38}
              height={38}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="leading-tight">
            <p className="text-white font-extrabold text-[15px] leading-none tracking-tight">
              MojSan® <span style={{ color: "rgba(255,255,255,0.7)" }}>VCard</span>
            </p>
            <p className="text-[10px] mt-0.5 font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              Admin panel — vizit kartice
            </p>
          </div>
        </Link>

        {/* ── Navigacijski linkovi ── */}
        <nav className="flex items-center gap-0.5 flex-1">
          {navItems.map(({ href, label, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href) &&
                !(href === "/admin/cards" && pathname === "/admin/cards/new");
            return (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color:      active ? "#ffffff" : "rgba(255,255,255,0.65)",
                  background: active ? "rgba(255,255,255,0.18)" : "transparent",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desna strana: odjava ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {email && (
            <span className="hidden lg:block text-xs font-medium mr-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              {email}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            }}
          >
            <LogOut size={14} />
            Odjava
          </button>
        </div>
      </div>
    </header>
  );
}
