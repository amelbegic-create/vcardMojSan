import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  CreditCard, Eye, TrendingUp, Layers,
  PlusCircle, ArrowRight, Users, QrCode,
} from "lucide-react";

function StatCard({
  icon: Icon, label, value, iconColor, iconBg,
}: {
  icon: React.ElementType; label: string; value: string | number;
  iconColor: string; iconBg: string;
}) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "#fff", border: "1px solid #e8eaed", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#999" }}>{label}</p>
        <p className="text-2xl font-black" style={{ color: "#1a1a1a" }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href, icon: Icon, label, desc, color,
}: {
  href: string; icon: React.ElementType; label: string; desc: string; color: string;
}) {
  return (
    <Link href={href}
      className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
      style={{ background: "#fff", border: "1px solid #e8eaed", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{label}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "#888" }}>{desc}</p>
      </div>
      <ArrowRight size={16} style={{ color: "#ccc" }} className="flex-shrink-0 group-hover:text-gray-400 transition-colors" />
    </Link>
  );
}

export default async function AdminDashboard() {
  const [totalCards, totalViews, activeCards, totalTemplates, totalUsers, recentCards] = await Promise.all([
    prisma.card.count(),
    prisma.card.aggregate({ _sum: { views: true } }),
    prisma.card.count({ where: { active: true } }),
    prisma.template.count(),
    prisma.adminUser.count(),
    prisma.card.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { template: true } }),
  ]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-black" style={{ color: "#1a1a1a" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#666" }}>Welcome to MojSan VCard admin panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CreditCard} label="Total Cards"    value={totalCards}                  iconColor="#900a7d" iconBg="#f5e6f4" />
        <StatCard icon={Eye}        label="Total Views"    value={totalViews._sum.views ?? 0}  iconColor="#1e9bd7" iconBg="#e8f4fc" />
        <StatCard icon={TrendingUp} label="Active Cards"   value={activeCards}                 iconColor="#10b981" iconBg="#d1fae5" />
        <StatCard icon={Layers}     label="Templates"      value={totalTemplates}              iconColor="#f59e0b" iconBg="#fef3c7" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick actions */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#999" }}>Quick Actions</h2>
          <QuickAction href="/admin/cards/new"  icon={PlusCircle} label="New Card"      desc="Create a new digital business card" color="#900a7d" />
          <QuickAction href="/admin/cards"       icon={CreditCard} label="All Cards"     desc="View and manage all cards"          color="#1e9bd7" />
          <QuickAction href="/admin/templates"   icon={Layers}     label="Templates"     desc="Manage color themes"                color="#10b981" />
          <QuickAction href="/admin/users"       icon={Users}      label="Users"         desc={`${totalUsers} admin user${totalUsers !== 1 ? "s" : ""}`} color="#f59e0b" />
        </div>

        {/* Recent cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#999" }}>Recent Cards</h2>
            <Link href="/admin/cards" className="text-xs font-semibold hover:underline" style={{ color: "#1e9bd7" }}>
              View all →
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e8eaed", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            {recentCards.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm" style={{ color: "#999" }}>No cards yet.</p>
                <Link href="/admin/cards/new" className="inline-block mt-3 text-sm font-semibold hover:underline" style={{ color: "#900a7d" }}>
                  Create your first card →
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #f0f4f8" }}>
                    {["Name", "Link", "Views", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: "#999", background: "#fafafa" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentCards.map((card, i) => (
                    <tr key={card.id} style={{ borderBottom: i < recentCards.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: card.template?.accentColor ?? "#900a7d" }}>
                            {card.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{card.name}</p>
                            {card.jobTitle && <p className="text-xs" style={{ color: "#999" }}>{card.jobTitle}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <a href={`/card/${card.slug}`} target="_blank"
                          className="text-xs font-medium hover:underline" style={{ color: "#1e9bd7" }}>
                          /{card.slug}
                        </a>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1 text-sm" style={{ color: "#555" }}>
                          <Eye size={12} /> {card.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={card.active
                            ? { background: "#d1fae5", color: "#059669" }
                            : { background: "#f5f5f5", color: "#999" }}>
                          {card.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
