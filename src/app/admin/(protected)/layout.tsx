import { headers } from "next/headers";
import AdminHeader from "@/components/admin/AdminHeader";
import { Toaster } from "react-hot-toast";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Auth is enforced by middleware.ts — user info is forwarded as request headers
  const h = await headers();
  const email = h.get("x-user-email") ?? undefined;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f2f5" }}>
      {/* Gradient header sa logoom i navigacijom */}
      <AdminHeader email={email} />

      {/* Sadržaj stranice */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#1a1a1a",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#900a7d", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </div>
  );
}
