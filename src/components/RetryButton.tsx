"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RetryButton({ contractId }: { contractId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function retry() {
    setLoading(true);
    try {
      await fetch(`/api/contracts/${contractId}/retry`, { method: "POST" });
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={retry}
      disabled={loading}
      className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
    >
      {loading ? "Újrapróbálás…" : "Újra"}
    </button>
  );
}
