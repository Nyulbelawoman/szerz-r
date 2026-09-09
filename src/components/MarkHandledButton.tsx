"use client";

import { useRouter } from "next/navigation";

export default function MarkHandledButton({
  deadlineId,
  handled,
}: {
  deadlineId: string;
  handled: boolean;
}) {
  const router = useRouter();

  async function toggle() {
    await fetch(`/api/deadlines/${deadlineId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: handled ? "open" : "handled" }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        handled
          ? "border border-slate-300 text-slate-600 hover:bg-slate-50"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {handled ? "Újra megnyit" : "Késznek jelöl"}
    </button>
  );
}
