"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const PURPLE = "#900a7d";
const BLUE   = "#1e9bd7";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("Pogrešan email ili lozinka.");
      } else if (res?.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Greška pri prijavi. Pokušajte ponovo.");
      }
    } catch (err) {
      console.error("signIn error:", err);
      setError("Greška pri konekciji. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#f0f2f5" }}>

      {/* ── Lijevi panel — SAMO LOGO, čisto ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-[420px] flex-shrink-0"
        style={{ background: `linear-gradient(160deg, #1a0a20 0%, ${PURPLE} 100%)` }}
      >
        {/* Logo */}
        <div
          className="rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            width: "160px",
            height: "160px",
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          <Image
            src="/mojsan-logo.png"
            alt="MojSan"
            width={144}
            height={144}
            className="object-contain"
            style={{ padding: "8px" }}
          />
        </div>

        {/* Samo brand ime ispod logoa */}
        <div className="text-center mt-6">
          <p className="text-white font-black text-2xl tracking-tight">MojSan®</p>
          <p className="font-bold text-base mt-1" style={{ color: BLUE }}>VCard Platform</p>
        </div>
      </div>

      {/* ── Desni panel — forma ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
              style={{ background: PURPLE }}
            >
              <Image src="/mojsan-logo.png" alt="MojSan" width={48} height={48} className="object-contain p-1" />
            </div>
            <div>
              <p className="font-black text-lg leading-none" style={{ color: "#1a1a1a" }}>MojSan VCard</p>
              <p className="text-xs mt-0.5" style={{ color: "#888" }}>Admin Panel</p>
            </div>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: "#1a1a1a" }}>Dobrodošli nazad</h1>
          <p className="text-sm mb-7" style={{ color: "#666" }}>Prijavite se u admin panel</p>

          {error && (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm"
              style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1a1a1a" }}>
                Email adresa
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="admin@mojsan.ba"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "#fff", border: "1.5px solid #e2e8f0", color: "#1a1a1a" }}
                onFocus={e => (e.currentTarget.style.borderColor = PURPLE)}
                onBlur={e  => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1a1a1a" }}>
                Lozinka
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all"
                  style={{ background: "#fff", border: "1.5px solid #e2e8f0", color: "#1a1a1a" }}
                  onFocus={e => (e.currentTarget.style.borderColor = PURPLE)}
                  onBlur={e  => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#aaa" }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
              style={{ background: PURPLE, boxShadow: "0 4px 16px rgba(144,10,125,0.35)" }}
            >
              {loading ? "Prijavljivanje..." : "Prijavi se"}
            </button>
          </form>

          <div className="mt-8 pt-6" style={{ borderTop: "1px solid #e8eaed" }}>
            <p className="text-xs text-center" style={{ color: "#bbb" }}>
              MojSan® VCard — Digitalne vizit kartice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
