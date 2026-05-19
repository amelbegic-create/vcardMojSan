"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, PlusCircle, Layers } from "lucide-react";

const navItems = [
  { href: "/admin",           label: "Dashboard",    icon: LayoutDashboard, exact: true  },
  { href: "/admin/cards",     label: "Sve kartice",  icon: List,            exact: false },
  { href: "/admin/cards/new", label: "Nova kartica", icon: PlusCircle,      exact: false },
  { href: "/admin/templates", label: "Šabloni",      icon: Layers,          exact: false },
];

export default function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="w-full sticky top-0 z-40"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-[48px] flex items-center gap-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname.startsWith(href) &&
              !(href === "/admin/cards" && pathname === "/admin/cards/new");

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color:      active ? "#900a7d" : "#555555",
                background: active ? "#f5e6f4" : "transparent",
                fontWeight: active ? 600 : 500,
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = "#f5f7fa";
                  e.currentTarget.style.color = "#1a1a1a";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#555555";
                }
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
