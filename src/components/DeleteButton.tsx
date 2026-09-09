"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ contractId }: { contractId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function doDelete() {
    setLoading(true);
    await fetch(`/api/contracts/${contractId}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs font-medium text-slate-400 transition hover:text-red-600"
      >
        Szerződés törlése
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
      <span className="text-slate-500">
        Biztosan? A szerződés, a határidők és az emlékeztetők is törlődnek.
      </span>
      <button
        onClick={doDelete}
        disabled={loading}
        className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Törlés…" : "Törlés"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50"
      >
        Mégse
      </button>
    </div>
  );
}
