"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus, Trash2, Save, X, KeyRound,
  UserCircle2, ShieldCheck, Eye, EyeOff,
} from "lucide-react";

interface AdminUser { id: string; email: string; createdAt: string | Date; }

function PasswordInput({ value, onChange, placeholder = "••••••••" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2.5 pr-10 text-sm outline-none"
        style={{ border: "1.5px solid #e2e8f0", background: "#fff", color: "#1a1a1a" }}
        onFocus={e => e.currentTarget.style.borderColor = "#900a7d"}
        onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
      />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#aaa" }}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function UserManager({ initialUsers }: { initialUsers: AdminUser[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);

  // Create state
  const [creating, setCreating]     = useState(false);
  const [newEmail, setNewEmail]     = useState("");
  const [newPass, setNewPass]       = useState("");
  const [newPass2, setNewPass2]     = useState("");
  const [saving, setSaving]         = useState(false);

  // Change password state
  const [changingId, setChangingId]   = useState<string | null>(null);
  const [chPass, setChPass]           = useState("");
  const [chPass2, setChPass2]         = useState("");
  const [changing, setChanging]       = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleCreate() {
    if (!newEmail.trim()) { toast.error("Email is required"); return; }
    if (newPass.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (newPass !== newPass2) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setUsers([data, ...users]);
      setCreating(false); setNewEmail(""); setNewPass(""); setNewPass2("");
      toast.success("User created!");
      router.refresh();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  }

  async function handleChangePassword(id: string) {
    if (chPass.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (chPass !== chPass2) { toast.error("Passwords do not match"); return; }
    setChanging(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: chPass }),
      });
      if (!res.ok) throw new Error();
      setChangingId(null); setChPass(""); setChPass2("");
      toast.success("Password updated!");
    } catch { toast.error("Error updating password"); }
    finally { setChanging(false); }
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setUsers(users.filter(u => u.id !== id));
      toast.success("User deleted");
      router.refresh();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error"); }
    finally { setDeleting(null); }
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* Create new user button */}
      <button
        onClick={() => { setCreating(!creating); setChangingId(null); }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
        style={{ background: creating ? "#900a7d" : "#1e9bd7", boxShadow: creating ? "0 4px 14px rgba(144,10,125,0.3)" : "0 4px 14px rgba(30,155,215,0.3)" }}>
        {creating ? <X size={16} /> : <Plus size={16} />}
        {creating ? "Cancel" : "New user"}
      </button>

      {/* Create form */}
      {creating && (
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f5e6f4" }}>
              <UserCircle2 size={16} style={{ color: "#900a7d" }} />
            </div>
            <h3 className="font-bold text-base" style={{ color: "#1a1a1a" }}>Create new admin user</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#888" }}>Email address</label>
              <input
                type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ border: "1.5px solid #e2e8f0", background: "#fff", color: "#1a1a1a" }}
                onFocus={e => e.currentTarget.style.borderColor = "#900a7d"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#888" }}>Password (min. 8 characters)</label>
              <PasswordInput value={newPass} onChange={setNewPass} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#888" }}>Confirm password</label>
              <PasswordInput value={newPass2} onChange={setNewPass2} placeholder="Repeat password" />
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={handleCreate} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
              style={{ background: "#900a7d", boxShadow: "0 4px 14px rgba(144,10,125,0.3)" }}>
              <Save size={15} /> {saving ? "Creating..." : "Create user"}
            </button>
            <button onClick={() => setCreating(false)}
              className="px-4 py-2.5 text-sm font-medium rounded-xl"
              style={{ color: "#555", background: "#f5f7fa", border: "1.5px solid #e2e8f0" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* User list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {users.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: "#999" }}>No users found.</p>
          </div>
        ) : (
          <div>
            {users.map((user, i) => (
              <div key={user.id}>
                {/* User row */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: "#900a7d" }}>
                      {user.email.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate" style={{ color: "#1a1a1a" }}>{user.email}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: "#f5e6f4", color: "#900a7d" }}>
                          <ShieldCheck size={9} /> Admin
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "#999" }}>
                        Created: {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => { setChangingId(changingId === user.id ? null : user.id); setChPass(""); setChPass2(""); }}
                        title="Change password"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: changingId === user.id ? "#f5e6f4" : "#e8f4fc", color: changingId === user.id ? "#900a7d" : "#1e9bd7" }}>
                        <KeyRound size={12} /> Password
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.email)}
                        disabled={deleting === user.id || users.length === 1}
                        title={users.length === 1 ? "Cannot delete the last admin" : "Delete user"}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: "#888" }}
                        onMouseEnter={e => { if (users.length > 1) { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Change password inline form */}
                  {changingId === user.id && (
                    <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid #f0f4f8" }}>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#888" }}>Change password for {user.email}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: "#888" }}>New password</label>
                          <PasswordInput value={chPass} onChange={setChPass} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: "#888" }}>Confirm</label>
                          <PasswordInput value={chPass2} onChange={setChPass2} placeholder="Repeat password" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleChangePassword(user.id)} disabled={changing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 disabled:opacity-60"
                          style={{ background: "#900a7d" }}>
                          <Save size={13} /> {changing ? "Saving..." : "Save password"}
                        </button>
                        <button onClick={() => setChangingId(null)}
                          className="px-3 py-2 text-xs font-medium rounded-xl"
                          style={{ color: "#555", background: "#f5f7fa", border: "1px solid #e2e8f0" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {i < users.length - 1 && <div className="h-px mx-6" style={{ background: "#f0f4f8" }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
