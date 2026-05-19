"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { CreditCard, LayoutDashboard, Layers, LogOut, PlusCircle, List } from "lucide-react";

const navItems = [
  { href: "/admin",            label: "Dashboard",    icon: LayoutDashboard, exact: true  },
  { href: "/admin/cards",      label: "Sve kartice",  icon: List,            exact: false },
  { href: "/admin/cards/new",  label: "Nova kartica", icon: PlusCircle,      exact: false },
  { href: "/admin/templates",  label: "Šabloni",      icon: Layers,          exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 min-h-screen flex flex-col flex-shrink-0"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo area */}
      <div
        className="px-5 py-5 flex items-center gap-3"
        style={{ background: "var(--sidebar-dark)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Logo circle — bijeli na magenta */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)" }}
        >
          <CreditCard size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-none tracking-tight">MojSan</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>VCard Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p
          className="text-[10px] uppercase tracking-widest font-semibold px-3 pb-2 pt-1"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Navigacija
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname.startsWith(href) && !(href === "/admin/cards" && pathname === "/admin/cards/new");

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? "rgba(255,255,255,0.22)" : "transparent",
                color: active ? "#ffffff" : "var(--sidebar-text)",
                boxShadow: active ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.background = "var(--sidebar-hover)";
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#ffffff" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider + Odjava */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all"
          style={{ color: "var(--sidebar-text)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--sidebar-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={16} />
          Odjava
        </button>
      </div>
    </aside>
  );
}
