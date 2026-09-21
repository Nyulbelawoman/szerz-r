"use client";

import { useState } from "react";

type Contract = { id: string; title: string; status: string; created_at: string };
type User = { email: string; plan: string; created_at: string; contracts: Contract[] };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"pro" | "free">("pro");
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/set-plan", { headers: { "x-admin-password": password } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || "Hibás jelszó.");
      } else {
        setUsers(data.users || []);
        setMessage("");
      }
    } catch {
      setMessage("Hálózati hiba.");
    } finally {
      setLoading(false);
    }
  }

  async function setPlanSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/set-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, email, plan }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || "Hiba történt.");
      } else {
        setMessage(`✅ ${email} → ${plan === "pro" ? "Pro" : "Ingyenes"} beállítva.`);
        setUsers(data.users || []);
        setEmail("");
      }
    } catch {
      setMessage("Hálózati hiba.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-2xl font-bold text-slate-900">Admin – csomagkezelés</h1>

      <div className="card mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Admin jelszó</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={load} disabled={loading} className="btn-ghost w-full">
          Felhasználók betöltése
        </button>
      </div>

      <form onSubmit={setPlanSubmit} className="card mt-6 space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Csomag beállítása</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">E-mail cím</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="felhasznalo@example.com" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Csomag</label>
          <select className="input" value={plan} onChange={(e) => setPlan(e.target.value as "pro" | "free")}>
            <option value="pro">Pro</option>
            <option value="free">Ingyenes</option>
          </select>
        </div>
        {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          Mentés
        </button>
      </form>

      {users.length > 0 && (
        <div className="mt-6 space-y-4">
          {users.map((u) => (
            <div key={u.email} className="card overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{u.email}</p>
                  <p className="text-xs text-slate-500">
                    Regisztrált: {new Date(u.created_at).toLocaleDateString("hu-HU")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.plan === "pro" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                    {u.plan === "pro" ? "Pro" : "Ingyenes"}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                    {u.contracts.length} szerződés
                  </span>
                </div>
              </div>
              {u.contracts.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {u.contracts.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <a href={`/contract/${c.id}`} className="min-w-0 flex-1 truncate text-slate-700 hover:underline">
                        {c.title}
                      </a>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        c.status === "done" ? "bg-emerald-100 text-emerald-700" : c.status === "error" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {c.status === "done" ? "kész" : c.status === "error" ? "hiba" : c.status}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {new Date(c.created_at).toLocaleDateString("hu-HU")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-sm text-slate-400">Még nincs szerződése.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
