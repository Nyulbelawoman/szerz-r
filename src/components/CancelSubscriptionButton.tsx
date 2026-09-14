"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelSubscriptionButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function cancel() {
    const sure = window.confirm(
      "Biztosan lemondod a Pro előfizetést?\n\nA lemondás után megszűnik a havi számlázás, és a fiókod visszaáll Ingyenesre (1 szerződés, nincs emlékeztető)."
    );
    if (!sure) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setMessage({ ok: true, text: data.message || "Előfizetés lemondva." });
        router.refresh();
      } else {
        setMessage({ ok: false, text: data.message || data.error || "A lemondás nem sikerült." });
      }
    } catch {
      setMessage({ ok: false, text: "Hálózati hiba. Próbáld újra." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={cancel}
        disabled={busy}
        className="btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Lemondás folyamatban…" : "Előfizetés lemondása"}
      </button>
      {message && (
        <p className={`max-w-xs text-right text-xs ${message.ok ? "text-emerald-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
