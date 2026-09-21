"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trackPixel } from "@/lib/pixel";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, marketing_opt_in: marketingOptIn }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Valami hiba történt.");
        setLoading(false);
        return;
      }
      if (isSignup) {
        trackPixel("CompleteRegistration");
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Hálózati hiba – próbálja újra.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-xl font-bold text-slate-900">
        {isSignup ? "Hozzon létre fiókot" : "Jelentkezzen be a SzerzŐrbe"}
      </h1>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
          Jelszó
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignup && (
          <p className="mt-1 text-xs text-slate-400">Legalább 8 karakter.</p>
        )}
      </div>
      {isSignup && (
        <label className="flex items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
          />
          <span>
            Szeretnék e-mailt kapni <strong>ajánlatokról és hasznos tippekről</strong>. Bármikor
            leiratkozhatok.
          </span>
        </label>
      )}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Kérem várjon…" : isSignup ? "Fiók létrehozása" : "Bejelentkezés"}
      </button>
      <p className="text-center text-sm text-slate-500">
        {isSignup ? (
          <>
            Már van fiókja?{" "}
            <Link href="/signin" className="font-medium text-brand-600 hover:underline">
              Bejelentkezés
            </Link>
          </>
        ) : (
          <>
            Először jár itt?{" "}
            <Link href="/signup" className="font-medium text-brand-600 hover:underline">
              Fiók létrehozása
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
