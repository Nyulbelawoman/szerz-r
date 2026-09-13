"use client";

import { useState } from "react";

type User = { email: string; plan: string; created_at: string };

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
        <div className="card mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2">E-mail</th>
                <th className="px-4 py-2">Csomag</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-slate-700">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.plan === "pro" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                      {u.plan === "pro" ? "Pro" : "Ingyenes"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
